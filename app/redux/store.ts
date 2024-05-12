import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./usersSlice";
import budgetsRecuer from "./budgetsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    budgets: budgetsRecuer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
