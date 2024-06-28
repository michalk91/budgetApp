"use client";

import React, { useCallback, useEffect, useState } from "react";
import { SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "../redux/hooks";
import { useAppDispatch } from "../redux/hooks";
import { loginUser, loginGuest, resetLoginStatus } from "../redux/usersSlice";
import Loader from "../components/Loader";
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

  const handleGuestLogin = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(loginGuest());
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
              onChange={(e) =>
                setLoginData((state) => ({ ...state, email: e.target.value }))
              }
              className="peer h-10 w-full rounded-md bg-gray-50 px-4  outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-blue-400"
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
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              onChange={(e) =>
                setLoginData((state) => ({
                  ...state,
                  password: e.target.value,
                }))
              }
              className="peer h-10 w-full rounded-md bg-gray-50 px-4  outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-blue-400"
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

        {loginStatus !== "loading" ? (
          <>
            <button
              type="submit"
              className="bg-blue-500 w-36 hover:bg-blue-700 text-white font-bold py-2 m-3 px-6 rounded-full "
            >
              Login
            </button>
          </>
        ) : (
          <button className="bg-blue-500 w-36 hover:bg-blue-700 text-white font-bold py-2 m-3 px-6 rounded-full ">
            <Loader />
          </button>
        )}
        <p className="text-m text-center mt-4">
          No account yet?
          <Link
            className="text-blue-500 text-xl hover:text-blue-800 m-2"
            href="/register"
          >
            Register
          </Link>
        </p>

        {loginStatus !== "loadingGuest" ? (
          <button
            type="button"
            className="bg-green-600 w-3/4 hover:bg-green-800 text-white font-bold py-2 mt-6 px-6 rounded-full -mb-4 max-md:mb-4"
            onClick={(e) => handleGuestLogin(e)}
          >
            Login as guest
          </button>
        ) : (
          <button
            type="button"
            className="bg-green-600 w-3/4 hover:bg-green-800 text-white font-bold py-2 mt-6 px-6 rounded-full -mb-4 max-md:mb-4"
          >
            <Loader />
          </button>
        )}
      </form>
    </section>
  );
};

export default Login;
