import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./usersSlice";
import budgetsRecuer from "./budgetsSlice";
import invitationsReducer from "./invitationsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    budgets: budgetsRecuer,
    invitations: invitationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
