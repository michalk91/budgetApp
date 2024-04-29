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
  getDoc,
  deleteDoc,
  collection,
  getDocs,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import type { State, User, Category } from "../types";

const GUEST_EMAIL = process.env.GUEST_EMAIL;
const GUEST_PASS = process.env.GUEST_PASS;

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
  async (category: Category) => {
    const currentUserID = auth.currentUser?.uid;

    if (!currentUserID) return;

    const { categoryName, type } = category;

    await updateDoc(
      doc(db, "users", currentUserID),
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
  async (category: Category) => {
    const currentUserID = auth.currentUser?.uid;

    if (!currentUserID) return;

    const { categoryName, type } = category;

    await updateDoc(
      doc(db, "users", currentUserID),
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
      expenseCategories: [
        "Shops",
        "Food",
        "Healthcare",
        "Entertainment",
        "Travel & Vacation",
        "Personal care",
        "Other",
      ],
      incomeCategories: ["Salary", "Bonus", "Additional job"],
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

export const loginGuest = createAsyncThunk("users/loginGuest", async () => {
  if (!GUEST_EMAIL || !GUEST_PASS) return;

  const userCredential = await signInWithEmailAndPassword(
    auth,
    GUEST_EMAIL,
    GUEST_PASS
  );

  const userID = userCredential.user.uid;

  return { userID };
});

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
        if (!action.payload) return;

        state.loginStatus = "succeeded";
        state.userID = action.payload.userID;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.error = action.error.message;
      })

      //--------------------------------------------------------------------------------

      .addCase(loginGuest.pending, (state) => {
        state.loginStatus = "loadingGuest";
      })
      .addCase(loginGuest.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.loginStatus = "succeeded";
        state.userID = action.payload.userID;
      })
      .addCase(loginGuest.rejected, (state, action) => {
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
        state.expenseCategories = action.payload.expenseCategories;
        state.expensesValue = action.payload.expensesValue;
        state.budgetAddDate = action.payload.budgetAddDate;
        state.incomesValue = action.payload.incomesValue;
        state.incomeCategories = action.payload.incomeCategories;
        state.email = action.payload.email;
      })
      //----------------------------------------------------

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

      //----------------------------------------------------------

      .addCase(changeCurrencyType.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.currencyType = action.payload;
      });
  },
});

export default userSlice.reducer;
