"use client";

import { useEffect, useState } from "react";
import { SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../redux/usersSlice";
import { useAppDispatch } from "../redux/hooks";
import { useAppSelector } from "../redux/hooks";
import Link from "next/link";

const Register = () => {
  const dispatch = useAppDispatch();
  const registerStatus = useAppSelector((state) => state.user.registeredStatus);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const router = useRouter();

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const user = {
      email: email,
      password: password,
      username: username,
    };
    dispatch(registerUser(user));
  };

  useEffect(() => {
    if (registerStatus === "succeeded")
      router.push("/login", { scroll: false });
  }, [registerStatus, router]);

  return (
    <section className="flex w-full h-screen max-h-full justify-center items-center">
      <form className="rounded-md p-10 text-center border-solid border-2 border-blue-400 shadow-xl">
        <div className="p-2">
          <label
            htmlFor="username"
            className="inline-block w-full text-sm font-medium text-gray-500 transition-all duration-200 ease-in-out group-focus-within:text-blue-400"
          >
            Username:
          </label>
          <div className="relative flex items-center">
            <input
              className="peer h-10 w-full rounded-md bg-gray-50 px-4 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-blue-400"
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
              className="peer h-10 w-full rounded-md bg-gray-50 px-4 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-blue-400"
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
              className="peer h-10 w-full rounded-md bg-gray-50 px-4 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-blue-400"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 m-3 px-6 rounded-full "
          type="submit"
          onClick={onSubmit}
        >
          Sign up
        </button>
        <p className="text-m text-center mt-4">
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
