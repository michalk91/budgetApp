import { useAppDispatch, useAppSelector } from "../redux/hooks";

import {
  fetchBudgets,
  deleteBudget,
  deleteAllBudgets,
  setSelectedBudgetID,
} from "../redux/budgetsSlice";

import { useEffect, useState } from "react";
import useFormatter from "../hooks/useFormatter";
import AddNewBudget from "./AddNewBudget";
import ShowSelectedBudget from "./ShowSelectedBudget";

export default function ShowBudgets() {
  const dispatch = useAppDispatch();
  const budgets = useAppSelector((state) => state.budgets.budgetsArray);
  const budgetID = useAppSelector((state) => state.budgets.budgetID);

  const [addNewBudget, setAddNewBudget] = useState(false);

  const [budgetsSort, setBudgetsSort] = useState({
    sortBy: "timestamp",
    sortDirection: "ascending",
  });

  const { sortBy, sortDirection } = budgetsSort;

  const formatter = useFormatter();

  useEffect(() => {
    if (sortDirection === "ascending")
      dispatch(fetchBudgets({ sortBy, descending: false }));
    else if (sortDirection === "descending")
      dispatch(fetchBudgets({ sortBy, descending: true }));
  }, [dispatch, sortBy, sortDirection, budgetID, budgets.length]);

  const handleDeleteBudget = (id: string) => {
    dispatch(deleteBudget(id));
  };

  return (
    <div className="flex flex-col items-center w-full mt-24">
      {budgetID === "" ? (
        <>
          <span className="ml-2 font-bold text-xl mx-auto max-md:text-lg">
            Budgets
          </span>
          <div className="relative overflow-x-auto border-2 border-slate-300 rounded-lg max-md:mb-6 shadow-xl">
            <table className="table-fixed w-full text-sm text-left text-gray-500  ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-3 max-lg:hidden">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 max-lg:hidden">
                    Name
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
                {budgets?.length === 0 && !addNewBudget && (
                  <tr className={"bg-gray-100 border-b "}>
                    <td
                      align="center"
                      colSpan={4}
                      className="px-6 py-6 max-lg:block bg-white"
                    >
                      <span className="ml-2 font-bold text-xl mx-auto">
                        {`You don't have any budgets yet`}
                      </span>
                    </td>
                  </tr>
                )}

                {budgets?.map((budget) => (
                  <tr
                    key={budget.budgetID}
                    className={`hover:bg-gray-100 bg-white border-b `}
                  >
                    <td
                      data-cell="date"
                      className="px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_'] max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-md:pb-0"
                    >
                      <p>created: {budget.addDate}</p>
                    </td>

                    <td
                      data-cell="Name"
                      className="px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_']  max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-md:pb-0"
                    >
                      {budget.budgetName}
                    </td>

                    <td
                      data-cell="amount"
                      className={`${
                        (budget.budgetValue as number) < 0
                          ? "text-red-600"
                          : "text-black"
                      } text-black px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_'] max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center`}
                    >
                      {formatter(
                        budget.budgetValue as number,
                        budget.currencyType as string
                      )}
                    </td>

                    <td className="max-lg:block max-lg:before:content-[attr(data-cell)]  max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-lg:pb-4">
                      <button
                        onClick={() => {
                          dispatch(
                            setSelectedBudgetID({
                              budgetID: budget.budgetID,
                            })
                          );
                        }}
                        className={`${
                          !addNewBudget
                            ? "bg-green-600 hover:bg-green-800"
                            : "bg-green-200 cursor-not-allowed"
                        } text-white font-bold py-2 m-2 px-6 rounded-full `}
                      >
                        Show details
                      </button>
                      <button
                        onClick={() => {
                          !addNewBudget &&
                            budget.id &&
                            handleDeleteBudget(budget.budgetID);
                        }}
                        className={`${
                          !addNewBudget
                            ? "bg-red-500 hover:bg-red-700"
                            : "bg-red-200 cursor-not-allowed"
                        } text-white font-bold py-2 m-2 px-6 rounded-full `}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {addNewBudget && (
                  <AddNewBudget setNewBudget={setAddNewBudget} />
                )}
              </tbody>
            </table>

            <div className="flex flex-wrap items-center  max-md:p-2 bg-gray-200">
              <p className="ml-6">Sort: </p>
              <select
                className="px-1 m-2 rounded-full bg-white "
                onChange={(e) => {
                  setBudgetsSort((state) => ({
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
                className="px-1 rounded-full max-w-full bg-white "
                onChange={(e) => {
                  setBudgetsSort((state) => ({
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
            {!addNewBudget && (
              <>
                <button
                  type="submit"
                  onClick={() => setAddNewBudget(true)}
                  className={`

                   bg-blue-800 hover:bg-blue-900

               text-white font-bold py-2 my-2 mx-2 px-6 rounded-full max-md:px-6 max-md:py-4`}
                >
                  Add new budget
                </button>

                {budgets?.length > 1 && (
                  <button
                    onClick={() => {
                      dispatch(deleteAllBudgets());
                    }}
                    className={`

                    bg-red-700 hover:bg-red-800

                 text-white font-bold py-2 my-2 mx-2 px-6 rounded-full max-md:px-6 max-md:py-4`}
                  >
                    Delete All
                  </button>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              dispatch(setSelectedBudgetID({ budgetID: "" }));
            }}
            className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 mb-12 px-6 rounded-full max-md:px-6 max-md:py-4`}
          >
            Back to budgets
          </button>
          <ShowSelectedBudget />
        </>
      )}
    </div>
  );
}
