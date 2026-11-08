"use client";

import React, { useCallback, useEffect, useState } from "react";
import { SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "../redux/hooks";
import { useAppDispatch } from "../redux/hooks";
import {
  loginUser,
  loginAnonymously,
  resetLoginStatus,
} from "../redux/usersSlice";
import Loader from "../components/Loader";
import Button from "../components/Button";
import { toast } from "react-toastify";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";

const Login = () => {
  const dispatch = useAppDispatch();
  const loginStatus = useAppSelector((state) => state.user.loginStatus);

  const [showPassword, setShowPassword] = useState(false);

  const notifyLoggedIn = useCallback(
    () => toast.success("You have successfully logged in"),
    []
  );
  const notifyFailedLogin = useCallback(
    () => toast.error("Wrong email or password"),
    []
  );

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = loginData;

  const router = useRouter();

  const handleLogin = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(loginUser({ email: email, password: password }));
  };

  const handleAnonymousLogin = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(loginAnonymously());
  };

  useEffect(() => {
    if (loginStatus === "succeeded") {
      router.push("/", { scroll: false });
      notifyLoggedIn();
    } else if (loginStatus === "failed") {
      dispatch(resetLoginStatus());
      notifyFailedLogin();
    }
  }, [loginStatus, router, dispatch, notifyFailedLogin, notifyLoggedIn]);

  return (
    <section className="flex flex-col w-full justify-center items-center grow">
      <span className="font-bold text-xl mx-auto">Sing in</span>
      <form
        onSubmit={handleLogin}
        className="rounded-md p-10 text-center border-solid border-2 border-blue-400 shadow-xl max-md:p-4"
      >
        <div className="p-2">
          <label
            htmlFor="email-address"
            className="inline-block w-full text-sm font-medium text-fg-muted transition-all duration-200 ease-in-out group-focus-within:text-blue-400"
          >
            Your e-mail address:
          </label>
          <div className="relative flex items-center">
            <input
              id="email-address"
              autoComplete="email"
              name="email"
              type="email"
              required
              placeholder="Email address"
              onChange={(e) =>
                setLoginData((state) => ({ ...state, email: e.target.value }))
              }
              className="peer h-10 w-full rounded-md bg-field px-4  outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-field-focus focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="p-2">
          <label
            htmlFor="password"
            className="inline-block w-full text-sm font-medium text-fg-muted transition-all duration-200 ease-in-out group-focus-within:text-blue-400"
          >
            Your password:
          </label>
          <div className="relative flex items-center">
            <input
              id="password"
              name="password"
              autoComplete="current-password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              onChange={(e) =>
                setLoginData((state) => ({
                  ...state,
                  password: e.target.value,
                }))
              }
              className="peer h-10 w-full rounded-md bg-field px-4  outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-field-focus focus:ring-2 focus:ring-blue-400"
            />
            {password !== "" && (
              <div
                onClick={() => setShowPassword((state) => !state)}
                className="absolute right-0 px-4 cursor-pointer"
              >
                {showPassword ? (
                  <BiSolidShow size={20} />
                ) : (
                  <BiSolidHide size={20} />
                )}
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={loginStatus === "loading"}
          additionalStyles="w-36 my-5 mx-3 max-md:py-2 max-md:my-5 bg-blue-500 hover:bg-blue-700"
        >
          {loginStatus === "loading" ? <Loader /> : "Login"}
        </Button>
        <p className="text-m text-center">
          No account yet?
          <Link
            className="text-link text-xl hover:text-link-active m-2"
            href="/register"
          >
            Register
          </Link>
        </p>

        <Button
          type="button"
          disabled={loginStatus === "loadingAnonymous"}
          handleClick={handleAnonymousLogin}
          additionalStyles="w-3/4 min-w-fit whitespace-nowrap mx-0 mt-6 -mb-4 max-md:py-2 max-md:mt-6 max-md:mb-4 bg-green-600 hover:bg-green-800"
        >
          {loginStatus === "loadingAnonymous" ? <Loader /> : "Login as anonymous"}
        </Button>
      </form>
    </section>
  );
};

export default Login;
