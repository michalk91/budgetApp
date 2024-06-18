/// <reference types="redux-persist" />

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./usersSlice";
import budgetsRecuer from "./budgetsSlice";
import invitationsReducer from "./invitationsSlice";
import transitionReducer from "./transitionSlice";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import persistReducer from "redux-persist/lib/persistReducer";
import { combineReducers } from "@reduxjs/toolkit";

export function createPersistStore() {
  const isServer = typeof window === "undefined";
  if (isServer) {
    return {
      getItem() {
        return Promise.resolve(null);
      },
      setItem() {
        return Promise.resolve();
      },
      removeItem() {
        return Promise.resolve();
      },
    };
  }
  return createWebStorage("local");
}
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createPersistStore();

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
