import { useState } from "react";
import { addExpense, decrementBudget } from "../redux/usersSlice";
import { useAppDispatch } from "../redux/hooks";

export default function AddExpense() {
  const dispatch = useAppDispatch();

  const [expenseFromInput, setExpenseFromInput] = useState({
    category: "",
    amount: "",
  });

  const { amount, category } = expenseFromInput;

  const addNewExpense = () => {
    dispatch(addExpense({ category, amount: Number(amount) }));
    dispatch(decrementBudget(Number(amount)));
  };

  return (
    <form className="flex m-4 items-center justify-center">
      <p>Add Expense Category: </p>

      <input
        type="text"
        placeholder="category"
        value={category}
        className="py-3 px-2 text-md border border-blue-lighter rounded-r"
        onChange={(e) =>
          setExpenseFromInput((state) => ({
            ...state,
            category: e.target.value,
          }))
        }
      />

      <p className="ps-8">Add Expense Amount: </p>

      <input
        type="number"
        placeholder="0.00"
        value={amount}
        className="py-3 px-2 text-md border border-blue-lighter rounded-r"
        onChange={(e) =>
          setExpenseFromInput((state) => ({ ...state, amount: e.target.value }))
        }
      />
      <div className="w-8 flex align-center bg-blue-lighter border-t border-l border-b border-blue-lighter rounded-l text-blue-dark">
        $
      </div>
      <button
        type="button"
        onClick={addNewExpense}
        className="rounded-lg px-4 py-2 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-gray-100 duration-300"
      >
        confrim
      </button>
    </form>
  );
}
