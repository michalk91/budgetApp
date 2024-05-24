"use client";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import { usePathname } from "next/navigation";
import ShowBudgets from "./components/ShowBudgets";
import { useEffect } from "react";
import { setSelectedBudgetID } from "./redux/budgetsSlice";
import { fetchUserData } from "./redux/usersSlice";
import { setSelectedOption } from "./redux/budgetsSlice";

export default function Dashboard() {
  const dispatch = useAppDispatch();

  const path = usePathname();
  const loginStatus = useAppSelector((state) => state.user.loginStatus);

  useEffect(() => {
    loginStatus === "succeeded" && dispatch(fetchUserData());
  }, [dispatch, loginStatus]);

  useEffect(() => {
    if (loginStatus === "loggedOut") {
      dispatch(setSelectedBudgetID({ budgetID: "" }));
      dispatch(setSelectedOption("Expenses"));
    }
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
