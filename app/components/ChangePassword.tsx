import { SyntheticEvent, useState } from "react";
import { changePassword } from "../redux/usersSlice";
import { useAppDispatch } from "../redux/hooks";
import { toast } from "react-toastify";

export default function ChangePassword() {
  const dispatch = useAppDispatch();
  const [newPassword, setNewPassword] = useState({
    password: "",
    repeat: "",
  });

  const { password, repeat } = newPassword;

  const handleChangePassword = (e: SyntheticEvent) => {
    e.preventDefault();

    if (password === repeat) {
      dispatch(changePassword(password));
      notifyPasswordChanged();
      setNewPassword({ ...newPassword, password: "", repeat: "" });
    } else {
      repeatIncorrectlyChanged();
    }
  };

  const notifyPasswordChanged = () =>
    toast.success("The password has been successfully changed");

  const repeatIncorrectlyChanged = () =>
    toast.error("You repeated the password incorrectly");

  return (
    <>
      <form onSubmit={handleChangePassword} className=" p-3  ">
        <span>Change password:</span>
        <div className="flex flex-wrap">
          <div className="p-2">
            <label
              htmlFor="password"
              className="inline-block w-full text-sm font-medium text-gray-500 transition-all duration-200 ease-in-out group-focus-within:text-blue-400"
            >
              New password:
            </label>
            <div className="relative flex items-center">
              <input
                className="peer h-10 w-full rounded-md  px-4 outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-blue-400"
                type="password"
                value={password}
                onChange={(e) =>
                  setNewPassword((state) => ({
                    ...state,
                    password: e.target.value,
                  }))
                }
                required
                placeholder="Password"
              />
            </div>
          </div>
          <div className="p-2">
            <label
              htmlFor="password"
              className="inline-block w-full text-sm font-medium text-gray-500 transition-all duration-200 ease-in-out group-focus-within:text-blue-400"
            >
              Confirm password:
            </label>
            <div className="relative flex items-center">
              <input
                className="peer h-10 w-full rounded-md px-4 outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-blue-400"
                type="password"
                value={repeat}
                onChange={(e) =>
                  setNewPassword((state) => ({
                    ...state,
                    repeat: e.target.value,
                  }))
                }
                required
                placeholder="Password"
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            className="w-4/5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 my-2 px-6 rounded-full "
            type="submit"
          >
            Confirm
          </button>
        </div>
      </form>
    </>
  );
}
