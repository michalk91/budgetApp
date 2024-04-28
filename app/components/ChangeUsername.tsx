import { SyntheticEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { toast } from "react-toastify";
import type { ChangeComponentsProps } from "../types";
import { changeUsername } from "../redux/usersSlice";

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
              className="inline-block w-full text-sm font-medium text-gray-500 transition-all duration-200 ease-in-out group-focus-within:text-blue-400"
            >
              New username:
            </label>
            <div className="relative flex items-center">
              <input
                className="peer h-10 w-full rounded-md  px-4 outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-blue-400"
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
          <button
            className="w-4/5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 my-2 px-6 rounded-full "
            type="submit"
          >
            Confirm
          </button>
          <button
            onClick={() => setActive("")}
            className="w-4/5 bg-red-500 hover:bg-red-700 text-white font-bold py-2 my-2 px-6 rounded-full "
            type="button"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
