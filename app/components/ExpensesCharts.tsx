import { Chart } from "react-google-charts";
import { useAppSelector } from "../redux/hooks";
import Warning from "./Warning";

export default function ExpensesCharts() {
  const transactions = useAppSelector((state) => state.budgets.transactions);

  const expensesFromDataBase = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "income") return acc;

      const index = acc.findIndex((item) => item[0] === transaction.category);

      if (index !== -1) {
        acc[index] = [
          transaction.category,
          Number(acc[index][1]) + transaction.amount,
        ];
      } else {
        acc.push([transaction.category, transaction.amount]);
      }

      return acc;
    },
    [["", 0]]
  );

  const data = [["Expense", "Amount"], ...expensesFromDataBase];

  const options = {
    is3D: true,
  };

  return (
    <>
      {expensesFromDataBase.length > 2 ? (
        <div className="w-full my-10">
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
        <Warning
          text="There is not enough data to generate a visualization."
          additionalStyles="mt-10"
        />
      )}
    </>
  );
}
