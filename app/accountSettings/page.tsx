"use client";
import { useState } from "react";
import ChangePassword from "../components/ChangePassword";

export default function Account() {
  const [active, setActive] = useState("");

  return (
    <section className="flex flex-col  w-80 h-screen max-h-full justify-center items-center ">
      <span className="font-bold text-xl mx-auto">Account settings</span>
      <div className="w-full rounded-md p-12  text-center border-solid border-2 border-blue-400 shadow-xl">
        {active === "" && (
          <>
            <button className=" bg-blue-500 w-full my-2 hover:bg-blue-700 text-white font-bold py-2 rounded-full ">
              Change username
            </button>
            <button className="bg-blue-500 w-full my-2 hover:bg-blue-700 text-white font-bold py-2 rounded-full ">
              Change e-mail
            </button>
            <button
              onClick={() => setActive("change-password")}
              className="bg-blue-500 w-full my-2 hover:bg-blue-700 text-white font-bold py-2 rounded-full "
            >
              Change password
            </button>
            <button className="bg-red-500 w-full my-2 hover:bg-red-700 text-white font-bold py-2 rounded-full ">
              Delete account
            </button>
          </>
        )}
        {active === "change-password" && (
          <ChangePassword setActive={setActive} />
        )}
      </div>
    </section>
  );
}
