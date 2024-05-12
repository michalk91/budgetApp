"use client";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import { usePathname } from "next/navigation";
import ShowBudgets from "./components/ShowBudgets";
import { useEffect } from "react";
import { setSelectedBudgetID } from "./redux/budgetsSlice";
import { fetchUserData } from "./redux/usersSlice";

export default function Dashboard() {
  const dispatch = useAppDispatch();

  const path = usePathname();
  const loginStatus = useAppSelector((state) => state.user.loginStatus);

  useEffect(() => {
    loginStatus === "succeeded" && dispatch(fetchUserData());
  }, [dispatch, loginStatus]);

  useEffect(() => {
    loginStatus === "loggedOut" &&
      dispatch(setSelectedBudgetID({ budgetID: "" }));
  }, [loginStatus, dispatch]);

  return (
    <>
      {loginStatus === "succeeded" && path !== "/register" ? (
        <ShowBudgets />
      ) : (
        <p>You are not logged in </p>
      )}
    </>
  );
}
