import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
  updatePassword,
  updateProfile,
  updateEmail,
  deleteUser,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import {
  setDoc,
  doc,
  updateDoc,
  Timestamp,
  increment,
  getDoc,
  deleteDoc,
  addDoc,
  collection,
  getDocs,
  arrayUnion,
  arrayRemove,
  orderBy,
  query,
} from "firebase/firestore";
import type {
  State,
  User,
  Transaction,
  SortOptions,
  TransactionToDelete,
} from "../types";

export const fetchUserData = createAsyncThunk(
  "users/fetchUserData",
  async () => {
    const currentUserID = auth.currentUser?.uid;

    const docRef = doc(db, "users", `${currentUserID}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
  }
);

export const changePassword = createAsyncThunk(
  "users/changePassword",
  async (newPassword: string) => {
    const user = auth?.currentUser;

    if (!user) return;

    await user.reload();
    await updatePassword(user, newPassword);
  }
);

export const removeUser = createAsyncThunk("users/removeUser", async () => {
  const user = auth?.currentUser;
  const currentUserID = user?.uid;

  if (!user || !currentUserID) return;

  const users = await getDocs(collection(db, "users"));

  for (const currentUser of users.docs) {
    if (currentUser.id === currentUserID) {
      await deleteDoc(doc(db, "users", currentUser.id));
    }
  }

  await user.reload();

  await deleteUser(user);
});

export const changeEmail = createAsyncThunk(
  "users/changeEmail",
  async (newEmail: string) => {
    const user = auth?.currentUser;
    const currentUserID = user?.uid;

    if (!user || !currentUserID) return;

    await user.reload();

    await updateEmail(user, newEmail);

    await updateDoc(doc(db, "users", currentUserID), {
      email: newEmail,
    });
  }
);

export const changeUsername = createAsyncThunk(
  "users/changeUsername",
  async (newUsername: string) => {
    const user = auth?.currentUser;
    const currentUserID = user?.uid;

    if (!user || !currentUserID) return;

    await user.reload();

    await updateProfile(user, {
      displayName: newUsername,
    });

    await updateDoc(doc(db, "users", currentUserID), {
      displayName: newUsername,
    });

    return newUsername;
  }
);

export const fetchTransactions = createAsyncThunk(
  "users/fetchTransactions",
  async (sortOptions: SortOptions) => {
    const { sortBy, descending } = sortOptions;

    const currentUserID = auth.currentUser?.uid;

    const transactionsQuery = query(
      collection(db, `users/${currentUserID}/transactions`),
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

export const setBudget = createAsyncThunk(
  "users/setBudget",
  async (editedBudget: number) => {
    const currentUserID = auth.currentUser?.uid;

    if (!currentUserID) return;

    const budgetAddDate = new Date(
      Timestamp.now().seconds * 1000
    ).toLocaleString();

    await updateDoc(doc(db, "users", currentUserID), {
      budget: editedBudget,
      budgetAddDate,
      expensesValue: 0,
      incomesValue: 0,
    });

    let areTransactions = false;

    const transactionsFromDatabase = await getDocs(
      collection(db, `users/${currentUserID}/transactions`)
    );

    for (const transaction of transactionsFromDatabase.docs) {
      if (transactionsFromDatabase.docs.length === 0) return;

      await deleteDoc(
        doc(db, `users/${currentUserID}/transactions`, transaction.id)
      );
      areTransactions = true;
    }

    return {
      editedBudget,
      budgetAddDate,
      transactions: areTransactions ? [] : undefined,
    };
  }
);

export const addCategory = createAsyncThunk(
  "users/addCategory",
  async (category: string) => {
    const currentUserID = auth.currentUser?.uid;

    if (!currentUserID) return;

    await updateDoc(doc(db, "users", currentUserID), {
      categories: arrayUnion(category),
    });

    return category;
  }
);

export const deleteCategory = createAsyncThunk(
  "users/deleteCategory",
  async (category: string) => {
    const currentUserID = auth.currentUser?.uid;

    if (!currentUserID) return;

    await updateDoc(doc(db, "users", currentUserID), {
      categories: arrayRemove(category),
    });

    return category;
  }
);

export const changeCurrencyType = createAsyncThunk(
  "users/changeCurrencyType",
  async (editedCurrencyType: string) => {
    const currentUserID = auth.currentUser?.uid;

    if (!currentUserID) return;

    await updateDoc(doc(db, "users", currentUserID), {
      currencyType: editedCurrencyType,
    });

    return editedCurrencyType;
  }
);

export const deleteTransaction = createAsyncThunk(
  "users/transactions/deleteTransaction",
  async (transactionToDelete: TransactionToDelete) => {
    const currentUserID = auth.currentUser?.uid;

    if (!currentUserID) return;

    const transactions = await getDocs(
      collection(db, `users/${currentUserID}/transactions`)
    );

    let transactionAmount = 0;

    for (const transaction of transactions.docs) {
      if (transaction.id === transactionToDelete.id) {
        await deleteDoc(
          doc(db, `users/${currentUserID}/transactions`, transaction.id)
        );

        transactionAmount = transaction.data().amount;
      }
    }

    await updateDoc(
      doc(db, "users", currentUserID),
      transactionToDelete.type === "expense"
        ? {
            budget: increment(transactionAmount),
            expensesValue: increment(-transactionAmount),
          }
        : {
            budget: increment(-transactionAmount),
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
  "users/transactions/deleteAllTransactions",
  async () => {
    const currentUserID = auth.currentUser?.uid;

    if (!currentUserID) return;

    const transactions = await getDocs(
      collection(db, `users/${currentUserID}/transactions`)
    );

    let allTransactionsAmount = 0;

    for (const transaction of transactions.docs) {
      allTransactionsAmount =
        transaction.data().type === "expense"
          ? allTransactionsAmount + transaction.data().amount
          : allTransactionsAmount - transaction.data().amount;

      await deleteDoc(
        doc(db, `users/${currentUserID}/transactions`, transaction.id)
      );
    }
    await updateDoc(doc(db, "users", currentUserID), {
      budget: increment(allTransactionsAmount),
      expensesValue: 0,
      incomesValue: 0,
    });

    return { transactions: [], allTransactionsAmount };
  }
);

export const addTransaction = createAsyncThunk(
  "users/transactions/addTransaction",
  async (transaction: Transaction) => {
    const currentUserID = auth.currentUser?.uid;

    if (!currentUserID) return;

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
      collection(db, "users", currentUserID, "transactions"),
      transactionData
    );

    const newTransaction = { id: transactionRef.id, ...transactionData };

    await updateDoc(
      doc(db, "users", currentUserID),
      transaction.type === "expense"
        ? {
            budget: increment(-transactionData.amount),
            expensesValue: increment(transactionData.amount),
          }
        : {
            budget: increment(transactionData.amount),
            incomesValue: increment(transactionData.amount),
          }
    );

    return newTransaction;
  }
);

export const updateTransaction = createAsyncThunk(
  "users/transactions/updateTransaction",
  async (editedTransaction: Transaction) => {
    const currentUserID = auth.currentUser?.uid;

    if (!currentUserID) return;

    let budgetDiff = 0;

    const transactions = await getDocs(
      collection(db, "users", currentUserID, "transactions")
    );

    const currentDate = new Date(
      Timestamp.now().seconds * 1000
    ).toLocaleString();

    for (const transaction of transactions.docs) {
      if (transaction.id === editedTransaction.id) {
        const transactionRef = doc(
          db,
          "users",
          currentUserID,
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

        if (transaction.data().amount !== validatedEditedTransaction.amount) {
          budgetDiff =
            transaction.data().amount - validatedEditedTransaction.amount;

          await updateDoc(
            doc(db, "users", currentUserID),
            editedTransaction.type === "expense"
              ? {
                  budget: increment(budgetDiff),
                  expensesValue: increment(-budgetDiff),
                }
              : {
                  budget: increment(budgetDiff),
                  incomesValue: increment(-budgetDiff),
                }

            // {
            //   budget: increment(budgetDiff),
            //   expensesValue: increment(-budgetDiff),
            //   incomesValue: increment(-budgetDiff),
            // }
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

export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (user: User) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      user.email,
      user.password
    );
    const currentUser = userCredential.user;
    await setDoc(doc(db, "users", currentUser.uid), {
      email: currentUser.email,
      displayName: user.username,
      budget: 0,
      expensesValue: 0,
      incomesValue: 0,
      currencyType: "PLN",
      categories: [
        "Shops",
        "Food",
        "Healthcare",
        "Entertainment",
        "Travel & Vacation",
        "Personal care",
        "Other",
      ],
    });
  }
);

export const loginUser = createAsyncThunk(
  "users/loginUser",
  async (user: User) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      user.email,
      user.password
    );

    const userID = userCredential.user.uid;

    return { userID };
  }
);

export const logoutUser = createAsyncThunk("users/logoutUser", async () => {
  const auth = getAuth();
  signOut(auth);
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    registeredStatus: "idle",
    loginStatus: "idle",
    changePasswordStatus: "idle",
    changeUsernameStatus: "idle",
    changeEmailStatus: "idle",
    removeUserStatus: "idle",
    error: undefined,
  } as State,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.registeredStatus = "loading";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registeredStatus = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registeredStatus = "failed";
        state.error = action.error.message;
      })

      //-----------------------------------------------------------------------------------------

      .addCase(loginUser.pending, (state) => {
        state.loginStatus = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginStatus = "succeeded";
        state.userID = action.payload.userID;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.error = action.error.message;
      })

      //-----------------------------------------------------------------------------

      .addCase(changePassword.pending, (state) => {
        state.changePasswordStatus = "loading";
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.changePasswordStatus = "succeeded";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePasswordStatus = "failed";
        state.error = action.error.message;
      })

      //---------------------------------------------------------------------------------

      .addCase(removeUser.pending, (state) => {
        state.removeUserStatus = "loading";
      })
      .addCase(removeUser.fulfilled, (state) => {
        state.removeUserStatus = "succeeded";
        state.loginStatus = "idle";
        state.registeredStatus = "idle";
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.removeUserStatus = "failed";
        state.error = action.error.message;
      })

      //-----------------------------------------------------------------------------------

      .addCase(changeUsername.pending, (state) => {
        state.changeUsernameStatus = "loading";
      })
      .addCase(changeUsername.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.changeUsernameStatus = "succeeded";
        state.username = action.payload;
      })
      .addCase(changeUsername.rejected, (state, action) => {
        state.changeUsernameStatus = "failed";
        state.error = action.error.message;
      })

      //----------------------------------------------------------------------------------

      .addCase(changeEmail.pending, (state) => {
        state.changeEmailStatus = "loading";
      })
      .addCase(changeEmail.fulfilled, (state) => {
        state.changeEmailStatus = "succeeded";
      })
      .addCase(changeEmail.rejected, (state, action) => {
        state.changeEmailStatus = "failed";
        state.error = action.error.message;
      })

      //------------------------------------------------------------------------------
      .addCase(logoutUser.fulfilled, (state) => {
        state.loginStatus = "loggedOut";
      })

      //-----------------------------------------------------------------------------------
      .addCase(fetchUserData.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.budget = action.payload.budget;
        state.username = action.payload.displayName;
        state.currencyType = action.payload.currencyType;
        state.categories = action.payload.categories;
        state.expensesValue = action.payload.expensesValue;
        state.budgetAddDate = action.payload.budgetAddDate;
        state.incomesValue = action.payload.incomesValue;
      })
      //----------------------------------------------------

      .addCase(fetchTransactions.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.transactions = action.payload;
      })

      //-------------------------------------------------

      .addCase(setBudget.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.budget = action.payload.editedBudget;
        state.budgetAddDate = action.payload.budgetAddDate;
        state.expensesValue = 0;

        if (action.payload.transactions !== undefined)
          state.transactions = action.payload.transactions;
      })

      //--------------------------------------------------------------
      .addCase(addCategory.fulfilled, (state, action) => {
        if (!action.payload) return;

        const categoryIndex = state.categories.findIndex(
          (category) => category === action.payload
        );

        if (categoryIndex === -1) state.categories.push(action.payload);
      })
      //----------------------------------------------------------
      .addCase(deleteCategory.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.categories = state.categories.filter(
          (category) => category !== action.payload
        );
      })

      //----------------------------------------------------------

      .addCase(changeCurrencyType.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.currencyType = action.payload;
      })

      //---------------------------------------------------------
      .addCase(addTransaction.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.transactions?.push(action.payload);

        if (action.payload.type === "expense") {
          state.budget -= action.payload.amount;
          state.expensesValue += action.payload.amount;
        } else if (action.payload.type === "income") {
          state.budget += action.payload.amount;
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
          state.budget += action.payload.transactionAmount;
          state.expensesValue -= action.payload.transactionAmount;
        } else if (action.payload.type === "income") {
          state.budget -= action.payload.transactionAmount;
          state.incomesValue -= action.payload.transactionAmount;
        }
      })
      //--------------------------------------------------

      .addCase(deleteAllTransactions.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.transactions = action.payload.transactions;
        state.budget += action.payload.allTransactionsAmount;
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
          state.budget += budgetDiff;

          if (action.payload.type === "expense") {
            state.expensesValue -= budgetDiff;
          } else if (action.payload.type === "income") {
            state.incomesValue -= budgetDiff;
          }
        }
      });
  },
});

export default userSlice.reducer;
