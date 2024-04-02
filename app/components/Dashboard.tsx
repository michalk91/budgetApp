import { SyntheticEvent, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { fetchData, updateBudget } from "../redux/usersSlice";

export default function Dashboard() {
  const [budgetFromInput, setBudgetFromInput] = useState("");

  const budgetFromStore = useAppSelector((state) => state.user.budget);
  const dispatch = useAppDispatch();

  const handleUpdateBudget = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(updateBudget(Number(budgetFromInput)));
  };

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  return (
    <>
      <h2>Dashboard</h2>
      <div className="flex m-4 items-center justify-center">
        <p>Add budget: </p>

        <input
          type="number"
          placeholder="0.00"
          className="py-3 px-2 text-md border border-blue-lighter rounded-r"
          onChange={(e) => setBudgetFromInput(e.target.value)}
        />
        <div className="w-8 flex align-center bg-blue-lighter border-t border-l border-b border-blue-lighter rounded-l text-blue-dark">
          $
        </div>
        <button
          type="submit"
          onClick={handleUpdateBudget}
          className="rounded-lg px-4 py-2 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-gray-100 duration-300"
        >
          confrim
        </button>
      </div>
      <span>Current budget: {budgetFromStore} $</span>
    </>
  );
}
