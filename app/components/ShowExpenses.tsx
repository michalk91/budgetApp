import { useAppSelector, useAppDispatch } from "../redux/hooks";
import {
  deleteExpense,
  fetchExpenses,
  updateExpense,
} from "../redux/usersSlice";

import { useEffect, useState } from "react";

export default function ShowExpenses() {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.user.expenses);

  const [editedExpense, setEditedExpense] = useState({
    id: "",
    category: "",
    amount: "",
  });

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const handleDeleteExpense = (id: string) => {
    dispatch(deleteExpense(id));
  };

  const handleStartEdit = (id: string) => {
    setEditedExpense((state) => ({ ...state, id }));
  };
  const handleCancelEdit = () => {
    setEditedExpense((state) => ({ ...state, id: "" }));
  };

  const handleEditExpense = (id: string, date: string) => {
    const { category, amount } = editedExpense;
    const expense = { id, date, category, amount: Number(amount) };

    dispatch(updateExpense(expense));
    setEditedExpense((state) => ({
      ...state,
      id: "",
      category: "",
      amount: "",
    }));
  };

  return (
    <div className="w-full">
      <span className="font-bold text-xl mx-auto"> Expenses</span>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-2 border-slate-300">
          <thead className="text-xs text-gray-700 uppercase  dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses?.length > 0 &&
              expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className={
                    editedExpense.id === expense.id
                      ? "bg-gray-100 bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      : "hover:bg-gray-100 bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  }
                >
                  <td className="px-6 py-6">
                    <p>created: {expense.date}</p>
                    {expense.editDate && (
                      <p>last modified: {expense.editDate}</p>
                    )}
                  </td>

                  <td className="px-6 py-6">
                    {editedExpense.id !== expense.id ? (
                      expense.category
                    ) : (
                      <input
                        onChange={(e) =>
                          setEditedExpense((state) => ({
                            ...state,
                            category: e.target.value,
                          }))
                        }
                        defaultValue={expense.category}
                        className="px-2 py-1"
                      ></input>
                    )}
                  </td>

                  <td className="px-6 py-6">
                    {editedExpense.id !== expense.id ? (
                      `${expense.amount} $`
                    ) : (
                      <input
                        onChange={(e) =>
                          setEditedExpense((state) => ({
                            ...state,
                            amount: e.target.value,
                          }))
                        }
                        defaultValue={expense.amount}
                        className="px-2 py-1"
                      ></input>
                    )}
                  </td>

                  {editedExpense.id !== expense.id ? (
                    <>
                      <button
                        onClick={() =>
                          expense.id && handleDeleteExpense(expense.id)
                        }
                        className="px-6 py-6"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() =>
                          expense.id && handleStartEdit(expense.id)
                        }
                        className="px-6 py-6"
                      >
                        Edit
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          expense.id &&
                          expense.date &&
                          handleEditExpense(expense.id, expense.date)
                        }
                        className="px-6 py-6"
                      >
                        Confirm
                      </button>
                      <button onClick={handleCancelEdit} className="px-5 py-6">
                        Cancel
                      </button>
                    </>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
