import { useState } from "react";
import { addExpense } from "../redux/usersSlice";
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
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 m-3 px-6 rounded-full "
      >
        confrim
      </button>
    </form>
  );
}
