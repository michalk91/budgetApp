"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { logoutUser } from "../redux/usersSlice";
import { useRouter } from "next/navigation";

export default function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loginStatus = useAppSelector((state) => state.user.user.loginStatus);

  const singOut = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    if (loginStatus !== "succeeded") router.push("/login", { scroll: false });
  }, [loginStatus, router]);
  return (
    <header className="fixed w-full bg-slate-300 p-6">
      <ul className="flex justify-end">
        <li className="mr-6"></li>

        <li className="mr-6">
          <Link className="text-blue-500 text-2xl hover:text-blue-800" href="/">
            Home
          </Link>
        </li>
        <li className="mr-6">
          {loginStatus === "succeeded" && (
            <Link
              onClick={singOut}
              className="text-blue-500 text-2xl hover:text-blue-800"
              href="/"
            >
              Logout
            </Link>
          )}
        </li>
        <li className="mr-6">
          {loginStatus !== "succeeded" && (
            <Link
              className="text-blue-500 text-2xl hover:text-blue-800"
              href="/register"
            >
              Regitster
            </Link>
          )}
        </li>
        <li className="mr-6">
          {loginStatus !== "succeeded" && (
            <Link
              className="text-blue-500 text-2xl hover:text-blue-800"
              href="/login"
            >
              Login in
            </Link>
          )}
        </li>
      </ul>
    </header>
  );
}
