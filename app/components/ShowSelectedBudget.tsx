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

export default function ShowSelectedBudget() {
  const dispatch = useAppDispatch();

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

  const [expensesSort, setExpensesSort] = useState({
    sortBy: "timestamp",
    sortDirection: "ascending",
  });

  useEffect(() => {
    dispatch(fetchSelectedBudgetInfo());
  }, [dispatch]);

  const { sortBy, sortDirection } = expensesSort;

  useEffect(() => {
    if (sortDirection === "ascending")
      dispatch(fetchTransactions({ sortBy, descending: false }));
    else if (sortDirection === "descending")
      dispatch(fetchTransactions({ sortBy, descending: true }));
  }, [dispatch, sortBy, sortDirection]);

  return (
    <>
      <div className="border-solid border-2 border-blue-400 shadow-xl rounded-md p-4">
        <div className="flex flex-wrap  justify-center   ">
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
      </div>
      <SubNavigation activeOption={activeOption} />

      {activeOption === "Expenses" && (
        <ShowTransactions
          expensesSort={expensesSort}
          setExpensesSort={setExpensesSort}
        />
      )}
      {activeOption === "Data visualization" && <ExpensesCharts />}

      {activeOption === "Manage categories" && <Categories />}
    </>
  );
}
