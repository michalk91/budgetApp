import { Chart } from "react-google-charts";
import { useAppSelector } from "../redux/hooks";
import Warning from "./Warning";
import { useTheme } from "next-themes";
import { themeTokens } from "../theme/tokens";

export default function ExpensesCharts() {
  const transactions = useAppSelector((state) => state.budgets.transactions);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

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

  const colors = themeTokens[isDark ? "dark" : "light"];
  const textStyle = { color: colors.fg };

  const options = {
    is3D: true,
    backgroundColor: colors.surface,
    legend: { textStyle },
    titleTextStyle: textStyle,
    hAxis: { textStyle },
    vAxis: { textStyle, gridlines: { color: colors.line } },
  };

  return (
    <>
      {expensesFromDataBase.length > 2 ? (
        <div className="w-full my-10">
          <span className="ml-2 font-bold text-xl mx-auto">
            Expenses Visualization
          </span>
          <section className="overflow-hidden border-2 border-line rounded-lg shadow-xl">
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
