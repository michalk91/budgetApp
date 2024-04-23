import { useState } from "react";
import { addTransaction } from "../redux/usersSlice";
import { useAppDispatch } from "../redux/hooks";
import type { AddTransactionProps } from "../types";

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

  const addNew = () => {
    dispatch(addTransaction({ category, amount: Number(amount), type }));

    setValueFromInput((state) => ({ ...state, amount: "" }));

    setAdd(false);
  };

  return (
    <tr className="bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700">
      <td className="px-6 py-6">
        <span className="ml-2 font-bold text-xl mx-auto">
          {type === "expense" ? "New expense" : "New income"}
        </span>
      </td>

      <td className="px-6 py-6">
        <select
          onChange={(e) => {
            setValueFromInput((state) => ({
              ...state,
              category: e.target.value,
            }));
          }}
          className="px-2 py-1 rounded-full -ml-3"
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

      <td className="px-6 py-6">
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
          className="px-2 py-1 rounded-full -ml-2"
        ></input>
      </td>

      <td>
        <button
          type="submit"
          onClick={addNew}
          className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 m-2 px-6 rounded-full "
        >
          Add
        </button>
        <button
          onClick={() => setAdd(false)}
          className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 m-2 px-6 rounded-full "
        >
          Cancel
        </button>
      </td>
    </tr>
  );
}