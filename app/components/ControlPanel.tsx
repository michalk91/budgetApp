import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { fetchUserData } from "../redux/usersSlice";
import UpdateBudget from "./UpdateBudget";
import ShowExpenses from "./ShowExpenses";
import useFormatter from "../hooks/useFormatter";
import ExpensesChart from "./ExpensesChart";

export default function ControlPanel() {
  const budgetFromStore = useAppSelector((state) => state.user.budget);
  const currencyType = useAppSelector((state) => state.user.currencyType);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const formatCurrency = useFormatter();

  return (
    <>
      <h2>Dashboard</h2>
      <UpdateBudget />
      <span className="p-5 text-xl">
        Current budget:
        <b
          className={budgetFromStore > 0 ? " text-lime-600" : " text-rose-500"}
        >
          {formatCurrency(budgetFromStore, currencyType)}
        </b>
      </span>
      <ShowExpenses />
      <ExpensesChart />
    </>
  );
}
