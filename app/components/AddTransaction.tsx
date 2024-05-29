import { useCallback, useState } from "react";
import { addTransaction } from "../redux/budgetsSlice";
import { useAppDispatch } from "../redux/hooks";
import type { AddTransactionProps } from "../types";
import Button from "./Button";

export default function AddTransaction({
  setAdd,
  categories,
  type,
}: AddTransactionProps) {
  const dispatch = useAppDispatch();

  const [valueFromInput, setValueFromInput] = useState({
    category: categories[0],
    amount: "",
  });

  const { amount, category } = valueFromInput;

  const addNew = useCallback(() => {
    const amountValue = Number(amount);

    if (amountValue <= 0) return;

    dispatch(addTransaction({ category, amount: amountValue, type }));

    setValueFromInput((state) => ({ ...state, amount: "" }));

    setAdd(false);
  }, [amount, category, dispatch, type, setAdd]);

  return (
    <tr className="bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700 max-lg:text-center">
      <td className="px-6 py-6 max-lg:block">
        <span className="font-bold text-xl mx-auto">
          {type === "expense" ? "New expense" : "New income"}
        </span>
      </td>

      <td
        data-cell="category"
        className="px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_']  max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-md:pb-0 max-lg:flex max-lg:flex-col max-lg:items-center"
      >
        <select
          onChange={(e) => {
            setValueFromInput((state) => ({
              ...state,
              category: e.target.value,
            }));
          }}
          className="bg-white px-2 py-1 rounded-full -ml-2 border-2"
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
        className="px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_']  max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-md:pb-0 max-lg:flex max-lg:flex-col max-lg:items-center"
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
          className="px-2 py-1 rounded-full bg-white max-w-32 border-2"
        ></input>
      </td>
      <td className="pl-6 max-lg:hidden">You</td>
      <td className="max-lg:block max-lg:pb-4 max-md:mt-5">
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
