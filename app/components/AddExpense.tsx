import { useState } from "react";
import { addExpense } from "../redux/usersSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import type { AddExpenseProps } from "../types";

export default function AddExpense({ setAddExpense }: AddExpenseProps) {
  const categories = useAppSelector((state) => state.user.categories);
  const dispatch = useAppDispatch();

  const [expenseFromInput, setExpenseFromInput] = useState({
    category: categories[0],
    amount: "",
  });

  const { amount, category } = expenseFromInput;

  const addNewExpense = () => {
    dispatch(addExpense({ category, amount: Number(amount) }));

    setAddExpense(false);
  };

  return (
    <tr
      className={"bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700"}
    >
      <td className="px-6 py-6">
        <span className="ml-2 font-bold text-xl mx-auto">New expense</span>
      </td>

      <td className="px-6 py-6">
        <select
          onChange={(e) => {
            setExpenseFromInput((state) => ({
              ...state,
              category: e.target.value,
            }));
          }}
          className="px-2 py-1 rounded-full -ml-2"
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
            setExpenseFromInput((state) => ({
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
          onClick={addNewExpense}
          className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 m-2 px-6 rounded-full "
        >
          Add
        </button>
        <button
          onClick={() => setAddExpense(false)}
          className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 m-2 px-6 rounded-full "
        >
          Cancel
        </button>
      </td>
    </tr>
  );
}
