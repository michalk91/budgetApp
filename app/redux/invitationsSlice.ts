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
  async (sortOptions: SortOptions, { getState }) => {
    const { sortBy, descending } = sortOptions;

    const state = getState() as State;
    const selectedBudgetID = state.budgets.budgetID;

    const invitedUsersQuery = query(
      collection(db, "invitations"),
      where("budgetID", "==", selectedBudgetID)
    );

    const querySnapshot = await getDocs(invitedUsersQuery);

    const invitedUsers = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const { invitedUsername, invitedUserEmail, invitedUserID, invitationID } =
        data;

      return { invitedUserEmail, invitedUsername, invitedUserID, invitationID };
    });

    const sortedUsers = useSort(invitedUsers, `${sortBy}`);

    return !descending ? sortedUsers : sortedUsers.reverse();
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
  async () => {
    const invitations = await getDocs(collection(db, `invitations`));

    for (const invitation of invitations.docs) {
      await deleteDoc(doc(db, `invitations`, invitation.id));
    }

    return [];
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

    return [];
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
    let passedUsername = "";

    const usersWithAccess = [];

    const q = query(collection(db, "users"), where("email", "==", email));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      passedUserID = doc.data().uid;
      passedUsername = doc.data().displayName;
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

      const invitationData = {
        budgetID: selectedBudgetID,
        invitedUserID: passedUserID,
        invitedUserEmail: email,
        invitedUsername: passedUsername,
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
  } as InvitationsSlice,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(inviteFriend.pending, (state) => {
        state.inviteUserStatus = "loading";
      })

      .addCase(inviteFriend.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.inviteUserStatus = "succeeded";
        state.invitedUsers.push(action.payload);
      })

      .addCase(inviteFriend.rejected, (state) => {
        state.inviteUserStatus = "failed";
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

export default invitationsSlice.reducer;
