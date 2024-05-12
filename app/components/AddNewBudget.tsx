import { SyntheticEvent, useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { AddNewBudgetProps } from "../types";
import { addNewBudget } from "../redux/budgetsSlice";

export default function AddNewBudget({ setNewBudget }: AddNewBudgetProps) {
  const dispatch = useAppDispatch();

  const [budgetFromInput, setBudgetFromInput] = useState({
    name: "",
    amount: "",
    currencyType: "PLN",
  });

  const { name, amount, currencyType } = budgetFromInput;

  const handleAddBudget = (e: SyntheticEvent) => {
    e.preventDefault();

    const budgetValue = Number(amount);

    if (budgetValue <= 0) return;

    dispatch(
      addNewBudget({
        budgetName: name,
        budgetValue,
        currencyType: currencyType as "PLN" | "EUR" | "USD",
      })
    );
    setBudgetFromInput({ name: "", amount: "", currencyType: "PLN" });
    setNewBudget(false);
  };

  return (
    <>
      <tr className="bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700 max-lg:text-center ">
        <td className="px-6 py-6 max-lg:block">
          <span className="ml-2 font-bold text-xl mx-auto max-lg:ml-0">
            New budget
          </span>
        </td>

        <td className=" px-6 py-6 max-lg:block">
          <input
            onChange={(e) =>
              setBudgetFromInput((state) => ({
                ...state,
                name: e.target.value,
              }))
            }
            required
            type="text"
            value={name}
            placeholder="name"
            className="px-2 py-1 rounded-full bg-white max-w-32 border-2 -ml-2 max-lg:ml-0"
          ></input>
        </td>

        <td className="px-6 py-6 max-lg:block">
          <input
            onChange={(e) => {
              setBudgetFromInput((state) => ({
                ...state,
                amount: e.target.value,
              }));
            }}
            required
            type="number"
            value={amount}
            placeholder="amount"
            className="px-2 py-1 rounded-full bg-white max-w-32 bg-white border-2 -ml-1"
          ></input>
          <select
            className="px-2 py-1 ml-1 rounded-full bg-white max-w-32 bg-white border-2"
            onChange={(e) => {
              setBudgetFromInput((state) => ({
                ...state,
                currencyType: e.target.value as "PLN" | "EUR" | "USD",
              }));
            }}
            value={currencyType}
            name="choice"
          >
            <option value="PLN">PLN</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </td>

        <td className="max-lg:block max-lg:pb-4">
          <button
            type="submit"
            onClick={handleAddBudget}
            className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 m-2 px-6 rounded-full "
          >
            Add
          </button>
          <button
            onClick={() => setNewBudget(false)}
            className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 m-2 px-6 rounded-full "
          >
            Cancel
          </button>
        </td>
      </tr>
    </>
  );
}
