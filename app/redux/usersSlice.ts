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
  setPersistence,
  browserLocalPersistence,
  signInAnonymously,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import {
  setDoc,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import type { User, UsersSlice, State } from "../types";
import { query, where } from "firebase/firestore";

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

    return newEmail;
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
      uid: currentUser.uid,
    });
  }
);

export const loginUser = createAsyncThunk(
  "users/loginUser",
  async (user: User) => {
    const auth = getAuth();
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      user.email,
      user.password
    );

    const userID = userCredential.user.uid;

    return { userID };
  }
);

export const loginAnonymously = createAsyncThunk(
  "users/loginGuest",
  async () => {
    const userCredential = await signInAnonymously(auth);

    const userID = userCredential.user.uid;

    return { userID };
  }
);

export const logoutUser = createAsyncThunk(
  "users/logoutUser",
  async (_, { getState }) => {
    const auth = getAuth();

    const state = getState() as State;
    const isAnonymusUser = state.user.loggedInAsAnonymous;

    if (isAnonymusUser) {
      const currentUserID = state.user.userID;

      if (!currentUserID) return;

      const budgets = await getDocs(
        query(collection(db, "budgets"), where("ownerID", "==", currentUserID))
      );

      const invitations = await getDocs(
        query(
          collection(db, `invitations`),
          where("ownerID", "==", currentUserID)
        )
      );

      for (const invitation of invitations.docs) {
        await deleteDoc(doc(db, `invitations`, invitation.id));
      }

      const deletedBudgetsIDs = [];

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
          deletedBudgetsIDs.push(budget.id);
        }
      }
      const user = auth?.currentUser;
      await user?.reload();
      if (user) await deleteUser(user);
    } else {
      signOut(auth);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    registeredStatus: "idle",
    loginStatus: "idle",
    changePasswordStatus: "idle",
    changeUsernameStatus: "idle",
    changeEmailStatus: "idle",
    removeUserStatus: "idle",
    loggedInAsAnonymous: false,
    error: undefined,
  } as UsersSlice,
  reducers: {
    resetCreateAccountStatus: (state) => {
      state.registeredStatus = "idle";
    },
    resetLoginStatus: (state) => {
      state.loginStatus = "idle";
    },
  },
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
        if (!action.payload) return;

        state.loginStatus = "succeeded";
        state.userID = action.payload.userID;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.error = action.error.message;
      })

      //--------------------------------------------------------------------------------

      .addCase(loginAnonymously.pending, (state) => {
        state.loginStatus = "loadingAnonymous";
      })
      .addCase(loginAnonymously.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.loginStatus = "succeeded";
        state.userID = action.payload.userID;
        state.loggedInAsAnonymous = true;
      })
      .addCase(loginAnonymously.rejected, (state, action) => {
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
      .addCase(changeEmail.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.email = action.payload;
        state.changeEmailStatus = "succeeded";
      })
      .addCase(changeEmail.rejected, (state, action) => {
        state.changeEmailStatus = "failed";
        state.error = action.error.message;
      })

      //------------------------------------------------------------------------------
      .addCase(logoutUser.fulfilled, (state) => {
        if (state.loggedInAsAnonymous) {
          state.loggedInAsAnonymous = false;
        }

        state.loginStatus = "loggedOut";
        state.email = "";
        state.userID = "";
        state.username = "";
      })

      //-----------------------------------------------------------------------------------
      .addCase(fetchUserData.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.username = action.payload.displayName;
        state.email = action.payload.email;
      });
  },
});

export default userSlice.reducer;
export const { resetCreateAccountStatus, resetLoginStatus } = userSlice.actions;
