import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, db } from "../firebase/config";
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
  Category,
  Transaction,
  TransactionToDelete,
} from "../types";
import useSort from "../hooks/useSort";

export const fetchBudgets = createAsyncThunk(
  "budgets/fetchBudgets",
  async (sortOptions: SortOptions) => {
    const { sortBy, descending } = sortOptions;

    const currentUserID = auth.currentUser?.uid;

    const budgetsQuery = query(
      collection(db, "budgets"),
      where("usersWithAccess", "array-contains", currentUserID)
    );

    const querySnapshot = await getDocs(budgetsQuery);

    const budgets = querySnapshot.docs.map(
      (doc) => ({ budgetID: doc.id, ...doc.data() } as Budget)
    );

    const sortedBudget = useSort(budgets, `${sortBy}`);

    return !descending ? sortedBudget : sortedBudget.reverse();
  }
);

export const fetchSelectedBudgetInfo = createAsyncThunk(
  "budgets/fetchSelectedBudgetInfo",
  async (_, { getState }) => {
    const state = getState() as State;
    const selectedBudgetID = state.budgets.budgetID;

    const docRef = doc(db, "budgets", `${selectedBudgetID}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
  }
);

export const deleteBudget = createAsyncThunk(
  "budgets/deleteBudget",
  async (id: string) => {
    const currentUserID = auth.currentUser?.uid;

    if (!currentUserID) return;

    const transactions = await getDocs(
      collection(db, `budgets/${id}/transactions`)
    );

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
  async () => {
    const currentUserID = auth.currentUser?.uid;

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
  async (newBudget: NewBudget) => {
    const currentUserID = auth.currentUser?.uid;
    const currentUserEmail = auth.currentUser?.email;

    if (!currentUserEmail || !currentUserID) return;

    const currentDate = new Date(
      Timestamp.now().seconds * 1000
    ).toLocaleString();

    const createdBudget = {
      ...newBudget,
      timestamp: Timestamp.now().seconds,
      ownerID: currentUserID,
      ownerEmail: currentUserEmail,
      addDate: currentDate,
      usersWithAccess: arrayUnion(currentUserID),
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
      id: newBudgetRef.id,
    });

    return {
      budgetID: newBudgetRef.id,
      ...createdBudget,
    } as unknown as Budget;
  }
);

export const addCategory = createAsyncThunk(
  "users/addCategory",
  async (category: Category, { getState }) => {
    const state = getState() as State;
    const selectedBudgetID = state.budgets.budgetID;

    const { categoryName, type } = category;

    await updateDoc(
      doc(db, "budgets", selectedBudgetID),
      type === "expense"
        ? {
            expenseCategories: arrayUnion(categoryName),
          }
        : {
            incomeCategories: arrayUnion(categoryName),
          }
    );

    return category;
  }
);

export const deleteCategory = createAsyncThunk(
  "users/deleteCategory",
  async (category: Category, { getState }) => {
    const state = getState() as State;
    const selectedBudgetID = state.budgets.budgetID;

    const { categoryName, type } = category;

    await updateDoc(
      doc(db, "budgets", selectedBudgetID),
      type === "expense"
        ? {
            expenseCategories: arrayRemove(categoryName),
          }
        : {
            incomeCategories: arrayRemove(categoryName),
          }
    );

    return category;
  }
);

export const fetchTransactions = createAsyncThunk(
  "fetchTransactions",
  async (sortOptions: SortOptions, { getState }) => {
    const { sortBy, descending } = sortOptions;

    const state = getState() as State;

    const budgetID = state.budgets.budgetID;
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
  async (transactionToDelete: TransactionToDelete, { getState }) => {
    const state = getState() as State;

    const budgetID = state.budgets.budgetID;

    if (!budgetID) return;

    const transactions = await getDocs(
      collection(db, `budgets/${budgetID}/transactions`)
    );

    let transactionAmount = 0;

    for (const transaction of transactions.docs) {
      if (transaction.id === transactionToDelete.id) {
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
  async (_, { getState }) => {
    const state = getState() as State;

    const budgetID = state.budgets.budgetID;
    if (!budgetID) return;

    const transactions = await getDocs(
      collection(db, `budgets/${budgetID}/transactions`)
    );

    let allTransactionsAmount = 0;

    for (const transaction of transactions.docs) {
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
  async (transaction: Transaction, { getState }) => {
    const state = getState() as State;

    const budgetID = state.budgets.budgetID;
    if (!budgetID) return;

    const currentDate = new Date(
      Timestamp.now().seconds * 1000
    ).toLocaleString();

    const transactionData = {
      ...transaction,
      type: transaction.type,
      timestamp: Timestamp.now().seconds,
      date: currentDate,
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
  async (editedTransaction: Transaction, { getState }) => {
    const state = getState() as State;

    const budgetID = state.budgets.budgetID;
    if (!budgetID) return;

    let budgetDiff = 0;

    const transactions = await getDocs(
      collection(db, "budgets", budgetID, "transactions")
    );

    const currentDate = new Date(
      Timestamp.now().seconds * 1000
    ).toLocaleString();

    for (const transaction of transactions.docs) {
      if (transaction.id === editedTransaction.id) {
        const transactionRef = doc(
          db,
          "budgets",
          budgetID,
          "transactions",
          transaction.id
        );

        const validatedEditedTransaction = {
          id: editedTransaction.id,
          date: editedTransaction.date,
          timestamp: Timestamp.now().seconds,
          editDate: currentDate,
          type: editedTransaction.type,
          category:
            editedTransaction.category !== ""
              ? editedTransaction.category
              : transaction.data().category,
          amount:
            editedTransaction.amount !== 0
              ? editedTransaction.amount
              : transaction.data().amount,
        };

        await updateDoc(transactionRef, validatedEditedTransaction);

        const { type, amount } = transaction.data();

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
        };
      }
    }
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
  } as BudgetsSlice,
  reducers: {
    setSelectedBudgetID: (state, action) => {
      state.budgetID = action.payload.budgetID;
    },
    setSelectedOption: (state, action) => {
      state.selectedOption = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchSelectedBudgetInfo.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.budgetValue = action.payload.budgetValue;
        state.addDate = action.payload.addDate;
        state.incomeCategories = action.payload.incomeCategories;
        state.expenseCategories = action.payload.expenseCategories;
        state.currencyType = action.payload.currencyType;
        state.budgetName = action.payload.budgetName;
        state.incomesValue = action.payload.incomesValue;
        state.expensesValue = action.payload.expensesValue;
      })

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

          if (action.payload.type === "expense") {
            state.expensesValue -= budgetDiff;
          } else if (action.payload.type === "income") {
            state.incomesValue += budgetDiff;
          }
        }
      });
  },
});

export const { setSelectedBudgetID } = budgetsSlice.actions;
export const { setSelectedOption } = budgetsSlice.actions;

export default budgetsSlice.reducer;
