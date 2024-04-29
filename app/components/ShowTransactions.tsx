import { useAppDispatch } from "../redux/hooks";
import {
  deleteTransaction,
  fetchTransactions,
  updateTransaction,
  deleteAllTransactions,
} from "../redux/transactionsSlice";

import { useEffect, useState } from "react";
import useFormatter from "../hooks/useFormatter";
import AddTransaction from "./AddTransaction";
import type { ShowTransactionsProps } from "../types";

export default function ShowTransactions({
  transactions,
  currencyType,
  expenseCategories,
  incomeCategories,
}: ShowTransactionsProps) {
  const dispatch = useAppDispatch();

  const [addNewExpense, setAddNewExpense] = useState(false);
  const [addNewIncome, setAddNewIncome] = useState(false);

  const [editedTransaction, setEditedTransaction] = useState({
    id: "",
    category: "",
    amount: "",
    type: "",
  });

  const [expensesSort, setExpensesSort] = useState({
    sortBy: "timestamp",
    sortDirection: "ascending",
  });

  const { sortBy, sortDirection } = expensesSort;

  const formatter = useFormatter();

  useEffect(() => {
    if (sortDirection === "ascending")
      dispatch(fetchTransactions({ sortBy, descending: false }));
    else if (sortDirection === "descending")
      dispatch(fetchTransactions({ sortBy, descending: true }));
  }, [dispatch, editedTransaction.id, sortBy, sortDirection]);

  const handleDeleteTransaction = (id: string, type: "expense" | "income") => {
    dispatch(deleteTransaction({ id, type }));
  };

  const handleStartEdit = (id: string) => {
    setEditedTransaction((state) => ({ ...state, id }));
  };
  const handleCancelEdit = () => {
    setEditedTransaction((state) => ({ ...state, id: "" }));
  };

  const handleEditTransaction = (
    id: string,
    date: string,
    type: "income" | "expense"
  ) => {
    const { category, amount } = editedTransaction;
    const transaction = { id, date, category, amount: Number(amount), type };

    dispatch(updateTransaction(transaction));

    setEditedTransaction((state) => ({
      ...state,
      id: "",
      category: "",
      amount: "",
      type: "",
    }));
  };

  return (
    <div className="w-full mt-10">
      <span className="ml-2 font-bold text-xl mx-auto max-md:text-lg">
        Expenses and incomes
      </span>

      <div className="relative overflow-x-auto border-2 border-slate-300 rounded-lg max-md:mb-6 shadow-xl">
        <table className="table-fixed w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
          <thead className="text-xs text-gray-700 uppercase  dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 max-lg:hidden">
                Date
              </th>
              <th scope="col" className="px-6 py-3 max-lg:hidden">
                Category
              </th>
              <th scope="col" className="px-6 py-3 max-lg:hidden">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 max-lg:hidden">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions?.length === 0 && !addNewExpense && !addNewIncome && (
              <tr
                className={
                  "bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700"
                }
              >
                <td
                  align="center"
                  colSpan={4}
                  className="px-6 py-6 max-lg:block bg-white"
                >
                  <span className="ml-2 font-bold text-xl mx-auto">
                    {`You don't have any transactions yet`}
                  </span>
                </td>
              </tr>
            )}

            {transactions?.map((transaction) => (
              <tr
                key={transaction.id}
                className={
                  editedTransaction.id === transaction.id
                    ? `bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700  ${
                        transaction.type === "expense"
                          ? ""
                          : "border-l-4 border-l-green-500"
                      } `
                    : `hover:bg-gray-100 bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${
                        transaction.type === "expense"
                          ? ""
                          : "border-l-4 border-l-green-500"
                      } `
                }
              >
                <td
                  data-cell="date"
                  className="px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_'] max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-md:pb-0"
                >
                  <p>created: {transaction.date}</p>
                  {transaction.editDate && (
                    <p>modified: {transaction.editDate}</p>
                  )}
                </td>

                <td
                  data-cell="category"
                  className="px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_']  max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-md:pb-0"
                >
                  {editedTransaction.id !== transaction.id ? (
                    transaction.category
                  ) : (
                    <select
                      onChange={(e) =>
                        setEditedTransaction((state) => ({
                          ...state,
                          category: e.target.value,
                        }))
                      }
                      className="px-2 py-1 rounded-full -ml-3 max-w-full max-lg:ml-1"
                      defaultValue={transaction.category}
                      name="choice"
                    >
                      {transaction.type === "expense"
                        ? expenseCategories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))
                        : incomeCategories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                    </select>
                  )}
                </td>

                <td
                  data-cell="amount"
                  className={`${
                    transaction.type === "expense"
                      ? "text-red-600"
                      : "text-green-600"
                  } px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_']    max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center`}
                >
                  {editedTransaction.id !== transaction.id ? (
                    `${transaction.type === "expense" ? "-" : "+"} ${formatter(
                      transaction.amount,
                      currencyType
                    )}`
                  ) : (
                    <input
                      type="number"
                      onChange={(e) =>
                        setEditedTransaction((state) => ({
                          ...state,
                          amount: e.target.value,
                        }))
                      }
                      defaultValue={transaction.amount}
                      className="px-2 py-1 rounded-full -ml-2 max-w-full max-lg: ml-1 max-lg:max-w-32"
                    ></input>
                  )}
                </td>

                {editedTransaction.id !== transaction.id ? (
                  <td className="max-lg:block max-lg:before:content-[attr(data-cell)]  max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-lg:pb-4">
                    <button
                      onClick={() => {
                        !addNewExpense &&
                          !addNewIncome &&
                          transaction.id &&
                          transaction.type &&
                          editedTransaction.id === "" &&
                          handleDeleteTransaction(
                            transaction.id,
                            transaction.type
                          );
                      }}
                      className={`${
                        !addNewExpense &&
                        !addNewIncome &&
                        editedTransaction.id === ""
                          ? "bg-red-500 hover:bg-red-700"
                          : "bg-red-200 cursor-not-allowed"
                      } text-white font-bold py-2 m-2 px-6 rounded-full `}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        !addNewExpense &&
                        !addNewIncome &&
                        transaction.id &&
                        editedTransaction.id === "" &&
                        handleStartEdit(transaction.id)
                      }
                      className={`${
                        !addNewExpense &&
                        !addNewIncome &&
                        editedTransaction.id === ""
                          ? "bg-blue-500 hover:bg-blue-700"
                          : "bg-blue-200 cursor-not-allowed"
                      } text-white font-bold py-2 m-2 px-6 rounded-full `}
                    >
                      Edit
                    </button>
                  </td>
                ) : (
                  <td className="max-lg:block max-lg:before:content-[attr(data-cell)]  max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-lg:pb-4">
                    <button
                      onClick={() =>
                        transaction.id &&
                        transaction.date &&
                        transaction.type &&
                        handleEditTransaction(
                          transaction.id,
                          transaction.date,
                          transaction.type
                        )
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

            {editedTransaction.id === "" && addNewExpense && (
              <AddTransaction
                setAdd={setAddNewExpense}
                categories={expenseCategories}
                type="expense"
              />
            )}

            {editedTransaction.id === "" && addNewIncome && (
              <AddTransaction
                setAdd={setAddNewIncome}
                categories={incomeCategories}
                type="income"
              />
            )}
          </tbody>
        </table>

        <div className="flex flex-wrap items-center ml-6 max-md:m-2">
          <p>Sort: </p>
          <select
            className="px-1 m-2 rounded-full bg-white "
            onChange={(e) => {
              setExpensesSort((state) => ({
                ...state,
                sortBy: e.target.value,
              }));
            }}
            value={sortBy}
            name="choice"
          >
            <option value="timestamp">time</option>
            <option value="amount">amount</option>
          </select>
          <select
            className="px-1 rounded-full max-w-full bg-white"
            onChange={(e) => {
              setExpensesSort((state) => ({
                ...state,
                sortDirection: e.target.value,
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
      <div className="text-center mt-6">
        {!addNewExpense && !addNewIncome && (
          <>
            <button
              type="submit"
              onClick={() =>
                editedTransaction.id === "" && setAddNewExpense(true)
              }
              className={`${
                editedTransaction.id === ""
                  ? "bg-blue-800 hover:bg-blue-900"
                  : "bg-blue-300 cursor-not-allowed"
              } text-white font-bold py-2 my-2 mx-2 px-6 rounded-full max-md:px-6 max-md:py-4`}
            >
              Add expense
            </button>
            <button
              type="submit"
              onClick={() =>
                editedTransaction.id === "" && setAddNewIncome(true)
              }
              className={`${
                editedTransaction.id === ""
                  ? "bg-green-700 hover:bg-green-800"
                  : "bg-green-300 cursor-not-allowed"
              } text-white font-bold py-2 my-2 mx-2 px-6 rounded-full max-md:px-6 max-md:py-4`}
            >
              Add Income
            </button>

            {transactions?.length > 1 && (
              <button
                onClick={() =>
                  editedTransaction.id === "" &&
                  dispatch(deleteAllTransactions())
                }
                className={`${
                  editedTransaction.id === ""
                    ? "bg-red-700 hover:bg-red-800"
                    : "bg-red-300 cursor-not-allowed"
                } text-white font-bold py-2 my-2 mx-2 px-6 rounded-full max-md:px-6 max-md:py-4`}
              >
                Delete All
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
