import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
  updatePassword,
  updateProfile,
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
import type { State, User, Expense, SortOptions } from "../types";

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

export const changeUsername = createAsyncThunk(
  "users/changeUsername",
  async (newUsername: string) => {
    const user = auth?.currentUser;
    const currentUserID = auth.currentUser?.uid;

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

export const fetchExpenses = createAsyncThunk(
  "users/fetchExpenses",
  async (sortOptions: SortOptions) => {
    const { sortBy, descending } = sortOptions;

    const currentUserID = auth.currentUser?.uid;

    const expensesQuery = query(
      collection(db, `users/${currentUserID}/expenses`),
      descending ? orderBy(`${sortBy}`, `desc`) : orderBy(`${sortBy}`)
    );

    const querySnapshot = await getDocs(expensesQuery);

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

export const deleteAllExpenses = createAsyncThunk(
  "users/expenses/deleteAllExpenses",
  async () => {
    const currentUserID = auth.currentUser?.uid;

    if (!currentUserID) return;

    const expenses = await getDocs(
      collection(db, `users/${currentUserID}/expenses`)
    );

    let allExpensesAmount = 0;

    for (const expense of expenses.docs) {
      allExpensesAmount += expense.data().amount;
      await deleteDoc(doc(db, `users/${currentUserID}/expenses`, expense.id));
    }

    return { expenses: [], allExpensesAmount };
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
      timestamp: Timestamp.now().seconds,
      date: currentDate,
    };

    const addExpenseRef = await addDoc(
      collection(db, "users", currentUserID, "expenses"),
      expenseData
    );

    const newExpense = { id: addExpenseRef.id, ...expenseData };

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
          timestamp: Timestamp.now().seconds,
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
        state.categories = action.payload.categories;
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
      //--------------------------------------------------

      .addCase(deleteAllExpenses.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.expenses = action.payload.expenses;

        state.budget += action.payload.allExpensesAmount;
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
