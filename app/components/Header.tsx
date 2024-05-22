"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { logoutUser } from "../redux/usersSlice";
import { useRouter, usePathname } from "next/navigation";
import useTouchOutside from "../hooks/useTouchOutside";
import { fetchInvitations } from "../redux/invitationsSlice";

export default function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const loginStatus = useAppSelector((state) => state.user.loginStatus);
  const userName = useAppSelector((state) => state.user.username);
  const invitations = useAppSelector((state) => state.invitations.budgets);

  const [isOpen, setIsOpen] = useState(false);

  const singOut = () => {
    dispatch(logoutUser());
  };

  const menuRef = useRef<HTMLElement>(null);

  const touchedOutside = useTouchOutside(
    menuRef as React.MutableRefObject<HTMLElement>
  );

  useEffect(() => {
    if (loginStatus === "succeeded") dispatch(fetchInvitations());
  }, [dispatch, loginStatus]);

  useEffect(() => {
    if (touchedOutside) setIsOpen(false);
  }, [touchedOutside]);

  useEffect(() => {
    if (loginStatus !== "succeeded") router.push("/login", { scroll: false });
  }, [loginStatus, router]);

  return (
    <header ref={menuRef} className="fixed top-0 w-full z-10 h-20 max-md:h-16">
      <div className="absolute top-0 left-0 bottom-0 right-0 bg-slate-300 z-10"></div>
      {loginStatus === "succeeded" && userName && (
        <p
          className={`absolute max-md:text-xl text-2xl pl-6 z-40  top-2/4 -translate-y-2/4`}
        >
          Welcome {`${userName}`}
        </p>
      )}
      <div className="flex h-full items-center justify-end relative z-30 text-left lg:hidden text-right pr-4">
        <button
          onClick={() => setIsOpen((state) => !state)}
          aria-expanded={isOpen}
          type="button"
          className="group relative h-6 w-6  flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px]  bg-slate-700 ring-0 ring-gray-300 "
        >
          <span className="absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 translate-y-[calc(-150%-0.25rem)] transition-transform duration-[calc(300ms *2/3)] before:absolute before:right-0 before:h-full before:w-full before:rounded-full before:bg-white before:transition-[width] before:delay-[calc(300ms*1/3)] before:duration-[calc(300ms*2/3)] group-aria-expanded:-translate-y-1/2 group-aria-expanded:-rotate-45 group-aria-expanded:delay-[calc(300ms*1/3)] before:group-aria-expanded:w-[60%] before:group-aria-expanded:delay-0"></span>
          <span className="absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-transform duration-[calc(300ms *2/3)] group-aria-expanded:rotate-45 group-aria-expanded:delay-[calc(300ms *1/3)]"></span>
          <span className="absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 translate-y-[calc(50%+0.25rem)] transition-transform duration-[calc(300ms*2/3)] before:absolute before:right-0 before:h-full before:w-[60%] before:rounded-full before:bg-white before:transition-[right] before:delay-[calc(300ms *1/3)] before:duration-[calc(300ms*2/3)] group-aria-expanded:-translate-y-1/2 group-aria-expanded:-rotate-45 group-aria-expanded:delay-[calc(300ms*1/3)] before:group-aria-expanded:right-[40%] before:group-aria-expanded:delay-0"></span>
        </button>
      </div>
      <ul
        className={`flex relative bg-slate-300 w-full lg:h-full max-lg:border-t-2 border-gray-400 max-lg:py-6  items-center transition duration-500 z-30 lg:visible justify-end max-lg:flex-col max-lg:item-center max-lg:z-0 max-lg:absolute max-lg:top-1/1 md:pr-2
        ${!isOpen ? "max-lg:-translate-y-full" : "max-lg:translate-y-0"}`}
      >
        {loginStatus === "succeeded" && (
          <>
            <li className="mr-6 max-lg:p-6 max-md:mr-0">
              <Link
                onClick={() => setIsOpen(false)}
                className={` ${
                  pathname === "/" ? "text-blue-800" : "text-blue-500"
                } max-md:text-xl text-2xl hover:text-blue-800`}
                href="/"
              >
                Dashboard
              </Link>
            </li>
            <li className="mr-6 max-lg:p-6 max-md:mr-0">
              <Link
                onClick={() => setIsOpen(false)}
                className={`${
                  invitations.length > 0 ? "before:content-['•_']" : ""
                } ${
                  pathname === "/notifications"
                    ? "text-blue-800"
                    : "text-blue-500"
                } max-md:text-xl text-2xl hover:text-blue-800`}
                href="/notifications"
              >
                Notifications
              </Link>
            </li>
            <li className="mr-6 max-lg:p-6 max-md:mr-0">
              <Link
                onClick={() => setIsOpen(false)}
                className={` ${
                  pathname === "/accountSettings"
                    ? "text-blue-800"
                    : "text-blue-500"
                } max-md:text-xl text-2xl hover:text-blue-800`}
                href="/accountSettings"
              >
                Account
              </Link>
            </li>
            <li className="mr-6 max-lg:p-6 max-md:mr-0">
              <Link
                onClick={() => {
                  setIsOpen(false);
                  singOut();
                }}
                className="text-red-500 text-2xl hover:text-red-800 max-md:text-xl"
                href="/"
              >
                Logout
              </Link>
            </li>
          </>
        )}
        {loginStatus !== "succeeded" && (
          <li className="mr-6 max-lg:p-6 max-md:mr-0">
            <Link
              onClick={() => setIsOpen(false)}
              className={` ${
                pathname === "/register" ? "text-blue-800" : "text-blue-500"
              } text-2xl hover:text-blue-800 max-md:text-xl`}
              href="/register"
            >
              Register
            </Link>
          </li>
        )}

        {loginStatus !== "succeeded" && (
          <li className="mr-6 max-lg:p-6 max-md:mr-0">
            <Link
              onClick={() => setIsOpen(false)}
              className={` ${
                pathname === "/login" ? "text-blue-800" : "text-blue-500"
              } text-2xl hover:text-blue-800 max-md:text-xl`}
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
