export interface Expense {
  id?: string;
  category: string;
  amount: number;
  date?: string;
  editDate?: string;
}

export interface State {
  registeredStatus: "idle" | "loading" | "succeeded" | "failed";
  loginStatus: "idle" | "loading" | "succeeded" | "failed";
  changePasswordStatus: "idle" | "loading" | "succeeded" | "failed";
  changeUsernameStatus: "idle" | "loading" | "succeeded" | "failed";
  changeEmailStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | undefined;
  userID: null | string;
  username: null | string;
  budget: number;
  currencyType: string;
  expenses: Expense[];
  categories: string[];
}

export interface User {
  email: string;
  password: string;
  username?: string;
}

export interface CurrentBudgetProps {
  fontSize?: string;
}

export interface AddExpenseProps {
  setAddExpense: (value: boolean) => void;
}

export interface SortOptions {
  sortBy: string;
  descending: boolean;
}

export interface ChangeComponentsProps {
  setActive: (value: string) => void;
}
