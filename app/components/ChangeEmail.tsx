import { SyntheticEvent, useState } from "react";
import { changeEmail } from "../redux/usersSlice";
import { useAppDispatch } from "../redux/hooks";
import { toast } from "react-toastify";
import type { ChangeComponentsProps } from "../types";

export default function ChangeEmail({ setActive }: ChangeComponentsProps) {
  const dispatch = useAppDispatch();
  const [newEmail, setNewEmail] = useState({
    email: "",
    repeat: "",
  });

  const { email, repeat } = newEmail;

  const handleChangePassword = (e: SyntheticEvent) => {
    e.preventDefault();

    if (email === repeat) {
      dispatch(changeEmail(email));

      notifyPasswordChanged();

      setNewEmail({ ...newEmail, email: "", repeat: "" });
      setActive("");
    } else {
      repeatIncorrectlyChanged();
    }
  };

  const notifyPasswordChanged = () =>
    toast.success("The email has been successfully changed");

  const repeatIncorrectlyChanged = () =>
    toast.error("You repeated the email incorrectly");

  return (
    <>
      <form onSubmit={handleChangePassword}>
        <div className="flex flex-wrap">
          <span className="text-lg text-center m-auto">Change email:</span>
          <div className="p-2">
            <label
              htmlFor="email"
              className="inline-block w-full text-sm font-medium text-gray-500 transition-all duration-200 ease-in-out group-focus-within:text-blue-400"
            >
              New e-mail:
            </label>
            <div className="relative flex items-center">
              <input
                className="peer h-10 w-full rounded-md  px-4 outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-blue-400"
                type="email"
                value={email}
                onChange={(e) =>
                  setNewEmail((state) => ({
                    ...state,
                    email: e.target.value,
                  }))
                }
                required
                placeholder="e-mail"
              />
            </div>
          </div>
          <div className="p-2">
            <label
              htmlFor="email"
              className="inline-block w-full text-sm font-medium text-gray-500 transition-all duration-200 ease-in-out group-focus-within:text-blue-400"
            >
              Confirm e-mail:
            </label>
            <div className="relative flex items-center">
              <input
                className="peer h-10 w-full rounded-md px-4 outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-blue-400"
                type="email"
                value={repeat}
                onChange={(e) =>
                  setNewEmail((state) => ({
                    ...state,
                    repeat: e.target.value,
                  }))
                }
                required
                placeholder="e-mail"
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
