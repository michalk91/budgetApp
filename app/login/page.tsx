"use client";

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { SyntheticEvent } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const onLogin = (e: SyntheticEvent) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        alert("Singed in sucessfully");
        router.push("/", { scroll: false });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

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
            <a
              className="text-blue-500 text-2xl hover:text-blue-800"
              href="/register"
            >
              Register
            </a>
          </p>
        </section>
      </main>
    </>
  );
};

export default Login;
