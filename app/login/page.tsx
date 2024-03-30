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
  const loginStatus = useAppSelector((state) => state.user.user.loginStatus);

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
    <>
      <main>
        <section className="flex flex-col w-full h-screen max-h-full justify-center items-center">
          <form className="text-center">
            <div className="p-4">
              <label htmlFor="email-address">Email address: </label>
              <input
                className="w-full"
                id="email-address"
                name="email"
                type="email"
                required
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="p-4">
              <label htmlFor="password">Password: </label>
              <input
                className="w-full"
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
              onClick={onLogin}
            >
              Login
            </button>
          </form>
          <p className="text-sm text-white text-center">
            No account yet?
            <Link
              className="text-blue-500 text-2xl hover:text-blue-800"
              href="/register"
            >
              Register
            </Link>
          </p>
          {loginStatus === "failed" && <p>Wrong email or password</p>}
        </section>
      </main>
    </>
  );
};

export default Login;
