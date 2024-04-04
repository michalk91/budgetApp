import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { fetchData } from "../redux/usersSlice";
import UpdateBudget from "./UpdateBudget";

export default function Dashboard() {
  const budgetFromStore = useAppSelector((state) => state.user.budget);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  return (
    <>
      <h2>Dashboard</h2>
      <UpdateBudget />
      <span>Current budget: {budgetFromStore} $</span>
    </>
  );
}
