"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { logoutUser } from "../redux/usersSlice";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const loginStatus = useAppSelector((state) => state.user.loginStatus);
  const userName = useAppSelector((state) => state.user.username);

  const singOut = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    if (loginStatus !== "succeeded") router.push("/login", { scroll: false });
  }, [loginStatus, router]);
  return (
    <header className="fixed w-full bg-slate-300 p-6 z-10">
      {loginStatus === "succeeded" && userName && (
        <p className="absolute text-2xl">Welcome {`${userName}`}</p>
      )}
      <ul className="flex justify-end">
        {loginStatus === "succeeded" && (
          <>
            <li className="mr-6">
              <Link
                className={` ${
                  pathname === "/" ? "text-blue-800" : "text-blue-500"
                } text-2xl hover:text-blue-800`}
                href="/"
              >
                Dashboard
              </Link>
            </li>
            <li className="mr-6">
              <Link
                className={` ${
                  pathname === "/setBudget" ? "text-blue-800" : "text-blue-500"
                } text-2xl hover:text-blue-800`}
                href="/setBudget"
              >
                Budget
              </Link>
            </li>
            <li className="mr-6">
              <Link
                className={` ${
                  pathname === "/categorySettings"
                    ? "text-blue-800"
                    : "text-blue-500"
                } text-2xl hover:text-blue-800`}
                href="/categorySettings"
              >
                Categories
              </Link>
            </li>
            <li className="mr-6">
              <Link
                className={` ${
                  pathname === "/accountSettings"
                    ? "text-blue-800"
                    : "text-blue-500"
                } text-2xl hover:text-blue-800`}
                href="/accountSettings"
              >
                Account
              </Link>
            </li>
            <li className="mr-6">
              <Link
                onClick={singOut}
                className="text-blue-500 text-2xl hover:text-blue-800"
                href="/"
              >
                Logout
              </Link>
            </li>
          </>
        )}
        {loginStatus !== "succeeded" && (
          <li className="mr-6">
            <Link
              className={` ${
                pathname === "/register" ? "text-blue-800" : "text-blue-500"
              } text-2xl hover:text-blue-800`}
              href="/register"
            >
              Register
            </Link>
          </li>
        )}

        {loginStatus !== "succeeded" && (
          <li className="mr-6">
            <Link
              className={` ${
                pathname === "/login" ? "text-blue-800" : "text-blue-500"
              } text-2xl hover:text-blue-800`}
              href="/login"
            >
              Login
            </Link>
          </li>
        )}
      </ul>
    </header>
  );
}
