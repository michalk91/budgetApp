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
import { db } from "../firebase/config";
import type {
  State,
  InvitationsSlice,
  Budget,
  DecideInvitation,
  UsersWithPermissions,
  FetchArgs,
  InviteUserArgs,
  EditJoinedUserPermissions,
  DeleteUserArgs,
} from "../types";
import useSort from "../hooks/useSort";

export const fetchInvitations = createAsyncThunk(
  "invitations/fetchInvitations",
  async (_, { getState }) => {
    const state = getState() as State;

    const currentUserID = state.user.userID;

    const invitationsQuery = query(
      collection(db, "invitations"),
      where("invitedUserID", "==", currentUserID)
    );

    const querySnapshot = await getDocs(invitationsQuery);

    const budgets = querySnapshot.docs.map(
      (doc) => ({ ...doc.data() } as Budget)
    );

    return budgets;
  }
);

export const fetchInvitedUsers = createAsyncThunk(
  "invitations/fetchInvitedUsers",
  async ({ budgetID, sortOptions }: FetchArgs) => {
    const { sortBy, sortDirection } = sortOptions;

    const invitedUsersQuery = query(
      collection(db, "invitations"),
      where("budgetID", "==", budgetID)
    );

    const querySnapshot = await getDocs(invitedUsersQuery);

    const invitedUsers = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const { invitedUsername, invitedUserEmail, invitedUserID, invitationID } =
        data;

      return { invitedUserEmail, invitedUsername, invitedUserID, invitationID };
    });

    if (sortDirection === "without") {
      return invitedUsers;
    } else {
      const sortedUsers = useSort(invitedUsers, `${sortBy}`);
      return sortDirection === "ascending"
        ? sortedUsers
        : sortedUsers.reverse();
    }
  }
);

export const deleteInvitation = createAsyncThunk(
  "invitations/deleteInvitation",
  async (invitationID: string) => {
    await deleteDoc(doc(db, "invitations", invitationID));

    return invitationID;
  }
);

export const deleteAllInvitations = createAsyncThunk(
  "invitations/deleteAllInvitations",
  async (budgetID) => {
    const invitations = await getDocs(
      query(collection(db, `invitations`), where("budgetID", "==", budgetID))
    );

    for (const invitation of invitations.docs) {
      await deleteDoc(doc(db, `invitations`, invitation.id));
    }

    return [];
  }
);

export const deleteUser = createAsyncThunk(
  "invitations/deleteUser",
  async ({ userID, budgetID }: DeleteUserArgs) => {
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
  async (budgetID: string) => {
    await updateDoc(doc(db, "budgets", budgetID), {
      usersWithAccess: [],
      allowManageCategories: [],
      allowManageAllTransactions: [],
    });

    return [];
  }
);

export const fetchJoinedUsers = createAsyncThunk(
  "invitations/fetchJoinedUsers",
  async ({ budgetID, sortOptions }: FetchArgs) => {
    const { sortBy, sortDirection } = sortOptions;

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
    if (sortDirection === "without") {
      return usersWithPermissions;
    } else {
      const sortedUsers = useSort(usersWithPermissions, `${sortBy}`);
      return sortDirection === "ascending"
        ? sortedUsers
        : sortedUsers.reverse();
    }
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
  async ({ invitationID, decision }: DecideInvitation, { getState }) => {
    const state = getState() as State;

    const currentUserID = state.user.userID;

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

export const inviteUser = createAsyncThunk(
  "invitations/inviteUser",
  async (
    {
      budgetID,
      email,
      allowManageCategories,
      allowManageAllTransactions,
    }: InviteUserArgs,
    { getState }
  ) => {
    const state = getState() as State;
    const loggedUserEmail = state.user.email;

    if (loggedUserEmail === email) throw Error("You can't invite yourself");

    let userID = "";
    let username = "";

    const userQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );

    const userSnapshot = await getDocs(userQuery);

    userSnapshot.forEach((doc) => {
      userID = doc.data().uid;
      username = doc.data().displayName;
    });

    if (userID === "") throw Error("Wrong email");

    const invitationsRef = collection(db, "invitations");
    const invitationsQuery = query(
      invitationsRef,
      where("budgetID", "==", budgetID),
      where("invitedUserEmail", "==", email)
    );

    const invitationsSnapshot = await getDocs(invitationsQuery);

    invitationsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.budgetID === budgetID)
        throw Error("You cannot invite the same user twice");
    });

    const budgetRef = doc(db, "budgets", budgetID);
    const budgetSnap = await getDoc(budgetRef);

    if (budgetSnap.exists()) {
      const data = budgetSnap.data();

      const userAlreadyHasAccess = data.usersWithAccess.filter(
        (item: string) => item === userID
      );

      if (userAlreadyHasAccess.length > 0)
        throw Error("This user already has access to this budget");

      const invitationData = {
        budgetID,
        invitedUserID: userID,
        invitedUserEmail: email,
        invitedUsername: username,
        allowManageCategories,
        allowManageAllTransactions,
        ownerID: data.ownerID,
        ownerEmail: data.ownerEmail,
        ownerUsername: data.ownerUsername,
        budgetName: data.budgetName,
        currencyType: data.currencyType,
        budgetValue: data.budgetValue,
      };

      const invitationRef = await addDoc(
        collection(db, `invitations`),
        invitationData
      );

      await updateDoc(doc(db, "invitations", invitationRef.id), {
        invitationID: invitationRef.id,
      });

      return { invitationID: invitationRef.id, ...invitationData };
    }
  }
);

const invitationsSlice = createSlice({
  name: "invitations",
  initialState: {
    budgets: [],
    inviteUserStatus: "idle",
    fetchInvitationsStatus: "idle",
    usersWithAccess: [],
    allowManageAllTransactions: [],
    allowManageCategories: [],
    invitedUsers: [],
    inviteUserErrorMessage: "",
    addedElemID: "",
  } as InvitationsSlice,
  reducers: {
    resetinviteUserStatus: (state) => {
      state.inviteUserStatus = "idle";
      state.inviteUserErrorMessage = "";
    },
    resetAddedElemID: (state) => {
      state.addedElemID = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(inviteUser.pending, (state) => {
        state.inviteUserStatus = "loading";
      })

      .addCase(inviteUser.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.addedElemID = action.payload.invitationID;
        state.inviteUserStatus = "succeeded";
        state.invitedUsers.push(action.payload);
      })

      .addCase(inviteUser.rejected, (state, error) => {
        state.inviteUserStatus = "failed";
        state.inviteUserErrorMessage = error.error.message;
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

      //------------------------------------------------------------------------

      .addCase(fetchInvitedUsers.fulfilled, (state, action) => {
        state.invitedUsers = action.payload;
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

      .addCase(deleteInvitation.fulfilled, (state, action) => {
        state.invitedUsers = state.invitedUsers.filter(
          (user) => user.invitationID !== action.payload
        );
      })

      //---------------------------------------------------------------------

      .addCase(deleteAllInvitations.fulfilled, (state, action) => {
        state.invitedUsers = action.payload;
      })

      //------------------------------------------------------------------------

      .addCase(deleteAllUsers.fulfilled, (state, action) => {
        state.usersWithAccess = action.payload;
      });
  },
});

export const { resetinviteUserStatus, resetAddedElemID } =
  invitationsSlice.actions;
export default invitationsSlice.reducer;
