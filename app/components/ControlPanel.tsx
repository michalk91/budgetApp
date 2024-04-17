import ShowExpenses from "./ShowExpenses";
import ExpensesChart from "./ExpensesChart";
import CurrentBudget from "./CurrentBudget";

export default function ControlPanel() {
  return (
    <>
      <CurrentBudget fontSize="2xl" />
      <ShowExpenses />
      <ExpensesChart />
    </>
  );
}
