"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { SyntheticEvent } from "react";
import { useRouter } from "next/navigation";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        alert("Account created sucessfully");
        router.push("/login", { scroll: false });
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  return (
    <main>
      <section className="flex w-full h-screen max-h-full justify-center items-center">
        <div>
          <form className="text-center">
            <div className="p-4">
              <label htmlFor="email-address">Email address: </label>
              <input
                className="w-full"
                type="email"
                //   label="Email address"
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
                //   label="Create password"
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
            <a
              className="text-blue-500 text-2xl hover:text-blue-800"
              href="/login"
            >
              Sign in
            </a>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;
