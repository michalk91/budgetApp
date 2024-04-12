export interface Expense {
  id?: string;
  category: string;
  amount: number;
  date?: string;
}

export interface State {
  registeredStatus: "idle" | "loading" | "succeeded" | "failed";
  loginStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | undefined;
  userID: null | string;
  username: null | string;
  budget: number;
  expenses: Expense[];
}

export interface User {
  email: string;
  password: string;
  username?: string;
}