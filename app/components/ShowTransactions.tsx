import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  deleteTransaction,
  updateTransaction,
  deleteAllTransactions,
  resetAddedElemID,
  resetDeleteAllTransactionsStatus,
} from "../redux/budgetsSlice";
import { useEffect, useState, useCallback } from "react";
import useFormatter from "../hooks/useFormatter";
import AddTransaction from "./AddTransaction";
import Table from "./Table";
import Button from "./Button";
import type { ShowTransactionsProps, DeleteRowData } from "../types";
import useSearch from "../hooks/useSearch";
import usePagination from "../hooks/usePagination";
import { useIDfromPathname } from "../hooks/useIDfromPathname";
import Loader from "./Loader";
import { toast } from "react-toastify";

export default function ShowTransactions({
  expensesSort,
  setExpensesSort,
}: ShowTransactionsProps) {
  const dispatch = useAppDispatch();

  const budgetID = useIDfromPathname();

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
  const userName = useAppSelector((state) => state.user.username);
  const budgetOwnerID = useAppSelector((state) => state.budgets.ownerID);
  const addedElemID = useAppSelector((state) => state.budgets.addedElemID);
  const deleteAllTransactionsStatus = useAppSelector(
    (state) => state.budgets.deleteAllTransactionsStatus
  );

  const [addNewExpense, setAddNewExpense] = useState(false);
  const [addNewIncome, setAddNewIncome] = useState(false);

  const [editedTransaction, setEditedTransaction] = useState({
    id: "",
    category: "",
    amount: "",
    type: "",
    comment: "",
  });

  const [deleteRowData, setDeleteRowData] = useState<DeleteRowData>({
    deleteRowID: "",
    deleteRowType: "expense",
  });

  const { sortBy, sortDirection } = expensesSort;

  const { deleteRowID, deleteRowType } = deleteRowData;

  const formatter = useFormatter();

  const handleDeleteTransaction = (id: string, type: "expense" | "income") => {
    dispatch(
      deleteTransaction({ budgetID, transactionToDelete: { id, type } })
    );
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
    const { category, amount, comment } = editedTransaction;
    const transaction = {
      id,
      date,
      category,
      amount: Number(amount),
      type,
      comment,
    };

    dispatch(updateTransaction({ budgetID, editedTransaction: transaction }));

    setEditedTransaction((state) => ({
      ...state,
      id: "",
      category: "",
      amount: "",
      type: "",
    }));
  };

  const findByKeys = [
    "category",
    "date",
    "editDate",
    "ownerUsername",
    "amount",
    "comment",
  ];

  const { handleSearch, filteredArray, searchKeywords, notFound } = useSearch({
    data: transactions,
    keys: findByKeys,
    exception: userName
      ? { keyword: "you", as: userName, inKey: "ownerUsername" }
      : undefined,
  });

  const {
    paginatedData,
    setRowsPerPage,
    currentPage,
    rowsPerPage,
    setCurrentPage,
  } = usePagination(filteredArray);

  useEffect(() => {
    dispatch(resetAddedElemID());
  }, [dispatch, sortBy, sortDirection, currentPage]);

  const notifyDeleteAllTransactions = useCallback(
    () => toast.success("All transactions have been successfully deleted"),
    []
  );

  useEffect(() => {
    if (deleteAllTransactionsStatus === "succeeded") {
      notifyDeleteAllTransactions();
      dispatch(resetDeleteAllTransactionsStatus());
    }
  }, [deleteAllTransactionsStatus, notifyDeleteAllTransactions, dispatch]);

  return (
    <div className="w-full mt-10">
      <Table
        title="Expenses"
        responsiveBreakpoint="max-xl"
        headerCells={[
          { name: "date", sortBy: "timestamp" },
          { name: "category", sortBy: "category" },
          { name: "amount", sortBy: "amount" },
          { name: "owner", sortBy: "ownerUsername" },
          { name: "comment", sortBy: "comment" },
          { name: "" },
          { name: "action" },
        ]}
        startSortAnimation={filteredArray}
        setRowsPerPage={setRowsPerPage}
        dataLength={filteredArray.length}
        addedElemID={addedElemID}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        handleDeleteRow={handleDeleteTransaction}
        handleDeleteRowSecondArg={deleteRowType}
        handleDeleteRowID={deleteRowID}
        emptyTableCondition={
          transactions?.length === 0 && !addNewExpense && !addNewIncome
        }
        emptyTableTitle="You don't have any expenses yet"
        addNewRow={
          <>
            {editedTransaction.id === "" && addNewExpense && (
              <AddTransaction
                budgetID={budgetID}
                setAdd={setAddNewExpense}
                categories={expenseCategories}
                type="expense"
              />
            )}

            {editedTransaction.id === "" && addNewIncome && (
              <AddTransaction
                budgetID={budgetID}
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
        handleSearch={handleSearch}
        searchKeywords={searchKeywords}
        notFound={notFound}
      >
        {paginatedData.length > 0 &&
          paginatedData?.map((transaction) => (
            <tr
              key={transaction.id}
              data-id={transaction.id}
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
                className="px-6 py-6 max-xl:block max-xl:before:content-[attr(data-cell)':_'] max-xl:before:font-bold max-xl:before:uppercase max-xl:text-center max-md:pb-0"
              >
                <div className="h-full w-1"></div>
                <p>created: {transaction.date}</p>
                {transaction.editDate && (
                  <p>modified: {transaction.editDate}</p>
                )}
              </td>

              <td
                data-cell="category"
                className="px-6 py-6 max-xl:block max-xl:before:content-[attr(data-cell)':_']  max-xl:before:font-bold max-xl:before:uppercase max-xl:text-center max-md:pb-0"
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
                    className="px-2 py-1 rounded-full -ml-3 max-w-full max-xl:ml-1 bg-white border-2 "
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
                } px-6 py-6 max-xl:block max-xl:before:content-[attr(data-cell)':_'] max-xl:before:font-bold max-xl:before:uppercase max-xl:text-center`}
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
                    className="px-2 -ml-[10px] py-1 rounded-full -ml-[11px] max-w-40 max-xl:ml-1 max-md:max-w-32 bg-white border-2 "
                  ></input>
                )}
              </td>

              <td
                data-cell="owner"
                className={`font-bold ${
                  transaction.ownerID === userID
                    ? "text-green-600"
                    : "text-blue-700"
                } px-6 py-4 max-xl:block max-xl:before:content-[attr(data-cell)':_'] max-xl:before:font-bold max-xl:before:uppercase max-xl:text-center`}
              >
                {transaction.ownerID === userID
                  ? "You"
                  : transaction.ownerUsername}
              </td>

              <td
                colSpan={2}
                data-cell="comment"
                className="px-6 py-6 max-xl:px-48 max-lg:px-24 max-md:px-8 max-xl:block max-xl:before:content-[attr(data-cell)':_']  max-xl:before:font-bold max-xl:before:uppercase max-xl:text-center max-md:pb-0"
              >
                {editedTransaction.id !== transaction.id ? (
                  transaction.comment && transaction.comment !== "" ? (
                    transaction.comment
                  ) : (
                    "-"
                  )
                ) : (
                  <>
                    <textarea
                      onChange={(e) =>
                        setEditedTransaction((state) => ({
                          ...state,
                          comment: e.target.value,
                        }))
                      }
                      defaultValue={transaction.comment}
                      className="p-2 w-5/6 rounded-lg border-2 -ml-2 max-xl:w-full border-2"
                      name="comment"
                      id="comment"
                    ></textarea>
                  </>
                )}
              </td>

              {editedTransaction.id !== transaction.id ? (
                <td className="max-xl:block max-xl:mt-4  max-xl:before:content-[attr(data-cell)]  max-xl:before:font-bold max-xl:before:uppercase max-xl:text-center max-xl:pb-4">
                  <Button
                    handleClick={() => {
                      if (
                        userID &&
                        !addNewExpense &&
                        !addNewIncome &&
                        transaction.id &&
                        transaction.type &&
                        editedTransaction.id === "" &&
                        (allowToManageAllTransactions?.includes(userID) ||
                          transaction.ownerID === userID ||
                          userID === budgetOwnerID)
                      ) {
                        setDeleteRowData((state) => ({
                          ...state,
                          deleteRowID: transaction.id,
                          deleteRowType: transaction.type,
                        }));
                      }
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
                      (allowToManageAllTransactions?.includes(userID) ||
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
                <td className="max-xl:block max-xl:before:content-[attr(data-cell)] max-xl:mt-4  max-xl:before:font-bold max-xl:before:uppercase max-xl:text-center max-xl:pb-4">
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

      <div className="flex justify-center text-center mt-6">
        {!addNewExpense && !addNewIncome && (
          <>
            <Button
              handleClick={() => {
                if (editedTransaction.id === "") {
                  setAddNewExpense(true);
                }
              }}
              additionalStyles={
                editedTransaction.id === ""
                  ? "bg-blue-600 hover:bg-blue-900"
                  : "bg-blue-300 hover:cursor-not-allowed"
              }
            >
              Add expense
            </Button>
            <Button
              handleClick={() => {
                if (editedTransaction.id === "") {
                  setAddNewIncome(true);
                }
              }}
              additionalStyles={
                editedTransaction.id === ""
                  ? "bg-green-700 hover:bg-green-800"
                  : "bg-green-300 hover:cursor-not-allowed"
              }
            >
              Add Income
            </Button>

            {transactions?.length > 1 &&
              ((userID && allowToManageAllTransactions?.includes(userID)) ||
                userID === budgetOwnerID) &&
              (deleteAllTransactionsStatus === "loading" ? (
                <Button additionalStyles="bg-red-700 w-36">
                  <Loader />
                </Button>
              ) : (
                <Button
                  handleClick={() => {
                    userID &&
                      editedTransaction.id === "" &&
                      dispatch(deleteAllTransactions(budgetID));
                  }}
                  additionalStyles={`w-36
                    ${
                      editedTransaction.id === ""
                        ? "bg-red-700 hover:bg-red-800"
                        : "bg-red-300 hover:cursor-not-allowed"
                    }`}
                >
                  Delete All
                </Button>
              ))}
          </>
        )}
      </div>
    </div>
  );
}
