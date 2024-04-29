"use client";
import { useState } from "react";
import ChangePassword from "../components/ChangePassword";
import ChangeUsername from "../components/ChangeUsername";
import ChangeEmail from "../components/ChangeEmail";
import RemoveUser from "../components/RemoveUser";
import { useAppSelector } from "../redux/hooks";

export default function Account() {
  const userEmail = useAppSelector((state) => state.user.email);

  const [active, setActive] = useState("");

  const GUEST_EMAIL = process.env.GUEST_EMAIL;

  return (
    <section className="flex flex-col  w-72 grow justify-center items-center m-auto ">
      <span className="font-bold text-xl mx-auto">Account settings</span>
      <div className="w-full rounded-md p-8  text-center border-solid border-2 border-blue-400 shadow-xl">
        {active === "" && (
          <>
            <button
              onClick={() =>
                userEmail !== GUEST_EMAIL && setActive("change-username")
              }
              className={`w-full my-2 text-white font-bold py-2 rounded-full ${
                userEmail === GUEST_EMAIL
                  ? "cursor-not-allowed bg-blue-300 "
                  : "bg-blue-500 hover:bg-blue-700"
              }`}
            >
              Change username
            </button>
            <button
              onClick={() =>
                userEmail !== GUEST_EMAIL && setActive("change-email")
              }
              className={`w-full my-2 text-white font-bold py-2 rounded-full ${
                userEmail === GUEST_EMAIL
                  ? "cursor-not-allowed bg-blue-300 "
                  : "bg-blue-500 hover:bg-blue-700"
              }`}
            >
              Change e-mail
            </button>
            <button
              onClick={() =>
                userEmail !== GUEST_EMAIL && setActive("change-password")
              }
              className={`w-full my-2 text-white font-bold py-2 rounded-full ${
                userEmail === GUEST_EMAIL
                  ? "cursor-not-allowed bg-blue-300 "
                  : "bg-blue-500 hover:bg-blue-700"
              }`}
            >
              Change password
            </button>
            <button
              onClick={() =>
                userEmail !== GUEST_EMAIL && setActive("remove-user")
              }
              className={`w-full my-2 text-white font-bold py-2 rounded-full ${
                userEmail === GUEST_EMAIL
                  ? "cursor-not-allowed bg-red-300 "
                  : "bg-red-500 hover:bg-red-700"
              }`}
            >
              Delete account
            </button>
          </>
        )}
        {active === "change-password" && (
          <ChangePassword setActive={setActive} />
        )}
        {active === "change-username" && (
          <ChangeUsername setActive={setActive} />
        )}
        {active === "change-email" && <ChangeEmail setActive={setActive} />}
        {active === "remove-user" && <RemoveUser setActive={setActive} />}
      </div>
    </section>
  );
}
