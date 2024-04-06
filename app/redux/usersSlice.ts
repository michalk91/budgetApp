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
  getDocs,
  collection,
  DocumentData,
  updateDoc,
  arrayUnion,
  Timestamp,
  increment,
} from "firebase/firestore";

interface Expense {
  category: string;
  amount: number;
}

interface Expenses {
  [index: number]: Expense;
}

interface State {
  registeredStatus: "idle" | "loading" | "succeeded" | "failed";
  loginStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | undefined;
  userID: null | string;
  username: null | string;
  budget: number;
  expenses?: Expenses[];
}

interface User {
  email: string;
  password: string;
  username?: string;
}

export const fetchData = createAsyncThunk("users/fetchData", async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  const userData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    user: doc.data(),
  }));
  return userData;
});

export const updateBudget = createAsyncThunk(
  "users/updateBudget",
  async (editedBudget: number, { getState }: DocumentData) => {
    const state = getState();

    const currentUserID = state.user.userID;

    await updateDoc(doc(db, "users", currentUserID), {
      budget: editedBudget,
    });

    return editedBudget;
  }
);
export const decrementBudget = createAsyncThunk(
  "users/decrementBudget",
  async (decrementValue: number, { getState }: DocumentData) => {
    const state = getState();

    const currentUserID = state.user.userID;

    await updateDoc(doc(db, "users", currentUserID), {
      budget: increment(-decrementValue),
    });

    return decrementValue;
  }
);

export const addExpense = createAsyncThunk(
  "users/expenses/addExpense",
  async (expense: Expense, { getState }: DocumentData) => {
    const state = getState();

    const currentUserID = state.user.userID;

    const currentDate = new Date(Timestamp.now().seconds * 1000);
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
        const userIndex = action.payload.findIndex(
          (user) => user.id === state.userID
        );
        if (userIndex !== -1) {
          state.budget = action.payload[userIndex].user.budget;
          state.username = action.payload[userIndex].user.displayName;
        }
      })

      //-------------------------------------------------

      .addCase(updateBudget.fulfilled, (state, action) => {
        state.budget = action.payload;
      })
      //------------------------------------------------------

      .addCase(decrementBudget.fulfilled, (state, action) => {
        state.budget -= action.payload;
      })
      //---------------------------------------------------------
      .addCase(addExpense.fulfilled, (state, action) => {
        state.expenses?.push(action.payload);
      });
  },
});

export default userSlice.reducer;
