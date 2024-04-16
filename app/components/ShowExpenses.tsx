import { useAppSelector, useAppDispatch } from "../redux/hooks";
import {
  deleteExpense,
  fetchExpenses,
  updateExpense,
} from "../redux/usersSlice";

import { useEffect, useState } from "react";
import AddExpense from "./AddExpense";
import useFormatter from "../hooks/useFormatter";

export default function ShowExpenses() {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.user.expenses);
  const currencyType = useAppSelector((state) => state.user.currencyType);
  const categories = useAppSelector((state) => state.user.categories);

  const [addExpense, setAddExpense] = useState(false);

  const [editedExpense, setEditedExpense] = useState({
    id: "",
    category: "",
    amount: "",
  });

  const formatter = useFormatter();

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
      <span className="ml-2 font-bold text-xl mx-auto"> Expenses</span>
      <div className="relative overflow-x-auto border-2 border-slate-300 rounded-lg">
        <table className="table-fixed w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
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
            {expenses?.map((expense) => (
              <tr
                key={expense.id}
                className={
                  editedExpense.id === expense.id
                    ? "bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700"
                    : "hover:bg-gray-100 bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                }
              >
                <td className="px-6 py-6">
                  <p>created: {expense.date}</p>
                  {expense.editDate && <p>modified: {expense.editDate}</p>}
                </td>

                <td className="px-6 py-6">
                  {editedExpense.id !== expense.id ? (
                    expense.category
                  ) : (
                    <select
                      onChange={(e) =>
                        setEditedExpense((state) => ({
                          ...state,
                          category: e.target.value,
                        }))
                      }
                      className="px-2 py-1 rounded-lg -ml-2"
                      defaultValue={expense.category}
                      name="choice"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  )}
                </td>

                <td className="px-6 py-6">
                  {editedExpense.id !== expense.id ? (
                    formatter(expense.amount, currencyType)
                  ) : (
                    <input
                      type="number"
                      onChange={(e) =>
                        setEditedExpense((state) => ({
                          ...state,
                          amount: e.target.value,
                        }))
                      }
                      defaultValue={expense.amount}
                      className="px-2 py-1 rounded-lg -ml-2"
                    ></input>
                  )}
                </td>

                {editedExpense.id !== expense.id ? (
                  <td>
                    <button
                      onClick={() =>
                        !addExpense &&
                        expense.id &&
                        editedExpense.id === "" &&
                        handleDeleteExpense(expense.id)
                      }
                      className={
                        !addExpense && editedExpense.id === ""
                          ? "bg-red-500 hover:bg-red-700 text-white font-bold py-2 m-2 px-6 rounded-full"
                          : "bg-red-200  text-white font-bold py-2 m-2 px-6 rounded-full cursor-not-allowed"
                      }
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        !addExpense &&
                        expense.id &&
                        editedExpense.id === "" &&
                        handleStartEdit(expense.id)
                      }
                      className={
                        !addExpense && editedExpense.id === ""
                          ? "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 m-2 px-6 rounded-full "
                          : "bg-blue-200  text-white font-bold py-2 m-2 px-6 rounded-full cursor-not-allowed"
                      }
                    >
                      Edit
                    </button>
                  </td>
                ) : (
                  <td>
                    <button
                      onClick={() =>
                        expense.id &&
                        expense.date &&
                        handleEditExpense(expense.id, expense.date)
                      }
                      className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 m-2 px-6 rounded-full "
                    >
                      Confirm
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 m-2 px-6 rounded-full "
                    >
                      Cancel
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {editedExpense.id === "" && addExpense && (
              <AddExpense setAddExpense={setAddExpense} />
            )}
          </tbody>
        </table>
      </div>
      <div className="text-center">
        {!addExpense && (
          <button
            onClick={() => editedExpense.id === "" && setAddExpense(true)}
            className={
              editedExpense.id === ""
                ? "bg-green-700 hover:bg-green-900 text-white font-bold py-2 m-5 px-6 rounded-full "
                : "bg-green-300  text-white font-bold py-2 m-5 px-6 rounded-full cursor-not-allowed"
            }
          >
            Add expense
          </button>
        )}
      </div>
    </div>
  );
}
