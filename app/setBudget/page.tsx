"use client";
import SetBudget from "../components/SetBudget";
import DisplayAmount from "../components/DisplayAmount";
import { useAppSelector } from "../redux/hooks";
import { useState } from "react";
import Warning from "../components/Warning";

export default function Budget() {
  const expenses = useAppSelector((state) => state.user.transactions);
  const budgetFromStore = useAppSelector((state) => state.user.budget);
  const currencyType = useAppSelector((state) => state.user.currencyType);

  const [decision, setDecision] = useState(false);

  return (
    <section className="flex flex-col flex-wrap grow justify-center items-center">
      {(expenses?.length === 0 && !decision) || decision ? (
        <>
          <SetBudget />

          <DisplayAmount
            valueFromStore={budgetFromStore}
            currencyType={currencyType}
            title="Current budget"
            titleClass={
              budgetFromStore > 0 ? " text-lime-600" : " text-rose-500"
            }
          />
        </>
      ) : (
        <Warning setDecision={setDecision} />
      )}
    </section>
  );
}
