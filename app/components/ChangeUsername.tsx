import { SyntheticEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { toast } from "react-toastify";
import type { ChangeComponentsProps } from "../types";
import { changeUsername } from "../redux/usersSlice";
import Button from "./Button";

export default function ChangeUsername({ setActive }: ChangeComponentsProps) {
  const dispatch = useAppDispatch();
  const changeUsernameStatus = useAppSelector(
    (state) => state.user.changeUsernameStatus
  );

  const [newUsername, setNewUsername] = useState("");

  const notifyUsernameChanged = () =>
    toast.success("The username has been successfully changed");

  const notifyError = () => toast.error("Something went wrong");

  const handleChangeUsername = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(changeUsername(newUsername));

    notifyUsernameChanged();
    setActive("");
  };

  useEffect(() => {
    if (changeUsernameStatus === "failed") {
      notifyError();
    }
  }, [changeUsernameStatus]);

  return (
    <>
      <form onSubmit={handleChangeUsername}>
        <div className="flex flex-wrap">
          <span className="text-lg text-center m-auto">Change username:</span>
          <div className="p-2">
            <label
              htmlFor="password"
              className="inline-block w-full text-sm font-medium text-fg-muted transition-all duration-200 ease-in-out group-focus-within:text-blue-400"
            >
              New username:
            </label>
            <div className="relative flex items-center">
              <input
                className="peer h-10 w-full rounded-xl  px-4 outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-field-focus focus:ring-2 focus:ring-blue-400"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
                placeholder="username"
              />
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <Button
            type="submit"
            compact
            additionalStyles="w-4/5 bg-blue-500 hover:bg-blue-700"
          >
            Confirm
          </Button>
          <Button
            type="button"
            compact
            handleClick={() => setActive("")}
            additionalStyles="w-4/5 bg-red-500 hover:bg-red-700"
          >
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
}
