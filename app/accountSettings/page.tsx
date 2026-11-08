"use client";
import { useState, useEffect } from "react";
import ChangePassword from "../components/ChangePassword";
import ChangeUsername from "../components/ChangeUsername";
import ChangeEmail from "../components/ChangeEmail";
import RemoveUser from "../components/RemoveUser";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { resetRemoveUserStatus } from "../redux/usersSlice";
import Button from "../components/Button";
import { cn } from "../utils/cn";

// Not available to anonymous users.
const accountEditOptions = [
  { action: "change-username", label: "Change username" },
  { action: "change-email", label: "Change e-mail" },
  { action: "change-password", label: "Change password" },
];

export default function Account() {
  const dispatch = useAppDispatch();

  const loggedInAsAnonymous = useAppSelector(
    (state) => state.user.loggedInAsAnonymous
  );

  const [active, setActive] = useState("");

  useEffect(() => {
    dispatch(resetRemoveUserStatus());
  }, [dispatch]);

  return (
    <section className="flex flex-col  w-72 grow justify-center items-center m-auto ">
      <span className="font-bold text-xl mx-auto">Account settings</span>
      <div className="w-full rounded-md p-8  text-center border-solid border-2 border-blue-400 shadow-xl">
        {active === "" && (
          <>
            {accountEditOptions.map(({ action, label }) => (
              <Button
                key={action}
                compact
                handleClick={() => !loggedInAsAnonymous && setActive(action)}
                additionalStyles={cn(
                  "w-full",
                  loggedInAsAnonymous
                    ? "cursor-not-allowed bg-primary-disabled text-on-disabled"
                    : "bg-blue-500 hover:bg-blue-700"
                )}
              >
                {label}
              </Button>
            ))}
            <Button
              compact
              handleClick={() => setActive("remove-user")}
              additionalStyles="w-full bg-red-500 hover:bg-red-700"
            >
              Delete account
            </Button>
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
