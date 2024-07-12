import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchBudgets,
  deleteBudget,
  deleteAllBudgets,
  leaveBudget,
  setRowsPerPage as setGloalRowsNumber,
  setCurrentPage as setGlobalCurrent,
  setSortOptions,
  setSearchKeywords,
  resetAddedElemID,
} from "../redux/budgetsSlice";
import Table from "./Table";
import type { SortOptions, DeleteRowData } from "../types";
import { useCallback, useEffect, useState } from "react";
import useFormatter from "../hooks/useFormatter";
import AddNewBudget from "./AddNewBudget";
import Button from "./Button";
import useSearch from "../hooks/useSearch";
import usePagination from "../hooks/usePagination";
import Link from "next/link";
import { setFirstElemPos } from "../redux/transitionSlice";
import { usePosition } from "../hooks/usePosition";
import useTransition from "../hooks/useTransition";
import {
  setActiveElemIndex,
  setAllowTransition,
} from "../redux/transitionSlice";
import ArrowsLoader from "./ArrowsLoader";
import { usePathname } from "next/navigation";

export default function ShowBudgets() {
  const dispatch = useAppDispatch();
  const budgets = useAppSelector((state) => state.budgets.budgetsArray);
  const userID = useAppSelector((state) => state.user.userID);
  const userName = useAppSelector((state) => state.user.username);
  const secondElemPos = useAppSelector(
    (state) => state.transition.secondElemPos
  );
  const activeIndex = useAppSelector(
    (state) => state.transition.activeElemIndex
  );
  const allowTransition = useAppSelector(
    (state) => state.transition.allowTransition
  );
  const fetchBudgetsStatus = useAppSelector(
    (state) => state.budgets.fetchBudgetsStatus
  );
  const globalRowsPerPage = useAppSelector(
    (state) => state.budgets.rowsPerPage
  );
  const globalCurrentPage = useAppSelector(
    (state) => state.budgets.currentPage
  );
  const globalBudgetSortBy = useAppSelector((state) => state.budgets.sortBy);
  const globalBudgetSortDirection = useAppSelector(
    (state) => state.budgets.sortDirection
  );

  const globalSearchKeywords = useAppSelector(
    (state) => state.budgets.searchKeywords
  );

  const addedElemID = useAppSelector((state) => state.budgets.addedElemID);

  const [addNewBudget, setAddNewBudget] = useState(false);
  const [budgetLoaded, setBudgetLoaded] = useState(false);

  const [deleteRowData, setDeleteRowData] = useState<DeleteRowData>({
    deleteRowID: "",
    deleteRowInteractionType: "delete",
  });

  const setGlobalSortOptions = useCallback(
    ({ sortBy, sortDirection }: SortOptions) => {
      dispatch(setSortOptions({ sortBy, sortDirection }));
    },
    [dispatch]
  );

  const formatter = useFormatter();

  const pathname = usePathname();

  useEffect(() => {
    dispatch(
      fetchBudgets({
        sortBy: globalBudgetSortBy,
        sortDirection: globalBudgetSortDirection,
      })
    );
  }, [dispatch, globalBudgetSortBy, globalBudgetSortDirection]);

  const handleDeleteBudget = (id: string) => {
    dispatch(deleteBudget(id));
  };

  const handleLeaveBudget = (id: string) => {
    dispatch(leaveBudget(id));
  };

  const onTransitionEnd = useCallback(() => {
    dispatch(setAllowTransition(false));
  }, [dispatch]);

  const findByKeys = [
    "addDate",
    "budgetName",
    "budgetValue",
    "ownerUsername",
    "amount",
  ];

  const { globalFilteredArray, notFoundGlobal } = useSearch({
    data: budgets,
    keys: findByKeys,
    globalSearchKeywords,
    exception: userName
      ? { keyword: "you", as: userName, inKey: "ownerUsername" }
      : undefined,
  });

  const { paginatedData } = usePagination(
    globalFilteredArray,
    globalRowsPerPage,
    globalCurrentPage
  );

  const animateElemCallback = useTransition({
    animateToElemPos: secondElemPos,
    allowTransition,
    onTransitionEnd,
    onlyYAxis: true,
  });

  const getElemPosition = usePosition();

  const setGlobalRowsPerPage = useCallback(
    (numberOfRows: number) => {
      dispatch(setGloalRowsNumber(numberOfRows));
    },
    [dispatch]
  );

  const setGlobalCurrentPage = useCallback(
    (currentPage: number) => {
      dispatch(setGlobalCurrent(currentPage));
    },
    [dispatch]
  );

  const setGlobalSearchKeywords = useCallback(
    (keywords: string) => {
      dispatch(setSearchKeywords(keywords));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(resetAddedElemID());
  }, [
    dispatch,
    globalBudgetSortBy,
    globalBudgetSortDirection,
    globalCurrentPage,
  ]);

  useEffect(() => {
    fetchBudgetsStatus === "succeeded" && setBudgetLoaded(true);
  }, [fetchBudgetsStatus]);

  useEffect(() => {
    setBudgetLoaded(false);
  }, [pathname]);

  return (
    <div className="flex flex-col items-center w-full mt-10 max-md:mt-4">
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
          setGlobalRowsPerPage={setGlobalRowsPerPage}
          dataLength={globalFilteredArray.length}
          currentPage={globalCurrentPage}
          setGlobalCurrentPage={setGlobalCurrentPage}
          rowsPerPage={globalRowsPerPage}
          handleDeleteRow={
            deleteRowData.deleteRowInteractionType === "delete"
              ? handleDeleteBudget
              : handleLeaveBudget
          }
          handleDeleteRowID={deleteRowData.deleteRowID}
          startSortAnimation={globalFilteredArray}
          addedElemID={addedElemID}
          emptyTableCondition={
            fetchBudgetsStatus === "succeeded" &&
            budgets?.length === 0 &&
            !addNewBudget
          }
          emptyTableTitle="You don't have any budgets yet"
          addNewRow={
            addNewBudget && <AddNewBudget setNewBudget={setAddNewBudget} />
          }
          setSortGlobal={setGlobalSortOptions}
          sortDirection={globalBudgetSortDirection}
          sortBy={globalBudgetSortBy}
          handleSearchGlobal={setGlobalSearchKeywords}
          searchKeywords={globalSearchKeywords}
          notFound={notFoundGlobal}
        >
          {paginatedData?.map(
            (budget, index) =>
              (fetchBudgetsStatus === "succeeded" || budgetLoaded) && (
                <tr
                  key={budget.budgetID}
                  data-id={budget.budgetID}
                  className={`hover:bg-gray-100 bg-white border-b `}
                  ref={(node) => {
                    index === activeIndex ? animateElemCallback(node) : null;
                  }}
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
                    <Link href={`/budgets/${budget.budgetID}`}>
                      <Button
                        handleClick={(e) => {
                          dispatch(setActiveElemIndex(index));

                          const position = getElemPosition(
                            e.target as HTMLElement
                          );
                          dispatch(setFirstElemPos(position));
                        }}
                        additionalStyles={
                          !addNewBudget
                            ? "bg-green-600 hover:bg-green-800"
                            : "bg-green-200 hover:cursor-not-allowed"
                        }
                      >
                        Show details
                      </Button>
                    </Link>
                    {budget.ownerID === userID ? (
                      <Button
                        handleClick={() => {
                          if (
                            !addNewBudget &&
                            budget.budgetID &&
                            budget.ownerID === userID
                          ) {
                            setDeleteRowData((state) => ({
                              ...state,
                              deleteRowID: budget.budgetID,
                              deleteRowIteractionType: "delete",
                            }));
                          }
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
                          if (
                            !addNewBudget &&
                            budget.budgetID &&
                            budget.ownerID !== userID
                          ) {
                            setDeleteRowData((state) => ({
                              ...state,
                              deleteRowID: budget.budgetID,
                              deleteRowIteractionType: "leave",
                            }));
                          }
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
              )
          )}
          {!budgetLoaded && fetchBudgetsStatus === "loading" && (
            <tr>
              <td colSpan={5} className="h-full w-full p-10 bg-white">
                <ArrowsLoader />
              </td>
            </tr>
          )}
        </Table>

        <div className="text-center mt-6">
          {!addNewBudget && (
            <>
              <Button
                handleClick={() => {
                  if (globalSearchKeywords !== "") return;

                  setAddNewBudget(true);
                }}
                additionalStyles={
                  globalSearchKeywords !== ""
                    ? "bg-blue-200 hover:hover:cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-900"
                }
              >
                Add new budget
              </Button>

              {budgets?.length > 1 && (
                <Button
                  handleClick={() => {
                    if (globalSearchKeywords !== "") return;

                    dispatch(deleteAllBudgets());
                  }}
                  additionalStyles={
                    globalSearchKeywords !== ""
                      ? "bg-red-200 hover:hover:cursor-not-allowed"
                      : "bg-red-700 hover:bg-red-900"
                  }
                >
                  Delete All
                </Button>
              )}
            </>
          )}
        </div>
      </>
    </div>
  );
}
