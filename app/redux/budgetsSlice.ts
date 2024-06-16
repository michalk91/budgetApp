import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase/config";
import {
  doc,
  updateDoc,
  where,
  Timestamp,
  deleteDoc,
  addDoc,
  collection,
  getDocs,
  query,
  arrayUnion,
  arrayRemove,
  getDoc,
  increment,
  orderBy,
} from "firebase/firestore";
import type {
  SortOptions,
  Budget,
  NewBudget,
  BudgetsSlice,
  State,
  CategoryArgs,
  Transaction,
  DeleteTransactionArgs,
  FetchArgs,
  EditedTransactionArgs,
  AddTransactionArgs,
} from "../types";
import useSort from "../hooks/useSort";

export const fetchBudgets = createAsyncThunk(
  "budgets/fetchBudgets",
  async (sortOptions: SortOptions, { getState }) => {
    const state = getState() as State;

    const { sortBy, descending } = sortOptions;

    const currentUserID = state.user.userID;

    const yourBudgetsQuery = query(
      collection(db, "budgets"),
      where("ownerID", "==", currentUserID)
    );

    const querySnapYourBudgets = await getDocs(yourBudgetsQuery);

    const yourBudgets = querySnapYourBudgets.docs.map(
      (doc) => ({ budgetID: doc.id, ...doc.data() } as Budget)
    );

    const sharedBudgetsQuery = query(
      collection(db, "budgets"),
      where("usersWithAccess", "array-contains", currentUserID)
    );
    const querySnapSharedBudgets = await getDocs(sharedBudgetsQuery);

    const sharedBudgets = querySnapSharedBudgets.docs.map(
      (doc) => ({ budgetID: doc.id, ...doc.data() } as Budget)
    );
    const combinedBudgets = [...yourBudgets, ...sharedBudgets];

    const sortedBudget = useSort(combinedBudgets, `${sortBy}`);

    return !descending ? sortedBudget : sortedBudget.reverse();
  }
);

