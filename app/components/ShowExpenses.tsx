import { useAppSelector, useAppDispatch } from "../redux/hooks";
import {
  deleteExpense,
  fetchExpenses,
  updateExpense,
  deleteAllExpenses,
} from "../redux/usersSlice";

import { useEffect, useState, SyntheticEvent } from "react";
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

  const [expensesSort, setExpensesSort] = useState({
    sortBy: "timestamp",
    sortDirection: "ascending",
  });

  const { sortBy, sortDirection } = expensesSort;

  const formatter = useFormatter();

  useEffect(() => {
    if (sortDirection === "ascending")
      dispatch(fetchExpenses({ sortBy, descending: false }));
    else if (sortDirection === "descending")
      dispatch(fetchExpenses({ sortBy, descending: true }));
  }, [dispatch, editedExpense.id, sortBy, sortDirection]);

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
            {expenses?.length === 0 && !addExpense && (
              <tr
                className={
                  "bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700"
                }
              >
                <td align="center" colSpan={4} className="px-6 py-6">
                  <span className="ml-2 font-bold text-xl mx-auto">
                    {`You don't have expenses yet`}
                  </span>
                </td>
              </tr>
            )}

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
                      className="px-2 py-1 rounded-full -ml-3"
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
                      className="px-2 py-1 rounded-full -ml-2"
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
                      className={`${
                        !addExpense && editedExpense.id === ""
                          ? "bg-red-500 hover:bg-red-700"
                          : "bg-red-200 cursor-not-allowed"
                      } text-white font-bold py-2 m-2 px-6 rounded-full `}
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
                      className={`${
                        !addExpense && editedExpense.id === ""
                          ? "bg-blue-500 hover:bg-blue-700"
                          : "bg-blue-200 cursor-not-allowed"
                      } text-white font-bold py-2 m-2 px-6 rounded-full `}
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

        <div className="flex items-center ml-6">
          <p>Sort: </p>
          <select
            className="px-1 m-2 rounded-full "
            onChange={(e: SyntheticEvent) => {
              setExpensesSort((state) => ({
                ...state,
                sortBy: (e.target as HTMLInputElement).value,
              }));
            }}
            value={sortBy}
            name="choice"
          >
            <option value="timestamp">time</option>
            <option value="amount">amount</option>
          </select>
          <select
            className="px-1  rounded-full "
            onChange={(e: SyntheticEvent) => {
              setExpensesSort((state) => ({
                ...state,
                sortDirection: (e.target as HTMLInputElement).value,
              }));
            }}
            value={sortDirection}
            name="choice"
          >
            <option value="ascending">ascending</option>
            <option value="descending">descending</option>
          </select>
        </div>
      </div>
      <div className="text-center">
        {!addExpense && (
          <>
            <button
              type="submit"
              onClick={() => editedExpense.id === "" && setAddExpense(true)}
              className={`${
                editedExpense.id === ""
                  ? "bg-green-700 hover:bg-green-800"
                  : "bg-green-300 cursor-not-allowed"
              } text-white font-bold py-2 my-5 mx-2 px-6 rounded-full`}
            >
              Add expense
            </button>

            {expenses?.length > 1 && (
              <button
                onClick={() =>
                  editedExpense.id === "" && dispatch(deleteAllExpenses())
                }
                className={`${
                  editedExpense.id === ""
                    ? "bg-red-700 hover:bg-red-800"
                    : "bg-red-300 cursor-not-allowed"
                } text-white font-bold py-2 my-5 mx-2 px-6 rounded-full`}
              >
                Delete All Expenses
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
