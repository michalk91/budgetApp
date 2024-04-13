import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { fetchUserData } from "../redux/usersSlice";
import AddExpense from "./AddExpense";
import UpdateBudget from "./UpdateBudget";
import ShowExpenses from "./ShowExpenses";

export default function Dashboard() {
  const budgetFromStore = useAppSelector((state) => state.user.budget);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  return (
    <>
      <h2>Dashboard</h2>
      <UpdateBudget />
      <span className="p-5 text-xl">
        Current budget:
        <b
          className={budgetFromStore > 0 ? " text-lime-600" : " text-rose-500"}
        >
          {` ${budgetFromStore} $`}
        </b>
      </span>
      <AddExpense />
      <ShowExpenses />
    </>
  );
}
