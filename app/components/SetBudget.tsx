import { SyntheticEvent, useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { setBudget } from "../redux/usersSlice";
import CurrencyType from "./CurrencyType";

export default function SetBudget() {
  const dispatch = useAppDispatch();

  const [budgetFromInput, setBudgetFromInput] = useState("");

  const handleUpdateBudget = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(setBudget(Number(budgetFromInput)));
    setBudgetFromInput("");
  };

  return (
    <>
      <span className="font-bold text-xl mx-auto">Set budget</span>
      <form className="flex m-2 items-center justify-center">
        <input
          type="number"
          placeholder="0.00"
          value={budgetFromInput}
          className="  font-bold py-2 mr-1 px-4 rounded-full "
          onChange={(e) => setBudgetFromInput(e.target.value)}
        />
        <div className="w-8 flex align-center bg-blue-lighter border-t border-l border-b border-blue-lighter rounded-l text-blue-dark">
          <CurrencyType />
        </div>
        <button
          onClick={handleUpdateBudget}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 ml-16 px-6 rounded-full "
        >
          confrim
        </button>
      </form>
    </>
  );
}
