import { Dispatch, SetStateAction, SyntheticEvent } from "react";

export interface Transaction {
  id?: string;
  category: string;
  ownerID?: string;
  ownerUsername?: string;
  amount: number;
  date?: string;
  editDate?: string;
  type: "expense" | "income";
  budgetID?: string;
  ownerEmail?: string;
}

export interface TransactionToDelete {
  id: string;
  type: "expense" | "income";
}

export interface UsersSlice {
  registeredStatus: "idle" | "loading" | "succeeded" | "failed";
  loginStatus:
    | "idle"
    | "loading"
    | "loadingGuest"
    | "succeeded"
    | "failed"
    | "loggedOut";
  changePasswordStatus: "idle" | "loading" | "succeeded" | "failed";
  changeUsernameStatus: "idle" | "loading" | "succeeded" | "failed";
  changeEmailStatus: "idle" | "loading" | "succeeded" | "failed";
  removeUserStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | undefined;
  userID: null | string;
  username: null | string;
  email: string;
}

export interface State {
  budgets: BudgetsSlice;
  user: UsersSlice;
}

export interface BudgetsSlice {
  budgetID: string;
  budgetValue: number;
  budgetsArray: Budget[];
  currencyType: "PLN" | "EUR" | "USD";
  addDate: string;
  expenseCategories: string[];
  incomeCategories: string[];
  expensesValue: number;
  incomesValue: number;
  budgetName: string;
  transactions: Transaction[];
  fetchTransactionsStatus: "idle" | "loading" | "succeeded" | "failed";
  selectedOption: string;
  allowManageAllTransactions: string[];
  allowManageCategories: string[];
  ownerID: string;
}

export interface InvitedUser {
  invitedUserEmail: string;
  invitedUsername: string;
  invitedUserID: string;
  invitationID: string;
}

export interface InvitationsSlice {
  inviteUserStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchInvitationsStatus: "idle" | "loading" | "succeeded" | "failed";
  budgets: Budget[];
  usersWithAccess: UsersWithPermissions[];
  allowManageAllTransactions: string[];
  allowManageCategories: string[];
  invitedUsers: InvitedUser[];
}

export interface User {
  email: string;
  password: string;
  username?: string;
}

export interface AddTransactionProps {
  setAdd: Dispatch<SetStateAction<boolean>>;
  categories: string[];
  type: "income" | "expense";
}

export interface AddNewBudgetProps {
  setNewBudget: Dispatch<SetStateAction<boolean>>;
}

export interface BudgetAddDateProps {
  budgetDate: string;
}

export interface SortOptions {
  sortBy: string;
  descending: boolean;
}

export interface DisplayAmountProps {
  fontSize?: string;
  valueFromStore: number;
  title: string;
  titleClass: string;
}

export interface Category {
  categoryName: string;
  type: "expense" | "income";
}

export interface Budget {
  [key: string]: string | number | string[];
  invitationID: string;
  budgetID: string;
  addDate: string;
  budgetValue: number;
  budgetName: string;
  ownerEmail: string;
  ownerID: string;
  timestamp: number;
  usersWithAccess: string[];
  currencyType: "PLN" | "EUR" | "USD";
  expensesValue: number;
  incomesValue: number;
  ownerUsername: string;
  expenseCategories: string[];
  incomeCategories: string[];
  allowManageAllTransactions: string[];
  allowManageCategories: string[];
}

export interface NewBudget {
  budgetName: string;
  budgetValue: number;
  currencyType: "PLN" | "EUR" | "USD";
}

export interface SubNavigationProps {
  activeOption: string;
}

export interface DecideInvitation {
  invitationID: string;
  decision: "decline" | "accept";
}

export interface SortState {
  sortDirection: "ascending" | "descending";
  sortBy: string;
}

export interface HeaderCell {
  name: string;
  sortBy?: string;
}

export interface TableProps extends SortState {
  title: string;
  headerCells: HeaderCell[];
  emptyTableCondition: boolean;
  emptyTableTitle: string;
  addNewRow?: React.ReactNode | undefined;
  children: React.ReactNode;
  setSort: Dispatch<
    SetStateAction<{
      sortBy: string;
      sortDirection: "ascending" | "descending";
    }>
  >;
}

export interface ButtonProps {
  children: React.ReactNode;
  handleClick: (e: SyntheticEvent) => void;
  additionalStyles?: string;
}

export interface UsersWithPermissions {
  [key: string]: string | number | string[] | boolean;
  userID: string;
  username: string;
  userEmail: string;
  allowManageAllTransactions: boolean;
  allowManageCategories: boolean;
  budgetID: string;
}

export interface AddNewUserProps {
  setNewUser: Dispatch<SetStateAction<boolean>>;
}

export interface InviteFriend {
  email: string;
  allowManageCategories: boolean;
  allowManageAllTransactions: boolean;
}

export interface EditJoinedUserPermissions {
  budgetID: string;
  allowManageCategories: boolean;
  allowManageAllTransactions: boolean;
  userID: string;
}

export interface ChangeComponentsProps {
  setActive: (value: string) => void;
}

export interface CategoriesProps {
  type: "expense" | "income";
}
