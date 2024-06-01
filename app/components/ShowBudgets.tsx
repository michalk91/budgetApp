import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchBudgets,
  deleteBudget,
  deleteAllBudgets,
  setSelectedBudgetID,
  leaveBudget,
} from "../redux/budgetsSlice";
import Table from "./Table";
import type { SortState } from "../types";
import { useEffect, useState } from "react";
import useFormatter from "../hooks/useFormatter";
import AddNewBudget from "./AddNewBudget";
import ShowSelectedBudget from "./ShowSelectedBudget";
import Button from "./Button";
import useSearch from "../hooks/useSearch";

export default function ShowBudgets() {
  const dispatch = useAppDispatch();
  const budgets = useAppSelector((state) => state.budgets.budgetsArray);
  const budgetID = useAppSelector((state) => state.budgets.budgetID);
  const userID = useAppSelector((state) => state.user.userID);
  const userName = useAppSelector((state) => state.user.username);

  const [addNewBudget, setAddNewBudget] = useState(false);

  const [budgetsSort, setBudgetsSort] = useState<SortState>({
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
  }, [dispatch, sortBy, sortDirection, budgetID, budgets.length, userID]);

  const handleDeleteBudget = (id: string) => {
    dispatch(deleteBudget(id));
  };

  const findByKeys = ["budgetName", "budgetValue", "ownerUsername", "amount"];

  const { handleSearch, filteredArray, searchKeywords, notFound } = useSearch({
    data: budgets,
    keys: findByKeys,
    exception: userName ? { keyword: "you", as: userName } : undefined,
  });

  return (
    <div className="flex flex-col items-center w-full mt-20">
      {budgetID === "" ? (
        <>
          <Table
            title="Budgets"
            headerCells={[
              { name: "date", sortBy: "timestamp" },
              { name: "name", sortBy: "budgetName" },
              { name: "amount", sortBy: "budgetValue" },
              { name: "owner", sortBy: "ownerUsername" },
              { name: "action" },
            ]}
            emptyTableCondition={budgets?.length === 0 && !addNewBudget}
            emptyTableTitle="You don't have any budgets yet"
            addNewRow={
              addNewBudget && <AddNewBudget setNewBudget={setAddNewBudget} />
            }
            setSort={setBudgetsSort}
            sortDirection={sortDirection}
            sortBy={sortBy}
            handleSearch={handleSearch}
            searchKeywords={searchKeywords}
            notFound={notFound}
          >
            {filteredArray?.map((budget) => (
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
                  className="font-bold px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_']  max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-md:pb-0"
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

                <td
                  data-cell="owner"
                  className={`font-bold ${
                    budget.ownerID === userID
                      ? "text-green-600"
                      : "text-blue-700"
                  } px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_'] max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center`}
                >
                  {budget.ownerID === userID ? "You" : budget.ownerUsername}
                </td>

                <td className="max-lg:block max-lg:before:content-[attr(data-cell)]  max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-lg:pb-4">
                  <Button
                    handleClick={() => {
                      !addNewBudget &&
                        dispatch(
                          setSelectedBudgetID({
                            budgetID: budget.budgetID,
                          })
                        );
                    }}
                    additionalStyles={
                      !addNewBudget
                        ? "bg-green-600 hover:bg-green-800"
                        : "bg-green-200 hover:cursor-not-allowed"
                    }
                  >
                    Show details
                  </Button>
                  {budget.ownerID === userID ? (
                    <Button
                      handleClick={() => {
                        !addNewBudget &&
                          budget.budgetID &&
                          budget.ownerID === userID &&
                          handleDeleteBudget(budget.budgetID);
                      }}
                      additionalStyles={
                        !addNewBudget
                          ? "bg-red-500 hover:bg-red-700"
                          : "bg-red-200 hover:cursor-not-allowed"
                      }
                    >
                      Delete
                    </Button>
                  ) : (
                    <Button
                      handleClick={() => {
                        !addNewBudget &&
                          budget.budgetID &&
                          budget.ownerID !== userID &&
                          dispatch(leaveBudget(budget.budgetID));
                      }}
                      additionalStyles={
                        !addNewBudget
                          ? "bg-blue-500 hover:bg-blue-700"
                          : "bg-blue-200 hover:cursor-not-allowed"
                      }
                    >
                      Leave
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </Table>

          <div className="text-center mt-6">
            {!addNewBudget && (
              <>
                <Button
                  handleClick={() => setAddNewBudget(true)}
                  additionalStyles="bg-blue-700 hover:bg-blue-900"
                >
                  Add new budget
                </Button>

                {budgets?.length > 1 && (
                  <Button
                    handleClick={() => {
                      dispatch(deleteAllBudgets());
                    }}
                    additionalStyles="bg-red-700 hover:bg-red-900"
                  >
                    Delete All
                  </Button>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <Button
            handleClick={() => {
              dispatch(setSelectedBudgetID({ budgetID: "" }));
            }}
            additionalStyles="bg-red-500 hover:hover:bg-red-700"
          >
            Back to budgets
          </Button>

          <ShowSelectedBudget />
        </>
      )}
    </div>
  );
}
