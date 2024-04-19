import { SyntheticEvent, useEffect } from "react";
import { removeUser } from "../redux/usersSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { toast } from "react-toastify";
import type { ChangeComponentsProps } from "../types";

export default function RemoveUser({ setActive }: ChangeComponentsProps) {
  const removeUserStatus = useAppSelector(
    (state) => state.user.removeUserStatus
  );
  const dispatch = useAppDispatch();

  const notifyUserRemoved = () =>
    toast.success("The user has been successfully removed");

  const handleRemoveUser = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(removeUser());
  };

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
