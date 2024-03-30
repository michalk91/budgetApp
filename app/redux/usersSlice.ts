import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { setDoc, doc } from "firebase/firestore";

interface State {
  user: {
    registeredStatus: "idle" | "loading" | "succeeded" | "failed";
    loginStatus: "idle" | "loading" | "succeeded" | "failed";
    error: string | undefined;
    userID: null | string;
  };
}

interface User {
  email: string;
  password: string;
  username?: string;
}

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
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: user.username,
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
    user: { registeredStatus: "idle", error: undefined },
  } as State,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.user.registeredStatus = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user.registeredStatus = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.user.registeredStatus = "failed";
        state.user.error = action.error.message;
      })

      //-----------------------------------------------------------------------------------------

      .addCase(loginUser.pending, (state) => {
        state.user.loginStatus = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user.loginStatus = "succeeded";
        state.user.userID = action.payload.userID;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user.loginStatus = "failed";
        state.user.error = action.error.message;
      })

      //------------------------------------------------------------------------------
      .addCase(logoutUser.fulfilled, (state) => {
        state.user.loginStatus = "idle";
      });
  },
});

export default userSlice.reducer;
