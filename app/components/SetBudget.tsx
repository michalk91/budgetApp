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
      <form className="mb-4">
        <div className="flex flex-wrap items-center justify-center ">
          <span className="font-bold text-xl mx-auto mr-1 max-md:mr-0 max-md:w-full max-md:text-center mt-4">{`Set budget:`}</span>
          <input
            type="number"
            placeholder="0.00"
            value={budgetFromInput}
            className="  font-bold py-2 px-4 rounded-full mt-4 mr-2 max-md:w-full"
            onChange={(e) => setBudgetFromInput(e.target.value)}
          />
          <div className="w-8 flex align-center  max-md:basis-full ">
            <CurrencyType />
          </div>
          <button
            onClick={handleUpdateBudget}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 ml-16 px-6 rounded-full mt-4 ml-1 max-md:mx-auto max-md:mt-6"
          >
            confrim
          </button>
        </div>
      </form>
    </>
  );
}
