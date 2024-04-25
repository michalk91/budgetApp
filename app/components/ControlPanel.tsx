import ShowTransactions from "./ShowTransactions";
import ExpensesChart from "./ExpensesChart";
import BudgetAddDate from "./BudgetAddDate";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { useEffect } from "react";
import { fetchUserData } from "../redux/usersSlice";
import DisplayAmount from "./DisplayAmount";

export default function ControlPanel() {
  const budgetFromStore = useAppSelector((state) => state.user.budget);
  const expensesFromStore = useAppSelector((state) => state.user.expensesValue);
  const incomesFromStore = useAppSelector((state) => state.user.incomesValue);
  const currencyType = useAppSelector((state) => state.user.currencyType);
  const budgetDate = useAppSelector((state) => state.user.budgetAddDate);
  const transactions = useAppSelector((state) => state.user.transactions);
  const expenseCategories = useAppSelector(
    (state) => state.user.expenseCategories
  );
  const incomeCategories = useAppSelector(
    (state) => state.user.incomeCategories
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  return (
    <>
      <div className="flex flex-wrap py-6">
        <DisplayAmount
          fontSize="2xl"
          valueFromStore={budgetFromStore}
          currencyType={currencyType}
          title="Budget"
          titleClass={budgetFromStore > 0 ? " text-lime-600" : " text-rose-500"}
        />
        <BudgetAddDate budgetDate={budgetDate} />
      </div>
      <div>
        <DisplayAmount
          title="Expenses"
          valueFromStore={expensesFromStore}
          currencyType={currencyType}
          titleClass={
            expensesFromStore === 0 ? " text-lime-600" : " text-rose-500"
          }
        />
        <DisplayAmount
          title="Incomes"
          valueFromStore={incomesFromStore}
          currencyType={currencyType}
          titleClass={
            incomesFromStore > 0 ? " text-lime-600" : " text-rose-500"
          }
        />
      </div>

      <ShowTransactions
        transactions={transactions}
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        currencyType={currencyType}
      />
      <ExpensesChart transactions={transactions} />
    </>
  );
}
