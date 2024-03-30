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
  const registerStatus = useAppSelector(
    (state) => state.user.user.registeredStatus
  );

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
    if (registerStatus === "succeeded") router.push("/", { scroll: false });
  }, [registerStatus, router]);

  return (
    <main>
      <section className="flex w-full h-screen max-h-full justify-center items-center">
        <div>
          <form className="text-center">
            <div className="p-4">
              <label htmlFor="username">Username: </label>
              <input
                className="w-full"
                id="username"
                name="username"
                type="username"
                required
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="p-4">
              <label htmlFor="email-address">Email address: </label>
              <input
                className="w-full"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email address"
              />
            </div>

            <div className="p-4">
              <label htmlFor="password">Password: </label>
              <input
                className="w-full"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
              />
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
              onClick={onSubmit}
            >
              Sign up
            </button>
          </form>

          <p className="text-sm text-white text-center">
            Already have an account?
            <Link
              className="text-blue-500 text-2xl hover:text-blue-800"
              href="/login"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;
