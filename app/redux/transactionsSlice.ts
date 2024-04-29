import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, db } from "../firebase/config";
import {
  doc,
  updateDoc,
  Timestamp,
  increment,
  deleteDoc,
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import type {
  State,
  Transaction,
  SortOptions,
  TransactionToDelete,
} from "../types";

export const fetchTransactions = createAsyncThunk(
  "fetchTransactions",
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

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
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
  "transactions/deleteAllTransactions",
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
  "transactions/addTransaction",
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
  "transactions/updateTransaction",
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

        const { type, amount } = transaction.data();

        if (amount !== validatedEditedTransaction.amount) {
          budgetDiff =
            type === "expense"
              ? amount - validatedEditedTransaction.amount
              : -(amount - validatedEditedTransaction.amount);

          await updateDoc(
            doc(db, "users", currentUserID),
            editedTransaction.type === "expense"
              ? {
                  budget: increment(budgetDiff),
                  expensesValue: increment(-budgetDiff),
                }
              : {
                  budget: increment(budgetDiff),
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

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {} as State,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchTransactions.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.transactions = action.payload;
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
            state.incomesValue += budgetDiff;
          }
        }
      });
  },
});

export default transactionsSlice.reducer;
