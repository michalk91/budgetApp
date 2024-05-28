import { SyntheticEvent, useCallback, useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { AddNewUserProps } from "../types";
import Button from "./Button";
import { inviteFriend } from "../redux/invitationsSlice";

export default function AddNewUser({ setNewUser }: AddNewUserProps) {
  const dispatch = useAppDispatch();

  const [userFromInput, setUserFromInput] = useState({
    email: "",
    allowManageCategories: false,
    allowManageAllTransactions: false,
  });

  const { email, allowManageCategories, allowManageAllTransactions } =
    userFromInput;

  const handleAddUser = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      dispatch(
        inviteFriend({
          email,
          allowManageAllTransactions,
          allowManageCategories,
        })
      );
      setUserFromInput({
        email: "",
        allowManageCategories: false,
        allowManageAllTransactions: false,
      });
      setNewUser(false);
    },
    [
      allowManageAllTransactions,
      allowManageCategories,
      dispatch,
      email,
      setNewUser,
    ]
  );

  return (
    <>
      <tr className="bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700 max-lg:text-center ">
        <td className="px-6 py-6 max-lg:block">
          <span className="font-bold text-xl mx-auto max-lg:ml-0">
            New user
          </span>
        </td>

        <td data-cell="e-mail"
         className="px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_']  max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-md:pb-0 max-lg:flex max-lg:flex-col max-lg:items-center">
          <input
            onChange={(e) =>
              setUserFromInput((state) => ({
                ...state,
                email: e.target.value,
              }))
            }
            required
            type="text"
            value={email}
            placeholder="e-mail"
            className="px-2 py-1 rounded-full bg-white max-w-32 border-2 -ml-2 max-lg:ml-0"
          ></input>
        </td>

        <td data-cell="manage categories"
         className="px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_']  max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-md:pb-0 max-lg:flex max-lg:flex-col max-lg:items-center">
          <select
            className="px-2 py-1 -ml-2 rounded-full bg-white max-w-32 bg-white border-2"
            onChange={(e) => {
              setUserFromInput((state) => ({
                ...state,
                allowManageCategories: e.target.value === "yes" ? true : false,
              }));
            }}
            defaultValue={allowManageCategories ? "yes" : "no"}
            name="choice"
          >
            <option value="yes">yes</option>
            <option value="no">no</option>
          </select>
        </td>
        <td data-cell="manage all transactions"
         className="px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_']  max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-md:pb-0 max-lg:flex max-lg:flex-col max-lg:items-center">
          <select
            className="px-2 py-1 -ml-2 rounded-full bg-white max-w-32 bg-white border-2"
            onChange={(e) => {
              setUserFromInput((state) => ({
                ...state,
                allowManageAllTransactions:
                  e.target.value === "yes" ? true : false,
              }));
            }}
            defaultValue={allowManageAllTransactions ? "yes" : "no"}
            name="choice"
          >
            <option value="yes">yes</option>
            <option value="no">no</option>
          </select>
        </td>
        <td className="max-lg:block max-lg:pb-4">
          <Button
            handleClick={handleAddUser}
            additionalStyles="bg-green-700 hover:bg-green-900"
          >
            Add
          </Button>
          <Button
            handleClick={() => setNewUser(false)}
            additionalStyles="bg-red-600 hover:bg-red-800"
          >
            Cancel
          </Button>
        </td>
      </tr>
    </>
  );
}
