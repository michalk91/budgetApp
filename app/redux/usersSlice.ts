import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
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
} from "firebase/firestore";
import type { State, User, Expense } from "../types";

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

export const fetchExpenses = createAsyncThunk(
  "users/fetchExpenses",
  async () => {
    const currentUserID = auth.currentUser?.uid;

    const querySnapshot = await getDocs(
      collection(db, `users/${currentUserID}/expenses`)
    );
    const expenses = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Expense)
    );

    return expenses;
  }
);

export const updateBudget = createAsyncThunk(
  "users/updateBudget",
  async (editedBudget: number) => {
    const currentUserID = auth.currentUser?.uid;

    if (!currentUserID) return;

    await updateDoc(doc(db, "users", currentUserID), {
      budget: editedBudget,
    });

    return editedBudget;
  }
);

export const deleteExpense = createAsyncThunk(
  "users/expenses/deleteExpense",
  async (id: string) => {
    const currentUserID = auth.currentUser?.uid;

    if (!currentUserID) return;

    const expenses = await getDocs(
      collection(db, `users/${currentUserID}/expenses`)
    );

    for (const expense of expenses.docs) {
      if (expense.id === id) {
        await deleteDoc(doc(db, `users/${currentUserID}/expenses`, expense.id));

        const expenseAmount = expense.data().amount;

        await updateDoc(doc(db, "users", currentUserID), {
          budget: increment(expenseAmount),
        });
        return { id, expenseAmount };
      }
    }
  }
);

export const addExpense = createAsyncThunk(
  "users/expenses/addExpense",
  async (expense: Expense) => {
    const currentUserID = auth.currentUser?.uid;

    if (!currentUserID) return;

    const currentDate = new Date(
      Timestamp.now().seconds * 1000
    ).toLocaleString();

    const expenseData = {
      ...expense,
      date: currentDate,
    };

    const addExpenseRef = await addDoc(
      collection(db, "users", currentUserID, "expenses"),
      expenseData
    );

    const newExpense = Object.assign({ id: addExpenseRef.id }, expenseData);

    await updateDoc(doc(db, "users", currentUserID), {
      budget: increment(-expense.amount),
    });

    return newExpense;
  }
);

export const updateExpense = createAsyncThunk(
  "users/expenses/updateExpense",
  async (editedExpense: Expense) => {
    const currentUserID = auth.currentUser?.uid;

    if (!currentUserID) return;

    let budgetDiff = 0;

    const expenses = await getDocs(
      collection(db, "users", currentUserID, "expenses")
    );

    const currentDate = new Date(
      Timestamp.now().seconds * 1000
    ).toLocaleString();

    for (const expense of expenses.docs) {
      if (expense.id === editedExpense.id) {
        const expenseRef = doc(
          db,
          "users",
          currentUserID,
          "expenses",
          expense.id
        );

        const validatedEditedExpense = {
          id: editedExpense.id,
          date: editedExpense.date,
          editDate: currentDate,
          category:
            editedExpense.category !== ""
              ? editedExpense.category
              : expense.data().category,
          amount:
            editedExpense.amount !== 0
              ? editedExpense.amount
              : expense.data().amount,
        };

        await updateDoc(expenseRef, validatedEditedExpense);

        if (expense.data().amount !== validatedEditedExpense.amount) {
          budgetDiff = expense.data().amount - validatedEditedExpense.amount;

          await updateDoc(doc(db, "users", currentUserID), {
            budget: increment(budgetDiff),
          });
        }
        return { validatedEditedExpense, budgetDiff };
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
      currencyType: "USD",
      expenses: [],
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

      //------------------------------------------------------------------------------
      .addCase(logoutUser.fulfilled, (state) => {
        state.loginStatus = "idle";
      })

      //-----------------------------------------------------------------------------------
      .addCase(fetchUserData.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.budget = action.payload.budget;
        state.username = action.payload.displayName;
        state.currencyType = action.payload.currencyType;
      })
      //----------------------------------------------------

      .addCase(fetchExpenses.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.expenses = action.payload;
      })

      //-------------------------------------------------

      .addCase(updateBudget.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.budget = action.payload;
      })

      //---------------------------------------------------------
      .addCase(addExpense.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.expenses?.push(action.payload);
        state.budget -= action.payload.amount;
      })

      //------------------------------------------------------------------------
      .addCase(deleteExpense.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.expenses = state.expenses.filter(
          (expense) => expense.id !== action.payload?.id
        );

        state.budget += action.payload.expenseAmount;
      })

      //-------------------------------------------------
      .addCase(updateExpense.fulfilled, (state, action) => {
        if (!action.payload) return;

        const { validatedEditedExpense, budgetDiff } = action.payload;

        const expenseIndex = state.expenses.findIndex(
          (expense) => expense.id === validatedEditedExpense.id
        );
        if (expenseIndex !== -1) {
          state.expenses[expenseIndex] = validatedEditedExpense;
          state.budget += budgetDiff;
        }
      });
  },
});

export default userSlice.reducer;
