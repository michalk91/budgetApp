import { Chart } from "react-google-charts";
import type { Transaction, ExpensesChartProps } from "../types";

export default function ExpensesChart({ transactions }: ExpensesChartProps) {
  const expensesFromDataBase: [[string, number]] = [["", 0]];

  transactions?.map((expense: Transaction) => {
    if (expense.type === "income") return;

    let sameCategory = "",
      totalAmount = 0,
      sameCategoryIndex = 0;

    expensesFromDataBase.filter((item, index) => {
      if (item[0] === expense.category) {
        sameCategory = expense.category;
        totalAmount = item[1] + expense.amount;
        sameCategoryIndex = index;
      }
    });

    if (expense.category !== sameCategory) {
      expensesFromDataBase.push([expense.category, expense.amount]);
    } else if (expense.category === sameCategory) {
      expensesFromDataBase[sameCategoryIndex] = [expense.category, totalAmount];
    }
  });

  const data = [["Expense", "Amount"], ...expensesFromDataBase];

  const options = {
    is3D: true,
  };

  return (
    <>
      {expensesFromDataBase.length > 1 && (
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
      )}
    </>
  );
}
