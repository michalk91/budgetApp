import { Dispatch, SetStateAction } from "react";

export interface Transaction {
  id?: string;
  category: string;
  amount: number;
  date?: string;
  editDate?: string;
  type: "expense" | "income";
  budgetID?: string;
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
}

export interface User {
  email: string;
  password: string;
  username?: string;
}

export interface AddTransactionProps {
  setAdd: (value: boolean) => void;
  categories: string[];
  type: "income" | "expense";
}

export interface AddNewBudgetProps {
  setNewBudget: (value: boolean) => void;
}

export interface BudgetAddDateProps {
  budgetDate: string;
}

export interface SortOptions {
  sortBy: string;
  descending: boolean;
}

export interface ChangeComponentsProps {
  setActive: (value: string) => void;
}

export interface WarningProps {
  setDecision: (value: boolean) => void;
}

export interface DisplayAmountProps {
  fontSize?: string;
  valueFromStore: number;
  title: string;
  titleClass: string;
}

export interface ShowTransactionsProps {
  setExpensesSort: Dispatch<
    SetStateAction<{
      sortBy: string;
      sortDirection: string;
    }>
  >;
  expensesSort: { sortBy: string; sortDirection: string };
}

export interface Category {
  categoryName: string;
  type: "expense" | "income";
}

export interface Budget {
  [key: string]: string | number | string[];
  budgetID: string;
  amount: number;
  addDate: string;
  budgetName: string;
  ownerEmail: string;
  ownerID: string;
  timestamp: number;
  usersWithAccess: string[];
  currencyType: "PLN" | "EUR" | "USD";
  expensesValue: number;
  incomesValue: number;
}

export interface NewBudget {
  budgetName: string;
  budgetValue: number;
  currencyType: "PLN" | "EUR" | "USD";
}

export interface SubNavigationProps {
  activeOption: string;
}
