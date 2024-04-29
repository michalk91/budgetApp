import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./usersSlice";
import transactionsReducer from "./transactionsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    transactions: transactionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
