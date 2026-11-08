import { SyntheticEvent, useCallback, useEffect } from "react";
import { removeUser } from "../redux/usersSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { toast } from "react-toastify";
import type { ChangeComponentsProps } from "../types";
import Button from "./Button";

export default function RemoveUser({ setActive }: ChangeComponentsProps) {
  const removeUserStatus = useAppSelector(
    (state) => state.user.removeUserStatus
  );
  const dispatch = useAppDispatch();

  const notifyUserRemoved = () =>
    toast.success("The user has been successfully removed.");

  const handleRemoveUser = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      dispatch(removeUser());
    },
    [dispatch]
  );

  useEffect(() => {
    if (removeUserStatus === "succeeded") {
      notifyUserRemoved();
    }
  }, [removeUserStatus]);

  return (
    <>
      <form onSubmit={handleRemoveUser}>
        <div className="flex flex-wrap">
          <span className="text-lg text-center m-auto pb-6">
            Are you sure you want to delete the user?
          </span>
        </div>

        <div className="text-center">
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
