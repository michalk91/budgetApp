/// <reference types="redux-persist" />

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./usersSlice";
import budgetsRecuer from "./budgetsSlice";
import invitationsReducer from "./invitationsSlice";
import transitionReducer from "./transitionSlice";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/lib/persistReducer";
import { combineReducers } from "@reduxjs/toolkit";

const persistConfig = {
  key: "root",
  whitelist: ["user"],
  storage,
};

const reducer = combineReducers({
  user: userReducer,
  budgets: budgetsRecuer,
  invitations: invitationsReducer,
  transition: transitionReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
