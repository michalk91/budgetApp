import { SyntheticEvent, useCallback, useState } from "react";
import { changePassword } from "../redux/usersSlice";
import { useAppDispatch } from "../redux/hooks";
import { toast } from "react-toastify";
import type { ChangeComponentsProps } from "../types";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import Button from "./Button";

export default function ChangePassword({ setActive }: ChangeComponentsProps) {
  const dispatch = useAppDispatch();
  const [newPassword, setNewPassword] = useState({
    password: "",
    repeat: "",
  });

  const [showPassword, setShowPassword] = useState({
    showEnteredPassword: false,
    showRepeatedPassword: false,
  });

  const { showEnteredPassword, showRepeatedPassword } = showPassword;
  const { password, repeat } = newPassword;

  const notifyPasswordChanged = useCallback(
    () => toast.success("The password has been successfully changed"),
    []
  );

  const repeatIncorrectlyChanged = useCallback(
    () => toast.error("You repeated the password incorrectly"),
    []
  );

  const handleChangePassword = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      if (password === repeat) {
        dispatch(changePassword(password));
        notifyPasswordChanged();
        setNewPassword({ ...newPassword, password: "", repeat: "" });
        setActive("");
      } else {
        repeatIncorrectlyChanged();
      }
    },
    [
      dispatch,
      newPassword,
      password,
      repeat,
      notifyPasswordChanged,
      repeatIncorrectlyChanged,
      setActive,
    ]
  );

  return (
    <>
      <form onSubmit={handleChangePassword}>
        <div className="flex flex-wrap">
          <span className="text-lg text-center m-auto">Change password:</span>
          <div className="p-2">
            <label
              htmlFor="password"
              className="inline-block w-full text-sm font-medium text-fg-muted transition-all duration-200 ease-in-out group-focus-within:text-blue-400"
            >
              New password:
            </label>
            <div className="relative flex items-center">
              <input
                className="peer h-10 w-full rounded-xl  px-4 outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-field-focus focus:ring-2 focus:ring-blue-400"
                type={showEnteredPassword ? "text" : "password"}
                value={password}
                autoComplete="new-password"
                name="new-password"
                onChange={(e) =>
                  setNewPassword((state) => ({
                    ...state,
                    password: e.target.value,
                  }))
                }
                required
                placeholder="Password"
              />
              {password !== "" && (
                <div
                  onClick={() =>
                    setShowPassword((state) => ({
                      ...state,
                      showEnteredPassword: !showEnteredPassword,
                    }))
                  }
                  className="absolute right-0 px-4 cursor-pointer"
                >
                  {showEnteredPassword ? (
                    <BiSolidShow size={20} />
                  ) : (
                    <BiSolidHide size={20} />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="p-2">
            <label
              htmlFor="password"
              className="inline-block w-full text-sm font-medium text-fg-muted transition-all duration-200 ease-in-out group-focus-within:text-blue-400"
            >
              Confirm password:
            </label>
            <div className="relative flex items-center">
              <input
                autoComplete="new-password"
                name="repeat-new-password"
                className="peer h-10 w-full rounded-xl px-4 outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-field-focus focus:ring-2 focus:ring-blue-400"
                type={showRepeatedPassword ? "text" : "password"}
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
              {repeat !== "" && (
                <div
                  onClick={() =>
                    setShowPassword((state) => ({
                      ...state,
                      showRepeatedPassword: !showRepeatedPassword,
                    }))
                  }
                  className="absolute right-0 px-4 cursor-pointer"
                >
                  {showRepeatedPassword ? (
                    <BiSolidShow size={20} />
                  ) : (
                    <BiSolidHide size={20} />
                  )}
                </div>
              )}
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
