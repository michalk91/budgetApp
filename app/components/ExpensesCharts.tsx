import { Chart } from "react-google-charts";
import type { Transaction } from "../types";
import { useAppSelector } from "../redux/hooks";

export default function ExpensesCharts() {
  const transactions = useAppSelector((state) => state.budgets.transactions);

  const expensesFromDataBase: [[string, number]] = [["", 0]];

  transactions?.map((transaction: Transaction) => {
    if (transaction.type === "income") return;

    let sameCategory = "",
      totalAmount = 0,
      sameCategoryIndex = 0;

    expensesFromDataBase.filter((item, index) => {
      if (item[0] === transaction.category) {
        sameCategory = transaction.category;
        totalAmount = item[1] + transaction.amount;
        sameCategoryIndex = index;
      }
    });

    if (transaction.category !== sameCategory) {
      expensesFromDataBase.push([transaction.category, transaction.amount]);
    } else if (transaction.category === sameCategory) {
      expensesFromDataBase[sameCategoryIndex] = [
        transaction.category,
        totalAmount,
      ];
    }
  });

  const data = [["Expense", "Amount"], ...expensesFromDataBase];

  const options = {
    is3D: true,
  };

  return (
    <>
      {expensesFromDataBase.length > 2 ? (
        <div className="w-full my-20">
          <span className="ml-2 font-bold text-xl mx-auto">
            Expenses Visualization
          </span>
          <section className="overflow-hidden border-2 border-slate-300 rounded-lg shadow-xl">
            <Chart
              chartType="PieChart"
              data={data}
              options={options}
              width={"100%"}
              height={`${window.innerWidth > 500 ? "400px" : "auto"}`}
            />
            <Chart
              chartType="ColumnChart"
              data={data}
              options={options}
              width={"100%"}
              height={`${window.innerWidth > 500 ? "500px" : "auto"}`}
            />
          </section>
        </div>
      ) : (
        <div className="p-10 border-2 border-gray-500 mt-10 rounded-lg shadow-xl">
          <span className="text-2xl">
            There is not enough data to generate a visualization.
          </span>
        </div>
      )}
    </>
  );
}
