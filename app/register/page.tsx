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

const Register = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const registerStatus = useAppSelector((state) => state.user.registeredStatus);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const notifyRegistered = useCallback(
    () => toast.success("You have successfully created your account"),
    []
  );
  const notifyFailedRegister = useCallback(
    () =>
      toast.error(
        "Username and email are probably taken. Use a different email and username"
      ),
    []
  );

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const user = {
      email: email,
      password: password,
      username: username,
    };
    dispatch(registerUser(user));
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
    <section className="flex flex-col w-full justify-center items-center grow max-md:pt-8">
      <span className="font-bold text-xl mx-auto">Sing up</span>
      <form className="rounded-md p-10 text-center border-solid border-2 border-blue-400 shadow-xl max-md:p-4">
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
              onChange={(e) => setUsername(e.target.value)}
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
              onChange={(e) => setEmail(e.target.value)}
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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
        </div>

        {registerStatus !== "loading" ? (
          <button
            className="bg-blue-500 w-36 hover:bg-blue-700 text-white font-bold py-2 m-3 px-6 rounded-full "
            onClick={onSubmit}
          >
            Sign up
          </button>
        ) : (
          <button
            className="bg-blue-500 w-36 hover:bg-blue-700 text-white font-bold py-2 m-3 px-6 rounded-full "
            onClick={onSubmit}
          >
            <Loader />
          </button>
        )}

        <p className="text-m text-center mt-4">
          Already have an account?
          <Link
            className="text-blue-500 text-xl hover:text-blue-800 m-2"
            href="/login"
          >
            Sign up
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
