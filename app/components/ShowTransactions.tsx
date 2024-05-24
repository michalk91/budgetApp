import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  deleteTransaction,
  updateTransaction,
  deleteAllTransactions,
} from "../redux/budgetsSlice";

import { useState } from "react";
import useFormatter from "../hooks/useFormatter";
import AddTransaction from "./AddTransaction";
import type { ShowTransactionsProps } from "../types";
import Table from "./Table";
import Button from "./Button";

export default function ShowTransactions({
  expensesSort,
  setExpensesSort,
}: ShowTransactionsProps) {
  const dispatch = useAppDispatch();
  const fetchTransactionsStatus = useAppSelector(
    (state) => state.budgets.fetchTransactionsStatus
  );
  const transactions = useAppSelector((state) => state.budgets.transactions);
  const expenseCategories = useAppSelector(
    (state) => state.budgets.expenseCategories
  );
  const incomeCategories = useAppSelector(
    (state) => state.budgets.incomeCategories
  );
  const currencyType = useAppSelector((state) => state.budgets.currencyType);
  const userID = useAppSelector((state) => state.user.userID);
  const allowToManageAllTransactions = useAppSelector(
    (state) => state.budgets.allowManageAllTransactions
  );
  const budgetOwnerID = useAppSelector((state) => state.budgets.ownerID);

  const [addNewExpense, setAddNewExpense] = useState(false);
  const [addNewIncome, setAddNewIncome] = useState(false);

  const [editedTransaction, setEditedTransaction] = useState({
    id: "",
    category: "",
    amount: "",
    type: "",
  });

  const { sortBy, sortDirection } = expensesSort;

  const formatter = useFormatter();

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
      <Table
        title="Expenses"
        headerCells={[
          { name: "date", sortBy: "timestamp" },
          { name: "category", sortBy: "category" },
          { name: "amount", sortBy: "amount" },
          { name: "owner", sortBy: "ownerUsername" },
          { name: "action" },
        ]}
        emptyTableCondition={
          transactions?.length === 0 && !addNewExpense && !addNewIncome
        }
        emptyTableTitle="You don't have any expenses yet"
        addNewRow={
          <>
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
          </>
        }
        setSort={setExpensesSort}
        sortDirection={sortDirection}
        sortBy={sortBy}
      >
        {fetchTransactionsStatus === "succeeded" &&
          transactions?.map((transaction) => (
            <tr
              key={transaction.id}
              className={
                editedTransaction.id === transaction.id
                  ? `bg-gray-100 border-b   ${
                      transaction.type === "expense"
                        ? ""
                        : " border-l-4 border-l-green-500"
                    } `
                  : `hover:bg-gray-100 bg-white border-b  ${
                      transaction.type === "expense"
                        ? ""
                        : "border-l-4 border-l-green-500"
                    } h-20 `
              }
            >
              <td
                data-cell="date"
                className="px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_'] max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-md:pb-0"
              >
                <div className="h-full w-1"></div>
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
                    className="px-2 py-1 rounded-full -ml-3 max-w-full max-lg:ml-1 bg-white border-2 "
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
                    className="px-2 -ml-[10px] py-1 rounded-full -ml-[8px] max-w-full max-lg: ml-1 max-lg:max-w-32 bg-white border-2 "
                  ></input>
                )}
              </td>

              <td
                data-cell="owner"
                className={`font-bold ${
                  transaction.ownerID === userID
                    ? "text-green-600"
                    : "text-blue-700"
                } px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_'] max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center`}
              >
                {transaction.ownerID === userID
                  ? "You"
                  : transaction.ownerUsername}
              </td>

              {editedTransaction.id !== transaction.id ? (
                <td className="max-lg:block max-lg:before:content-[attr(data-cell)]  max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-lg:pb-4">
                  <Button
                    handleClick={() => {
                      userID &&
                        !addNewExpense &&
                        !addNewIncome &&
                        transaction.id &&
                        transaction.type &&
                        editedTransaction.id === "" &&
                        (allowToManageAllTransactions.includes(userID) ||
                          transaction.ownerID === userID ||
                          userID === budgetOwnerID) &&
                        handleDeleteTransaction(
                          transaction.id,
                          transaction.type
                        );
                    }}
                    additionalStyles={
                      userID &&
                      !addNewExpense &&
                      !addNewIncome &&
                      editedTransaction.id === "" &&
                      (allowToManageAllTransactions?.includes(userID) ||
                        transaction.ownerID === userID ||
                        userID === budgetOwnerID)
                        ? "bg-red-500 hover:bg-red-700"
                        : "bg-red-200 hover:cursor-not-allowed"
                    }
                  >
                    Delete
                  </Button>
                  <Button
                    handleClick={() =>
                      userID &&
                      !addNewExpense &&
                      !addNewIncome &&
                      transaction.id &&
                      editedTransaction.id === "" &&
                      (allowToManageAllTransactions.includes(userID) ||
                        transaction.ownerID === userID ||
                        userID === budgetOwnerID) &&
                      handleStartEdit(transaction.id)
                    }
                    additionalStyles={
                      userID &&
                      !addNewExpense &&
                      !addNewIncome &&
                      editedTransaction.id === "" &&
                      (allowToManageAllTransactions?.includes(userID) ||
                        transaction.ownerID === userID ||
                        userID === budgetOwnerID)
                        ? "bg-blue-500 hover:bg-blue-700"
                        : "bg-blue-200 hover:cursor-not-allowed"
                    }
                  >
                    Edit
                  </Button>
                </td>
              ) : (
                <td className="max-lg:block max-lg:before:content-[attr(data-cell)]  max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-lg:pb-4">
                  <Button
                    handleClick={() => {
                      if (
                        transaction.id &&
                        transaction.date &&
                        transaction.type
                      ) {
                        handleEditTransaction(
                          transaction.id,
                          transaction.date,
                          transaction.type
                        );
                      }
                    }}
                    additionalStyles="bg-green-700 hover:bg-green-900"
                  >
                    Confirm
                  </Button>
                  <Button
                    handleClick={handleCancelEdit}
                    additionalStyles="bg-red-600 hover:bg-red-800"
                  >
                    Cancel
                  </Button>
                </td>
              )}
            </tr>
          ))}
      </Table>

      <div className="text-center mt-6">
        {!addNewExpense && !addNewIncome && (
          <>
            <Button
              handleClick={() =>
                editedTransaction.id === "" && setAddNewExpense(true)
              }
              additionalStyles={
                editedTransaction.id === ""
                  ? "bg-blue-600 hover:bg-blue-900"
                  : "bg-blue-300 hover:cursor-not-allowed"
              }
            >
              Add expense
            </Button>
            <Button
              handleClick={() =>
                editedTransaction.id === "" && setAddNewIncome(true)
              }
              additionalStyles={
                editedTransaction.id === ""
                  ? "bg-green-700 hover:bg-green-800"
                  : "bg-green-300 hover:cursor-not-allowed"
              }
            >
              Add Income
            </Button>

            {transactions?.length > 1 &&
              ((userID && allowToManageAllTransactions.includes(userID)) ||
                userID === budgetOwnerID) && (
                <Button
                  handleClick={() =>
                    userID &&
                    editedTransaction.id === "" &&
                    dispatch(deleteAllTransactions())
                  }
                  additionalStyles={
                    editedTransaction.id === ""
                      ? "bg-red-700 hover:bg-red-800"
                      : "bg-red-300 hover:cursor-not-allowed"
                  }
                >
                  Delete All
                </Button>
              )}
          </>
        )}
      </div>
    </div>
  );
}
