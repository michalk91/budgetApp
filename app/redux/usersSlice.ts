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
  arrayUnion,
  Timestamp,
  increment,
  getDoc,
} from "firebase/firestore";
import type { State, User, Expense } from "../types";

export const fetchData = createAsyncThunk("users/fetchData", async () => {
  const currentUserID = auth.currentUser?.uid;

  const docRef = doc(db, "users", `${currentUserID}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }
});

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
export const decrementBudget = createAsyncThunk(
  "users/decrementBudget",
  async (decrementValue: number) => {
    const currentUserID = auth.currentUser?.uid;

    if (!currentUserID) return;

    await updateDoc(doc(db, "users", currentUserID), {
      budget: increment(-decrementValue),
    });

    return decrementValue;
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

    await updateDoc(doc(db, "users", currentUserID), {
      expenses: arrayUnion(expenseData),
    });

    return expenseData;
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
      .addCase(fetchData.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.budget = action.payload.budget;
        state.username = action.payload.displayName;
        state.expenses = action.payload.expenses;
      })

      //-------------------------------------------------

      .addCase(updateBudget.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.budget = action.payload;
      })
      //------------------------------------------------------

      .addCase(decrementBudget.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.budget -= action.payload;
      })
      //---------------------------------------------------------
      .addCase(addExpense.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.expenses?.push(action.payload);
      });
  },
});

export default userSlice.reducer;
