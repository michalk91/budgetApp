"use client";

import { useCallback, useEffect, useState } from "react";
import { SyntheticEvent } from "react";
import { registerUser } from "../redux/usersSlice";
import { useAppDispatch } from "../redux/hooks";
import { useAppSelector } from "../redux/hooks";
import Link from "next/link";
import Loader from "../components/Loader";
import { useRouter } from "next/navigation";
import { resetCreateAccountStatus } from "../redux/usersSlice";
import { toast } from "react-toastify";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";

const Register = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const registerStatus = useAppSelector((state) => state.user.registeredStatus);
  const errorMessage = useAppSelector((state) => state.user.error);

  const [registerData, setRegisterData] = useState({
    email: "",
    username: "",
    password: "",
    repeatPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    showEnteredPassword: false,
    showRepeatedPassword: false,
  });

  const { email, password, username, repeatPassword } = registerData;
  const { showEnteredPassword, showRepeatedPassword } = showPassword;

  const notifyRegistered = useCallback(
    () => toast.success("You have successfully created your account"),
    []
  );
  const notifyFailedRegister = useCallback(() => {
    const validatedText = errorMessage
      ?.replace(/\b(Firebase|Error|auth|weak|password)\b/g, "")
      .replace(/[():/]/g, "")
      .replace(/-/g, " ")
      .replace(/^\s+/g, "")
      ?.replace(/^./, (c) => c.toUpperCase())
      .trim();

    toast.error(validatedText);
  }, [errorMessage]);

  const passwordRepeatFailed = useCallback(
    () => toast.error("The password was repeated incorrectly"),
    []
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (password === repeatPassword) {
      const user = {
        email: email,
        password: password,
        username: username,
      };
      dispatch(registerUser(user));
    } else if (password !== repeatPassword) {
      passwordRepeatFailed();
    }
  };

  useEffect(() => {
    if (registerStatus === "succeeded") {
      router.push("/login");
      notifyRegistered();
      dispatch(resetCreateAccountStatus());
    } else if (registerStatus === "failed") {
      notifyFailedRegister();
      dispatch(resetCreateAccountStatus());
    }
  }, [
    registerStatus,
    router,
    dispatch,
    notifyRegistered,
    notifyFailedRegister,
  ]);

  return (
    <section className="flex flex-col w-full my-16 justify-center items-center grow max-md:pt-8">
      <span className="font-bold text-xl mx-auto">Sing up</span>
      <form
        onSubmit={handleSubmit}
        className="rounded-md p-10 text-center border-solid border-2 border-blue-400 shadow-xl max-md:p-4"
      >
        <div className="p-2">
          <label
            htmlFor="username"
            className="inline-block w-full text-sm font-medium text-gray-500 transition-all duration-200 ease-in-out group-focus-within:text-blue-400"
          >
            Username:
          </label>
          <div className="relative flex items-center">
            <input
              className="peer h-10 w-full rounded-md bg-gray-50 px-4 outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-blue-400"
              id="username"
              name="username"
              type="username"
              required
              placeholder="username"
              onChange={(e) =>
                setRegisterData((state) => ({
                  ...state,
                  username: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <div className="p-2">
          <label
            htmlFor="email-address"
            className="inline-block w-full text-sm font-medium text-gray-500 transition-all duration-200 ease-in-out group-focus-within:text-blue-400"
          >
            Email address:
          </label>
          <div className="relative flex items-center">
            <input
              className="peer h-10 w-full rounded-md bg-gray-50 px-4 outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-blue-400"
              type="email"
              value={email}
              onChange={(e) =>
                setRegisterData((state) => ({
                  ...state,
                  email: e.target.value,
                }))
              }
              required
              placeholder="Email address"
            />
          </div>
        </div>

        <div className="p-2">
          <label
            htmlFor="password"
            className="inline-block w-full text-sm font-medium text-gray-500 transition-all duration-200 ease-in-out group-focus-within:text-blue-400"
          >
            Password:
          </label>
          <div className="relative flex items-center">
            <input
              className="peer h-10 w-full rounded-md bg-gray-50 px-4 outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-blue-400"
              type={showEnteredPassword ? "text" : "password"}
              value={password}
              onChange={(e) =>
                setRegisterData((state) => ({
                  ...state,
                  password: e.target.value,
                }))
              }
              required
              placeholder="Password"
            />
            {password !== "" && (
              <div
                onClick={() =>
                  setShowPassword((state) => ({
                    ...state,
                    showEnteredPassword: !showEnteredPassword,
                  }))
                }
                className="absolute right-0 px-4 cursor-pointer"
              >
                {showEnteredPassword ? (
                  <BiSolidShow size={20} />
                ) : (
                  <BiSolidHide size={20} />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-2">
          <label
            htmlFor="password"
            className="inline-block w-full text-sm font-medium text-gray-500 transition-all duration-200 ease-in-out group-focus-within:text-blue-400"
          >
            Repeat password:
          </label>
          <div className="relative flex items-center">
            <input
              className="peer h-10 w-full rounded-md bg-gray-50 px-4 outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-blue-400"
              type={showRepeatedPassword ? "text" : "password"}
              value={repeatPassword}
              onChange={(e) =>
                setRegisterData((state) => ({
                  ...state,
                  repeatPassword: e.target.value,
                }))
              }
              required
              placeholder="Repeat password"
            />

            {repeatPassword !== "" && (
              <div
                onClick={() =>
                  setShowPassword((state) => ({
                    ...state,
                    showRepeatedPassword: !showRepeatedPassword,
                  }))
                }
                className="absolute right-0 px-4 cursor-pointer"
              >
                {showRepeatedPassword ? (
                  <BiSolidShow size={20} />
                ) : (
                  <BiSolidHide size={20} />
                )}
              </div>
            )}
          </div>
        </div>

        {registerStatus !== "loading" ? (
          <button
            type="submit"
            className="bg-blue-500 w-36 hover:bg-blue-700 text-white font-bold py-2 mx-3 my-5 px-6 rounded-full "
          >
            Sign up
          </button>
        ) : (
          <button className="bg-blue-500 w-36 hover:bg-blue-700 text-white font-bold py-2 my-5 mx-3 px-6 rounded-full ">
            <Loader />
          </button>
        )}

        <p className="text-m text-center">
          Already have an account?
          <Link
            className="text-blue-500 text-xl hover:text-blue-800 m-2"
            href="/login"
          >
            Sign in
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
