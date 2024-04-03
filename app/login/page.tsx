"use client";

import React, { useEffect, useState } from "react";
import { SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "../redux/hooks";
import { useAppDispatch } from "../redux/hooks";
import { loginUser } from "../redux/usersSlice";

const Login = () => {
  const dispatch = useAppDispatch();
  const loginStatus = useAppSelector((state) => state.user.loginStatus);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const onLogin = async (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email: email, password: password }));
  };

  useEffect(() => {
    if (loginStatus === "succeeded") router.push("/", { scroll: false });
  }, [loginStatus, router]);

  return (
    <section className="flex flex-col w-full h-screen max-h-full justify-center items-center">
      <form className="rounded-md p-10 text-center border-solid border-2 border-blue-400 shadow-xl">
        <div className="p-2">
          <label
            htmlFor="email-address"
            className="inline-block w-full text-sm font-medium text-gray-500 transition-all duration-200 ease-in-out group-focus-within:text-blue-400"
          >
            Your e-mail address:
          </label>
          <div className="relative flex items-center">
            <input
              id="email-address"
              name="email"
              type="email"
              required
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
              className="peer h-10 w-full rounded-md bg-gray-50 px-4 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="p-2">
          <label
            htmlFor="password"
            className="inline-block w-full text-sm font-medium text-gray-500 transition-all duration-200 ease-in-out group-focus-within:text-blue-400"
          >
            Your password:
          </label>
          <div className="relative flex items-center">
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="peer h-10 w-full rounded-md bg-gray-50 px-4 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 m-3 px-6 rounded-full "
          onClick={onLogin}
        >
          Login
        </button>
        <p className="text-m text-center mt-4">
          No account yet?
          <Link
            className="text-blue-500 text-xl hover:text-blue-800 m-2"
            href="/register"
          >
            Register
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
