import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  arrayRemove,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import type {
  State,
  InvitationsSlice,
  Budget,
  DecideInvitation,
  UsersWithPermissions,
  SortOptions,
  InviteFriend,
  EditJoinedUserPermissions,
} from "../types";
import useSort from "../hooks/useSort";

export const fetchInvitations = createAsyncThunk(
  "invitations/fetchInvitations",
  async () => {
    const currentUserID = auth.currentUser?.uid;

    const invitationsQuery = query(
      collection(db, "invitations"),
      where("userID", "==", currentUserID)
    );

    const querySnapshot = await getDocs(invitationsQuery);

    const budgets = querySnapshot.docs.map(
      (doc) => ({ ...doc.data() } as Budget)
    );

    return budgets;
  }
);

export const deleteUser = createAsyncThunk(
  "invitations/deleteUser",
  async (userID: string, { getState }) => {
    const state = getState() as State;
    const budgetID = state.budgets.budgetID;

    await updateDoc(doc(db, "budgets", budgetID), {
      usersWithAccess: arrayRemove(userID),
      allowManageCategories: arrayRemove(userID),
      allowManageAllTransactions: arrayRemove(userID),
    });

    return userID;
  }
);

export const deleteAllUsers = createAsyncThunk(
  "invitations/deleteAllUsers",
  async (_, { getState }) => {
    const state = getState() as State;
    const budgetID = state.budgets.budgetID;

    await updateDoc(doc(db, "budgets", budgetID), {
      usersWithAccess: [],
      allowManageCategories: [],
      allowManageAllTransactions: [],
    });
  }
);

export const fetchJoinedUsers = createAsyncThunk(
  "invitations/fetchJoinedUsers",
  async (sortOptions: SortOptions, { getState }) => {
    const state = getState() as State;

    const { sortBy, descending } = sortOptions;

    const budgetID = state.budgets.budgetID;

    const budgetRef = doc(db, "budgets", budgetID);
    const budgetSnap = await getDoc(budgetRef);

    const usersWithPermissions: UsersWithPermissions[] = [];

    if (budgetSnap.exists()) {
      const {
        usersWithAccess,
        allowManageAllTransactions,
        allowManageCategories,
      } = budgetSnap.data();

      await Promise.all(
        usersWithAccess.map(async (user: string) => {
          const userRef = doc(db, "users", user);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            usersWithPermissions.push({
              userID: user,
              username: data.displayName,
              userEmail: data.email,
              allowManageAllTransactions:
                allowManageAllTransactions.includes(user),
              allowManageCategories: allowManageCategories.includes(user),
              budgetID,
            });
          }
        })
      );
    }

    const sortedUsers = useSort(usersWithPermissions, `${sortBy}`);

    return !descending ? sortedUsers : sortedUsers.reverse();
  }
);

export const editJoinedUserPermissions = createAsyncThunk(
  "invitations/changeJoinedUserPermissions",
  async ({
    budgetID,
    userID,
    allowManageCategories,
    allowManageAllTransactions,
  }: EditJoinedUserPermissions) => {
    await updateDoc(doc(db, "budgets", budgetID), {
      allowManageCategories: allowManageCategories
        ? arrayUnion(userID)
        : arrayRemove(userID),
      allowManageAllTransactions: allowManageAllTransactions
        ? arrayUnion(userID)
        : arrayRemove(userID),
    });

    return {
      userID,
      allowManageCategories,
      allowManageAllTransactions,
    };
  }
);

export const decideInvitation = createAsyncThunk(
  "invitations/decideInvitation",
  async ({ invitationID, decision }: DecideInvitation) => {
    const currentUserID = auth.currentUser?.uid;

    if (!currentUserID) return;

    const invitationRef = doc(db, "invitations", invitationID);

    const invitationSnap = await getDoc(invitationRef);

    if (invitationSnap.exists()) {
      const data = invitationSnap.data();

      const budgetID = data.budgetID;

      if (decision === "accept") {
        await updateDoc(
          doc(db, "budgets", budgetID),

          {
            usersWithAccess: arrayUnion(currentUserID),
            allowManageCategories: data.allowManageCategories
              ? arrayUnion(currentUserID)
              : arrayRemove(currentUserID),
            allowManageAllTransactions: data.allowManageAllTransactions
              ? arrayUnion(currentUserID)
              : arrayRemove(currentUserID),
          }
        );
      }
      await deleteDoc(doc(db, "invitations", invitationID));
    }
    return invitationID;
  }
);

