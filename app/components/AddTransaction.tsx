import { useCallback, useState } from "react";
import { addTransaction } from "../redux/budgetsSlice";
import { useAppDispatch } from "../redux/hooks";
import type { AddTransactionProps } from "../types";
import Button from "./Button";

export default function AddTransaction({
  setAdd,
  categories,
  type,
  budgetID,
}: AddTransactionProps) {
  const dispatch = useAppDispatch();

  const [valueFromInput, setValueFromInput] = useState({
    category: categories[0],
    amount: "",
    comment: "-",
  });

  const { amount, category, comment } = valueFromInput;

  const addNew = useCallback(() => {
    const amountValue = Number(amount);

    if (amountValue <= 0) return;

    dispatch(
      addTransaction({
        budgetID,
        transaction: { category, amount: amountValue, type, comment },
      })
    );

    setValueFromInput((state) => ({ ...state, amount: "" }));

    setAdd(false);
  }, [amount, category, dispatch, type, setAdd, comment, budgetID]);

  return (
    <tr className="bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700 max-xl:text-center">
      <td className="px-6 py-6 max-xl:block">
        <span className="font-bold text-xl mx-auto">
          {type === "expense" ? "New expense" : "New income"}
        </span>
      </td>

      <td
        data-cell="category"
        className="px-6 py-6 max-xl:block max-xl:before:content-[attr(data-cell)':_']  max-xl:before:font-bold max-xl:before:uppercase max-xl:text-center max-md:pb-0 max-xl:flex max-xl:flex-col max-xl:items-center"
      >
        <select
          onChange={(e) => {
            setValueFromInput((state) => ({
              ...state,
              category: e.target.value,
            }));
          }}
          className="bg-white px-2 py-1 rounded-full -ml-2 border-2 "
          value={category}
          name="choice"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </td>

      <td
        data-cell="amount"
        className="px-6 py-6 max-xl:block max-xl:before:content-[attr(data-cell)':_']  max-xl:before:font-bold max-xl:before:uppercase max-xl:text-center max-md:pb-0 max-xl:flex max-xl:flex-col max-xl:items-center"
      >
        <input
          onChange={(e) =>
            setValueFromInput((state) => ({
              ...state,
              amount: e.target.value,
            }))
          }
          required
          type="number"
          value={amount}
          placeholder="amount"
          className="px-2 py-1 -ml-1 rounded-full bg-white max-w-32 border-2 "
        ></input>
      </td>
      <td className="pl-6 max-xl:hidden">You</td>
      <td
        className="pl-6 py-6 pr-16 max-xl:px-10 max-md:px-6 max-xl:block max-xl:before:font-bold max-xl:before:uppercase max-xl:text-center max-md:pb-0 max-xl:flex max-xl:flex-col max-xl:items-center"
        colSpan={2}
      >
        <div className="flex justify-center relative max-xl:mt-8 w-full max-xl:px-48 max-lg:px-24 max-md:px-8">
          <label
            className="block absolute -top-[20px] max-xl:font-bold max-xl:uppercase "
            htmlFor="comment"
          >
            Comment: (not required)
          </label>
          <textarea
            onChange={(e) =>
              setValueFromInput((state) => ({
                ...state,
                comment: e.target.value,
              }))
            }
            value={comment}
            className="p-2 w-full rounded-lg border-2 -ml-2"
            name="comment"
            id="comment"
          >
            ...
          </textarea>
        </div>
      </td>
      <td className="max-xl:block max-xl:pb-4 max-md:mt-5">
        <Button
          handleClick={addNew}
          additionalStyles="bg-green-700 hover:bg-green-900"
        >
          Add
        </Button>
        <Button
          handleClick={() => {
            setAdd(false);
          }}
          additionalStyles="bg-red-600 hover:bg-red-800"
        >
          Cancel
        </Button>
      </td>
    </tr>
  );
}
