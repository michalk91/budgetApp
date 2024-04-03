"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { logoutUser } from "../redux/usersSlice";
import { useRouter } from "next/navigation";

export default function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loginStatus = useAppSelector((state) => state.user.loginStatus);
  const userName = useAppSelector((state) => state.user.username);

  const singOut = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    if (loginStatus !== "succeeded") router.push("/login", { scroll: false });
  }, [loginStatus, router]);
  return (
    <header className="fixed w-full bg-slate-300 p-6">
      {loginStatus === "succeeded" && (
        <p className="absolute text-2xl">Welcome {`${userName}`}</p>
      )}
      <ul className="flex justify-end">
        <li className="mr-6"></li>

        <li className="mr-6">
          <Link className="text-blue-500 text-2xl hover:text-blue-800" href="/">
            Home
          </Link>
        </li>
        {loginStatus === "succeeded" && (
          <li className="mr-6">
            <Link
              onClick={singOut}
              className="text-blue-500 text-2xl hover:text-blue-800"
              href="/"
            >
              Logout
            </Link>
          </li>
        )}
        {loginStatus !== "succeeded" && (
          <li className="mr-6">
            <Link
              className="text-blue-500 text-2xl hover:text-blue-800"
              href="/register"
            >
              Regitster
            </Link>
          </li>
        )}

        {loginStatus !== "succeeded" && (
          <li className="mr-6">
            <Link
              className="text-blue-500 text-2xl hover:text-blue-800"
              href="/login"
            >
              Login in
            </Link>
          </li>
        )}
      </ul>
    </header>
  );
}
