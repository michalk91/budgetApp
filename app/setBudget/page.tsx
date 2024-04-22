"use client";
import SetBudget from "../components/SetBudget";
import CurrentBudget from "../components/CurrentBudget";
import { useAppSelector } from "../redux/hooks";
import { useState } from "react";
import Warning from "../components/Warning";

export default function Budget() {
  const expenses = useAppSelector((state) => state.user.expenses);

  const [decision, setDecision] = useState(false);

  return (
    <section className="flex flex-col  h-screen max-h-full justify-center items-center">
      {(expenses?.length === 0 && !decision) || decision ? (
        <>
          <SetBudget />
          <CurrentBudget />
        </>
      ) : (
        <Warning setDecision={setDecision} />
      )}
    </section>
  );
}
