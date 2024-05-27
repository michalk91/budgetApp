import ShowTransactions from "./ShowTransactions";
import ExpensesCharts from "./ExpensesCharts";
import BudgetAddDate from "./BudgetAddDate";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import DisplayAmount from "./DisplayAmount";
import { useEffect } from "react";
import { fetchSelectedBudgetInfo } from "../redux/budgetsSlice";
import Categories from "./Categories";
import SubNavigation from "./SubNavigation";
import ShareBudget from "./ShareBudget";
import { fetchJoinedUsers } from "../redux/invitationsSlice";
import { FaUser } from "react-icons/fa";

export default function ShowSelectedBudget() {
  const dispatch = useAppDispatch();

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

  useEffect(() => {
    dispatch(fetchSelectedBudgetInfo());
    dispatch(fetchJoinedUsers({ sortBy: "username", descending: false }));
  }, [dispatch]);

  return (
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
            titleClass={budgetValue > 0 ? " text-lime-600" : " text-rose-500"}
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
        {usersWithAccess.length > 0 && (
          <div className="text-center border-t-2 border-blue-400">
            <p className="text-xl font-bold mt-6">
              Users with whom you share the budget:{" "}
            </p>
            <ul>
              {usersWithAccess.map((user) => (
                <li
                  className="m-2 flex items-center justify-center flex-wrap"
                  key={user.userID}
                >
                  <FaUser /> <b className="pl-2">{` ${user.username}`}</b>{" "}
                  {`(${user.userEmail})`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <SubNavigation activeOption={activeOption} />

      {activeOption === "Expenses" && <ShowTransactions />}
      {activeOption === "Data visualization" && <ExpensesCharts />}

      {activeOption === "Manage categories" && (
        <>
          <Categories type="expense" />
          <Categories type="income" />
        </>
      )}
      {activeOption === "Share budget" && <ShareBudget />}
    </>
  );
}
