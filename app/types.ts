export interface Transaction {
  id?: string;
  category: string;
  amount: number;
  date?: string;
  editDate?: string;
  type: "expense" | "income";
}

export interface TransactionToDelete {
  id: string;
  type: "expense" | "income";
}

export interface State {
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
  budget: number;
  budgetAddDate: string;
  currencyType: string;
  transactions: Transaction[];
  expenseCategories: string[];
  incomeCategories: string[];
  expensesValue: number;
  incomesValue: number;
  email: string;
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
  currencyType: string;
  title: string;
  titleClass: string;
}

export interface ShowTransactionsProps {
  transactions: Transaction[];
  currencyType: string;
  expenseCategories: string[];
  incomeCategories: string[];
}

export interface ExpensesChartProps {
  transactions: Transaction[];
}

export interface Category {
  categoryName: string;
  type: "expense" | "income";
}
