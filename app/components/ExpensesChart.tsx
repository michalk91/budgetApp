import { Chart } from "react-google-charts";
import { useAppSelector } from "../redux/hooks";
import type { Expense } from "../types";

export default function ExpensesChart() {
  const expenses = useAppSelector((state) => state.user.expenses);

  const expensesFromDataBase: [[string, number]] = [["", 0]];

  expenses?.map((expense: Expense) => {
    expensesFromDataBase.push([expense.category, expense.amount]);
  });

  console.log(expensesFromDataBase);

  const data = [["Expense", "Amount"], ...expensesFromDataBase];

  const options = {
    is3D: true,
  };

  return (
    <div className="w-full mt-20">
      <span className="ml-2 font-bold text-xl mx-auto">
        Expenses Visualization
      </span>
      <section className="overflow-hidden border-2 border-slate-300 rounded-lg">
        <Chart
          chartType="PieChart"
          data={data}
          options={options}
          width={"100%"}
          height={"400px"}
        />
        <Chart
          chartType="ColumnChart"
          data={data}
          options={options}
          width={"100%"}
          height={"500px"}
        />
      </section>
    </div>
  );
}
