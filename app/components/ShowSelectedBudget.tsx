import ShowTransactions from "./ShowTransactions";
import ExpensesCharts from "./ExpensesCharts";
import BudgetAddDate from "./BudgetAddDate";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import DisplayAmount from "./DisplayAmount";
import { useEffect, useState } from "react";
import {
  fetchSelectedBudgetInfo,
  fetchTransactions,
} from "../redux/budgetsSlice";
import Categories from "./Categories";
import SubNavigation from "./SubNavigation";
import ShareBudget from "./ShareBudget";
import { fetchJoinedUsers } from "../redux/invitationsSlice";
import { FaUser } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import type { SortOptions } from "../types";
import ShowError from "./ShowError";
import { useIDfromPathname } from "../hooks/useIDfromPathname";

export default function ShowSelectedBudget() {
  const dispatch = useAppDispatch();
  const budgetID = useIDfromPathname();

  const usersWithAccess = useAppSelector(
    (state) => state.invitations.usersWithAccess
  );
  const budgetValue = useAppSelector((state) => state.budgets.budgetValue);
  const budgetName = useAppSelector((state) => state.budgets.budgetName);
  const budgetAddDate = useAppSelector((state) => state.budgets.addDate);
  const activeOption = useAppSelector((state) => state.budgets.selectedOption);
  const expensesFromStore = useAppSelector(
    (state) => state.budgets.expensesValue
  );
  const incomesFromStore = useAppSelector(
    (state) => state.budgets.incomesValue
  );
  const userID = useAppSelector((state) => state.user.userID);
  const ownerUsername = useAppSelector((state) => state.budgets.ownerUsername);
  const ownerEmail = useAppSelector((state) => state.budgets.ownerEmail);
  const ownerID = useAppSelector((state) => state.budgets.ownerID);
  const fetchSelectedBudgetError = useAppSelector(
    (state) => state.budgets.showSelectedBudgetError
  );

  const [expensesSort, setExpensesSort] = useState<SortOptions>({
    sortBy: "timestamp",
    sortDirection: "without",
  });

  const { sortBy, sortDirection } = expensesSort;

  useEffect(() => {
    dispatch(fetchSelectedBudgetInfo(budgetID));
    dispatch(
      fetchJoinedUsers({
        budgetID,
        sortOptions: { sortBy: "username", sortDirection: "ascending" },
      })
    );
  }, [dispatch, budgetID, sortDirection]);

  useEffect(() => {
    dispatch(
      fetchTransactions({
        budgetID,
        sortOptions: { sortBy, sortDirection },
      })
    );
  }, [dispatch, sortBy, sortDirection, budgetID]);

  return (
    <div className="flex flex-col items-center animate-fadeInUp w-full opacity-0">
      {fetchSelectedBudgetError === "" ? (
        <>
          <div className="border-solid border-2 border-blue-400 shadow-xl rounded-md p-4 mt-10">
            <div className="flex flex-wrap  justify-center">
              {budgetName !== "" && (
                <span className={`text-center p-5 text-2xl max-md:p-1`}>
                  {`Budget name: `}
                  <b className="text-blac">{`"${budgetName}"`}</b>
                </span>
              )}

              <DisplayAmount
                fontSize="2xl"
                valueFromStore={budgetValue}
                title="Budget amount"
                titleClass={
                  budgetValue > 0 ? " text-lime-600" : " text-rose-500"
                }
              />
              <BudgetAddDate budgetDate={budgetAddDate} />
            </div>

            <div className="flex flex-wrap justify-center  self-center max-md:p-2">
              <DisplayAmount
                fontSize="xl"
                title="Expenses"
                valueFromStore={expensesFromStore}
                titleClass={
                  expensesFromStore === 0 ? " text-lime-600" : " text-rose-500"
                }
              />
              <DisplayAmount
                fontSize="xl"
                title="Incomes"
                valueFromStore={incomesFromStore}
                titleClass={
                  incomesFromStore > 0 ? " text-lime-600" : " text-rose-500"
                }
              />
            </div>
            {
              <span className="text-center mb-6 mt-1 text-lg text-blue-700 flex items-center justify-center flex-wrap">
                <RiAdminFill />
                {userID !== ownerID ? (
                  <p className="pl-2 mb-4 mt-2">
                    OWNER:<b className="pl-2">{`${ownerUsername}`}</b>
                    {` (${ownerEmail})`}
                  </p>
                ) : (
                  <p className="pl-2 mt-2">
                    OWNER: <b>{`You`}</b>
                  </p>
                )}
              </span>
            }
            {userID && usersWithAccess.length > 0 && (
              <div className="text-center p-6 border-t-2 border-blue-400">
                <p className="text-xl font-bold mt-3">
                  Users with access to the budget:
                </p>
                <ul>
                  {usersWithAccess.map((user) => (
                    <li
                      className="mt-2 flex items-center justify-center flex-wrap"
                      key={user.userID}
                    >
                      {user.userID !== userID ? (
                        <>
                          <FaUser />
                          <b className="px-2">{` ${user.username} `}</b>
                          {` (${user.userEmail})`}
                        </>
                      ) : (
                        <>
                          <FaUser /> <b className="px-2">You</b>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center min-h-screen w-full">
            <SubNavigation activeOption={activeOption} />

            {activeOption === "Expenses" && (
              <ShowTransactions
                expensesSort={expensesSort}
                setExpensesSort={setExpensesSort}
              />
            )}
            {activeOption === "Data visualization" && <ExpensesCharts />}

            {activeOption === "Manage categories" && (
              <>
                <Categories type="expense" />
                <Categories type="income" />
              </>
            )}
            {activeOption === "Share budget" && <ShareBudget />}
          </div>
        </>
      ) : (
        <ShowError message={fetchSelectedBudgetError} />
      )}
    </div>
  );
}
