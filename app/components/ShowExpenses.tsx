import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { deleteExpense } from "../redux/usersSlice";
import { fetchExpenses } from "../redux/usersSlice";
import { useEffect } from "react";

export default function ShowExpenses() {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.user.expenses);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);
  const handleDeleteExpense = (id: string) => {
    dispatch(deleteExpense(id));
  };

  return (
    <div className="w-full">
      <span className="font-bold text-xl mx-auto"> Expenses</span>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-2 border-slate-300">
          <thead className="text-xs text-gray-700 uppercase  dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses?.length > 0 &&
              expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="hover:bg-gray-100 bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-8 py-6">{expense.date} </td>
                  <td className="px-8 py-6">{expense.category}</td>
                  <td className="px-8 py-6">{`${expense.amount} $`}</td>

                  <button
                    onClick={() =>
                      expense.id && handleDeleteExpense(expense.id)
                    }
                    className="px-8 py-6"
                  >
                    Delete
                  </button>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
