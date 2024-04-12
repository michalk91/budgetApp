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
      }
    }
    return id;
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
          (expense) => expense.id !== action.payload
        );
      });
  },
});

export default userSlice.reducer;