export const fetchSelectedBudgetInfo = createAsyncThunk(
  "budgets/fetchSelectedBudgetInfo",
  async (budgetID: string, { getState }) => {
    const state = getState() as State;

    const userID = state.user.userID;

    if (!budgetID || budgetID === "") return;

    const docRef = doc(db, "budgets", `${budgetID}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      if (data.ownerID !== userID && !data.usersWithAccess.includes(userID)) {
        throw Error("You are not authorized to view this budget.");
      } else {
        return data;
      }
    }
  }
);

export const deleteBudget = createAsyncThunk(
  "budgets/deleteBudget",
  async (id: string, { getState }) => {
    const state = getState() as State;

    const currentUserID = state.user.userID;

    if (!currentUserID) return;

    const transactions = await getDocs(
      collection(db, `budgets/${id}/transactions`)
    );

    const invitations = await getDocs(
      query(collection(db, "invitations"), where("budgetID", "==", id))
    );

    for (const invitation of invitations.docs) {
      await deleteDoc(doc(db, "invitations", invitation.id));
    }

    for (const transaction of transactions.docs) {
      await deleteDoc(doc(db, `budgets/${id}/transactions`, transaction.id));
    }

    const budgets = await getDocs(
      query(collection(db, "budgets"), where("ownerID", "==", currentUserID))
    );

    for (const budget of budgets.docs) {
      if (budget.id === id) {
        await deleteDoc(doc(db, "budgets", budget.id));
      }
    }

    return {
      id,
    };
  }
);

export const deleteAllBudgets = createAsyncThunk(
  "budgets/deleteAllBudgets",
  async (_, { getState }) => {
    const state = getState() as State;

    const currentUserID = state.user.userID;

    if (!currentUserID) return;

    const budgets = await getDocs(
      query(collection(db, "budgets"), where("ownerID", "==", currentUserID))
    );

    for (const budget of budgets.docs) {
      const transactions = await getDocs(
        collection(db, `budgets/${budget.id}/transactions`)
      );

      for (const transaction of transactions.docs) {
        await deleteDoc(
          doc(db, `budgets/${budget.id}/transactions`, transaction.id)
        );
      }

      for (const budget of budgets.docs) {
        await deleteDoc(doc(db, "budgets", budget.id));
      }
    }

    return { budgets: [] };
  }
);

export const addNewBudget = createAsyncThunk(
  "budgets/addNewBudget",
  async (newBudget: NewBudget, { getState }) => {
    const state = getState() as State;

    const currentUserID = state.user.userID;

    const currentUserEmail = state.user.email;

    const username = state.user.username;

    if (!currentUserEmail || !currentUserID) return;

    const currentDate = new Date(
      Timestamp.now().seconds * 1000
    ).toLocaleString();

    const createdBudget = {
      ...newBudget,
      timestamp: Timestamp.now().seconds,
      ownerID: currentUserID,
      ownerEmail: currentUserEmail,
      ownerUsername: username,
      addDate: currentDate,
      usersWithAccess: [],
      currencyType: newBudget.currencyType,
      expensesValue: 0,
      incomesValue: 0,
      expenseCategories: [
        "Shops",
        "Food",
        "Healthcare",
        "Entertainment",
        "Personal care",
        "Other",
      ],
      incomeCategories: ["Salary", "Bonus", "Additional job"],
    };

    const newBudgetRef = await addDoc(collection(db, "budgets"), createdBudget);

    await updateDoc(doc(db, "budgets", newBudgetRef.id), {
      budgetID: newBudgetRef.id,
    });

    return {
      budgetID: newBudgetRef.id,
      ...createdBudget,
    } as unknown as Budget;
  }
);

export const addCategory = createAsyncThunk(
  "users/addCategory",
  async ({ budgetID, category }: CategoryArgs, { getState }) => {
    const state = getState() as State;

    const currentUserID = state.user.userID;

    const { categoryName, type } = category;

    const budgetRef = doc(db, "budgets", budgetID);

    const budgetSnap = await getDoc(budgetRef);

    if (budgetSnap.exists()) {
      if (
        !budgetSnap.data().allowManageCategories.includes(currentUserID) &&
        budgetSnap.data().ownerID !== currentUserID
      )
        throw Error("Insufficient permissions to perform this action");

      await updateDoc(
        doc(db, "budgets", budgetID),
        type === "expense"
          ? {
              expenseCategories: arrayUnion(categoryName),
            }
          : {
              incomeCategories: arrayUnion(categoryName),
            }
      );
    }
    return category;
  }
);

export const deleteCategory = createAsyncThunk(
  "users/deleteCategory",
  async ({ category, budgetID }: CategoryArgs, { getState }) => {
    const state = getState() as State;

    const currentUserID = state.user.userID;

    const { categoryName, type } = category;

    const budgetRef = doc(db, "budgets", budgetID);

    const budgetSnap = await getDoc(budgetRef);

    if (budgetSnap.exists()) {
      if (
        !budgetSnap.data().allowManageCategories.includes(currentUserID) &&
        budgetSnap.data().ownerID !== currentUserID
      )
        throw Error("Insufficient permissions to perform this action");

      await updateDoc(
        doc(db, "budgets", budgetID),
        type === "expense"
          ? {
              expenseCategories: arrayRemove(categoryName),
            }
          : {
              incomeCategories: arrayRemove(categoryName),
            }
      );
    }
    return category;
  }
);

export const fetchTransactions = createAsyncThunk(
  "fetchTransactions",
  async ({ budgetID, sortOptions }: FetchArgs) => {
    const { sortBy, descending } = sortOptions;

    if (!budgetID) return;

    const transactionsQuery = query(
      collection(db, `budgets/${budgetID}/transactions`),
      descending ? orderBy(`${sortBy}`, `desc`) : orderBy(`${sortBy}`)
    );

    const querySnapshot = await getDocs(transactionsQuery);

    const transactions = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Transaction)
    );
    return transactions;
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (
    { budgetID, transactionToDelete }: DeleteTransactionArgs,
    { getState }
  ) => {
    const state = getState() as State;

    const currentUserID = state.user.userID;

    if (!budgetID || !currentUserID) return;

    const transactions = await getDocs(
      collection(db, `budgets/${budgetID}/transactions`)
    );

    let transactionAmount = 0;
    let havePermissionToDelete = false;

    const budgetRef = doc(db, "budgets", budgetID);

    const budgetSnap = await getDoc(budgetRef);

    if (budgetSnap.exists()) {
      havePermissionToDelete =
        budgetSnap.data().allowManageAllTransactions.includes(currentUserID) ||
        budgetSnap.data().ownerID.includes(currentUserID);
    }

    for (const transaction of transactions.docs) {
      if (transaction.id === transactionToDelete.id) {
        if (
          transaction.data().ownerID !== currentUserID &&
          !havePermissionToDelete
        ) {
          throw Error("Unauthorized action");
        }

        await deleteDoc(
          doc(db, `budgets/${budgetID}/transactions`, transaction.id)
        );

        transactionAmount = transaction.data().amount;
      }
    }

    await updateDoc(
      doc(db, `budgets`, budgetID),
      transactionToDelete.type === "expense"
        ? {
            budgetValue: increment(transactionAmount),
            expensesValue: increment(-transactionAmount),
          }
        : {
            budgetValue: increment(-transactionAmount),
            incomesValue: increment(-transactionAmount),
          }
    );

    return {
      id: transactionToDelete.id,
      transactionAmount,
      type: transactionToDelete.type,
    };
  }
);

export const deleteAllTransactions = createAsyncThunk(
  "transactions/deleteAllTransactions",
  async (budgetID: string, { getState }) => {
    const state = getState() as State;

    const currentUserID = state.user.userID;

    if (!budgetID || !currentUserID) return;

    const transactions = await getDocs(
      collection(db, `budgets/${budgetID}/transactions`)
    );

    let allTransactionsAmount = 0;

    let havePermissionToDelete = false;

    const budgetRef = doc(db, "budgets", budgetID);

    const budgetSnap = await getDoc(budgetRef);

    if (budgetSnap.exists()) {
      havePermissionToDelete = budgetSnap
        .data()
        .allowManageAllTransactions.includes(currentUserID);
    }

    for (const transaction of transactions.docs) {
      if (
        transaction.data().ownerID !== currentUserID &&
        !havePermissionToDelete
      ) {
        throw Error("Unauthorized action");
      }

      allTransactionsAmount =
        transaction.data().type === "expense"
          ? allTransactionsAmount + transaction.data().amount
          : allTransactionsAmount - transaction.data().amount;

      await deleteDoc(
        doc(db, `budgets/${budgetID}/transactions`, transaction.id)
      );
    }
    await updateDoc(doc(db, "budgets", budgetID), {
      budgetValue: increment(allTransactionsAmount),
      expensesValue: 0,
      incomesValue: 0,
    });

    return { transactions: [], allTransactionsAmount };
  }
);

export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async ({ budgetID, transaction }: AddTransactionArgs, { getState }) => {
    const state = getState() as State;

    const userID = state.user.userID;

    const username = state.user.username;

    if (!budgetID || !userID || !username) return;

    const currentDate = new Date(
      Timestamp.now().seconds * 1000
    ).toLocaleString();

    const transactionData = {
      ...transaction,
      type: transaction.type,
      timestamp: Timestamp.now().seconds,
      date: currentDate,
      ownerID: userID,
      ownerUsername: username,
      comment: transaction.comment,
    };

    const transactionRef = await addDoc(
      collection(db, `budgets/${budgetID}/transactions`),
      transactionData
    );

    const newTransaction = { id: transactionRef.id, ...transactionData };

    await updateDoc(
      doc(db, `budgets`, budgetID),
      transaction.type === "expense"
        ? {
            budgetValue: increment(-transactionData.amount),
            expensesValue: increment(transactionData.amount),
          }
        : {
            budgetValue: increment(transactionData.amount),
            incomesValue: increment(transactionData.amount),
          }
    );

    return newTransaction;
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async (
    { budgetID, editedTransaction }: EditedTransactionArgs,
    { getState }
  ) => {
    const state = getState() as State;

    const currentUserID = state.user.userID;

    if (!budgetID || !currentUserID) return;

    let budgetDiff = 0;

    let havePermissionToDelete = false;

    const budgetRef = doc(db, "budgets", budgetID);

    const budgetSnap = await getDoc(budgetRef);

    if (budgetSnap.exists()) {
      havePermissionToDelete =
        budgetSnap.data().allowManageAllTransactions.includes(currentUserID) ||
        budgetSnap.data().ownerID.includes(currentUserID);
    }

    const transactions = await getDocs(
      collection(db, "budgets", budgetID, "transactions")
    );

    const currentDate = new Date(
      Timestamp.now().seconds * 1000
    ).toLocaleString();

    for (const transaction of transactions.docs) {
      if (transaction.id === editedTransaction.id) {
        if (
          transaction.data().ownerID !== currentUserID &&
          !havePermissionToDelete
        ) {
          throw Error("Unauthorized action");
        }

        const transactionRef = doc(
          db,
          "budgets",
          budgetID,
          "transactions",
          transaction.id
        );

        const {
          type,
          amount,
          ownerID,
          ownerEmail,
          ownerUsername,
          category,
          comment,
        } = transaction.data();

        const validatedEditedTransaction = {
          id: editedTransaction.id,
          date: editedTransaction.date,
          timestamp: Timestamp.now().seconds,
          editDate: currentDate,
          type: editedTransaction.type,
          category:
            editedTransaction.category !== ""
              ? editedTransaction.category
              : category,
          amount:
            editedTransaction.amount !== 0 ? editedTransaction.amount : amount,
          comment:
            editedTransaction.comment !== ""
              ? editedTransaction.comment
              : comment,
        };

        await updateDoc(transactionRef, validatedEditedTransaction);

        if (amount !== validatedEditedTransaction.amount) {
          budgetDiff =
            type === "expense"
              ? amount - validatedEditedTransaction.amount
              : -(amount - validatedEditedTransaction.amount);

          await updateDoc(
            doc(db, "budgets", budgetID),
            editedTransaction.type === "expense"
              ? {
                  budgetValue: increment(budgetDiff),
                  expensesValue: increment(-budgetDiff),
                }
              : {
                  budgetValue: increment(budgetDiff),
                  incomesValue: increment(budgetDiff),
                }
          );
        }
        return {
          validatedEditedTransaction,
          budgetDiff,
          type: editedTransaction.type,
          ownerID,
          ownerEmail,
          ownerUsername,
        };
      }
    }
  }
);

export const leaveBudget = createAsyncThunk(
  "invitations/leaveBudget",
  async (budgetID: string, { getState }) => {
    const state = getState() as State;

    const currentUserID = state.user.userID;

    if (!currentUserID) return;

    await updateDoc(
      doc(db, "budgets", budgetID),

      {
        usersWithAccess: arrayRemove(currentUserID),
      }
    );

    return budgetID;
  }
);

const budgetsSlice = createSlice({
  name: "budgets",
  initialState: {
    budgetValue: 0,
    budgetID: "",
    budgetsArray: [],
    currencyType: "PLN",
    addDate: "",
    incomeCategories: [],
    expenseCategories: [],
    expensesValue: 0,
    incomesValue: 0,
    budgetName: "",
    transactions: [],
    fetchTransactionsStatus: "idle",
    selectedOption: "Expenses",
    allowManageAllTransactions: [],
    allowManageCategories: [],
    showSelectedBudgetError: "",
    ownerID: "",
    ownerUsername: "",
    ownerEmail: "",
  } as BudgetsSlice,
  reducers: {
    setSelectedOption: (state, action) => {
      state.selectedOption = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchSelectedBudgetInfo.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.showSelectedBudgetError = "";
        state.budgetValue = action.payload.budgetValue;
        state.addDate = action.payload.addDate;
        state.incomeCategories = action.payload.incomeCategories;
        state.expenseCategories = action.payload.expenseCategories;
        state.currencyType = action.payload.currencyType;
        state.budgetName = action.payload.budgetName;
        state.incomesValue = action.payload.incomesValue;
        state.expensesValue = action.payload.expensesValue;
        state.allowManageAllTransactions =
          action.payload.allowManageAllTransactions;
        state.allowManageCategories = action.payload.allowManageCategories;
        state.ownerID = action.payload.ownerID;
        state.ownerUsername = action.payload.ownerUsername;
        state.ownerEmail = action.payload.ownerEmail;
      })

      .addCase(fetchSelectedBudgetInfo.rejected, (state, error) => {
        state.showSelectedBudgetError = error.error.message
          ? error.error.message
          : "";
      })

      //----------------------------------------------------------------------------

      .addCase(fetchBudgets.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.budgetsArray = action.payload;
      })

      //---------------------------------------------------------
      .addCase(addNewBudget.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.budgetsArray?.push(action.payload);
        state.currencyType = action.payload.currencyType;
      })

      //------------------------------------------------------------------------
      .addCase(deleteBudget.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.budgetsArray = state.budgetsArray.filter(
          (budget) => budget.budgetID !== action.payload?.id
        );
      })
      //--------------------------------------------------

      .addCase(deleteAllBudgets.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.budgetsArray = action.payload.budgets;
      })

      //-------------------------------------------------

      .addCase(addCategory.fulfilled, (state, action) => {
        if (!action.payload) return;

        const { type, categoryName } = action.payload;

        if (type === "expense") {
          const categoryIndex = state.expenseCategories.findIndex(
            (category) => category === categoryName
          );

          if (categoryIndex === -1) state.expenseCategories.push(categoryName);
        } else if (type === "income") {
          const categoryIndex = state.incomeCategories.findIndex(
            (category) => category === categoryName
          );

          if (categoryIndex === -1) state.incomeCategories.push(categoryName);
        }
      })
      //----------------------------------------------------------
      .addCase(deleteCategory.fulfilled, (state, action) => {
        if (!action.payload) return;

        const { type, categoryName } = action.payload;

        if (type === "expense") {
          state.expenseCategories = state.expenseCategories.filter(
            (category) => category !== categoryName
          );
        } else if (type === "income") {
          state.incomeCategories = state.incomeCategories.filter(
            (category) => category !== categoryName
          );
        }
      })

      //----------------------------------------------------------------------------------
      .addCase(fetchTransactions.pending, (state) => {
        state.fetchTransactionsStatus = "loading";
      })

      .addCase(fetchTransactions.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.transactions = action.payload;
        state.fetchTransactionsStatus = "succeeded";
      })

      //---------------------------------------------------------
      .addCase(addTransaction.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.transactions?.push(action.payload);

        if (action.payload.type === "expense") {
          state.budgetValue -= action.payload.amount;
          state.expensesValue += action.payload.amount;
        } else if (action.payload.type === "income") {
          state.budgetValue += action.payload.amount;
          state.incomesValue += action.payload.amount;
        }
      })

      //------------------------------------------------------------------------
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.transactions = state.transactions.filter(
          (transaction) => transaction.id !== action.payload?.id
        );

        if (action.payload.type === "expense") {
          state.budgetValue += action.payload.transactionAmount;
          state.expensesValue -= action.payload.transactionAmount;
        } else if (action.payload.type === "income") {
          state.budgetValue -= action.payload.transactionAmount;
          state.incomesValue -= action.payload.transactionAmount;
        }
      })
      //--------------------------------------------------

      .addCase(deleteAllTransactions.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.transactions = action.payload.transactions;
        state.budgetValue += action.payload.allTransactionsAmount;
        state.expensesValue = 0;
        state.incomesValue = 0;
      })

      //-------------------------------------------------
      .addCase(updateTransaction.fulfilled, (state, action) => {
        if (!action.payload) return;

        const { validatedEditedTransaction, budgetDiff } = action.payload;

        const transactionIndex = state.transactions.findIndex(
          (transaction) => transaction.id === validatedEditedTransaction.id
        );
        if (transactionIndex !== -1) {
          state.transactions[transactionIndex] = validatedEditedTransaction;
          state.budgetValue += budgetDiff;
          state.transactions[transactionIndex].ownerID = action.payload.ownerID;
          state.transactions[transactionIndex].ownerUsername =
            action.payload.ownerUsername;
          state.transactions[transactionIndex].ownerEmail =
            action.payload.ownerEmail;

          if (action.payload.type === "expense") {
            state.expensesValue -= budgetDiff;
          } else if (action.payload.type === "income") {
            state.incomesValue += budgetDiff;
          }
        }
      })

      //--------------------------------------------------------------------

      .addCase(leaveBudget.fulfilled, (state, action) => {
        state.budgetsArray = state.budgetsArray.filter(
          (budget) => budget.budgetID !== action.payload
        );
      });
  },
});

export const { setSelectedOption } = budgetsSlice.actions;

export default budgetsSlice.reducer;