export const inviteFriend = createAsyncThunk(
  "invitations/inviteFirend",
  async (
    { email, allowManageCategories, allowManageAllTransactions }: InviteFriend,
    { getState }
  ) => {
    const state = getState() as State;
    const selectedBudgetID = state.budgets.budgetID;

    let passedUserID = "";
    const usersWithAccess = [];

    const q = query(collection(db, "users"), where("email", "==", email));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      passedUserID = doc.data().uid;
    });

    if (passedUserID === "") throw Error("Wrong email");

    const docRef = doc(db, "budgets", selectedBudgetID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      usersWithAccess.push(...data.usersWithAccess);

      const userAlreadyHasAccess = usersWithAccess.filter(
        (item) => item === passedUserID
      );

      if (userAlreadyHasAccess.length > 0)
        throw Error("This user already has access to this budget.");

      const invitationRef = await addDoc(collection(db, `invitations`), {
        budgetID: selectedBudgetID,
        userID: passedUserID,
        allowManageCategories,
        allowManageAllTransactions,
        ownerID: data.ownerID,
        ownerEmail: data.ownerEmail,
        ownerUsername: data.ownerUsername,
        budgetName: data.budgetName,
        currencyType: data.currencyType,
        budgetValue: data.budgetValue,
      });

      await updateDoc(doc(db, "invitations", invitationRef.id), {
        invitationID: invitationRef.id,
      });
    }
  }
);

const invitationsSlice = createSlice({
  name: "invitations",
  initialState: {
    budgets: [],
    inviteFriendStatus: "idle",
    fetchInvitationsStatus: "idle",
    usersWithAccess: [],
    allowManageAllTransactions: [],
    allowManageCategories: [],
  } as InvitationsSlice,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(inviteFriend.pending, (state) => {
        state.inviteFriendStatus = "loading";
      })

      .addCase(inviteFriend.fulfilled, (state) => {
        state.inviteFriendStatus = "succeeded";
        alert("success");
      })

      .addCase(inviteFriend.rejected, (state) => {
        alert("failed");
        state.inviteFriendStatus = "failed";
      })

      //----------------------------------------------------------------------------

      .addCase(fetchInvitations.pending, (state) => {
        state.fetchInvitationsStatus = "loading";
      })

      .addCase(fetchInvitations.fulfilled, (state, action) => {
        state.fetchInvitationsStatus = "succeeded";
        state.budgets = action.payload;
      })

      .addCase(fetchInvitations.rejected, (state) => {
        state.fetchInvitationsStatus = "failed";
      })

      //----------------------------------------------------------------------
      .addCase(fetchJoinedUsers.fulfilled, (state, action) => {
        state.usersWithAccess = action.payload;
      })

      //-----------------------------------------------------------------------------

      .addCase(decideInvitation.fulfilled, (state, action) => {
        state.budgets = state.budgets.filter(
          (budget) => budget.invitationID !== action.payload
        );
      })

      //-------------------------------------------------------------------------

      .addCase(editJoinedUserPermissions.fulfilled, (state, action) => {
        state.usersWithAccess.find((item, index) => {
          if (item.userID === action.payload?.userID) {
            state.usersWithAccess[index] = {
              ...state.usersWithAccess[index],
              allowManageAllTransactions:
                action.payload.allowManageAllTransactions,
              allowManageCategories: action.payload.allowManageCategories,
            };
          }
        });
      })

      //------------------------------------------------------------------------------
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.usersWithAccess = state.usersWithAccess.filter(
          (user) => user.userID !== action.payload
        );
      })

      //--------------------------------------------------------------------------

      .addCase(deleteAllUsers.fulfilled, (state) => {
        state.usersWithAccess = [];
      });
  },
});

export default invitationsSlice.reducer;
