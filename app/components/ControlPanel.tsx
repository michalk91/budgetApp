import ShowExpenses from "./ShowExpenses";
import ExpensesChart from "./ExpensesChart";
import CurrentBudget from "./CurrentBudget";
import ExpensesValue from "./ExpensesValue";
import BudgetAddDate from "./BudgetAddDate";

export default function ControlPanel() {
  return (
    <>
      <div className="flex flex-wrap py-6">
        <CurrentBudget fontSize="2xl" />
        <ExpensesValue fontSize="2xl" />
      </div>
      <BudgetAddDate />
      <ShowExpenses />
      <ExpensesChart />
    </>
  );
}
