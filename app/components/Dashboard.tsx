import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { fetchData } from "../redux/usersSlice";

export default function Dashboard() {
  const budget = useAppSelector((state) => state.user.user.budget);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  return (
    <>
      <h2>Dashboard</h2>
      <div className="flex m-4 items-center justify-center">
        <p>Add budget: </p>

        <input
          type="text"
          placeholder="0.00"
          className="py-3 px-2 text-md border border-blue-lighter rounded-r"
        />
        <div className="w-8 flex align-center bg-blue-lighter border-t border-l border-b border-blue-lighter rounded-l text-blue-dark">
          $
        </div>
        <button className="rounded-lg px-4 py-2 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-gray-100 duration-300">
          confrim
        </button>
      </div>
      <span>Current budget: {budget} $</span>
    </>
  );
}
