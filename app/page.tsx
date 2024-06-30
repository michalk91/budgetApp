"use client";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import { usePathname } from "next/navigation";
import ShowBudgets from "./components/ShowBudgets";
import { useEffect } from "react";
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
      dispatch(setSelectedOption("Expenses"));
    }
  }, [loginStatus, dispatch]);

  return (
    <>
      {loginStatus === "succeeded" && path !== "/register" ? (
        <ShowBudgets />
      ) : (
        <p className="text-center text-xl pt-5">You are not logged in. </p>
      )}
    </>
  );
}
