import React from "react";
import { useAppSelector } from "../redux/hooks";
import type { CurrentBudgetProps } from "../types";

export default function BudgetAddDate({ fontSize = "xl" }: CurrentBudgetProps) {
  const budgetDate = useAppSelector((state) => state.user.budgetAddDate);

  return (
    budgetDate && (
      <span className={`p-5 text-${fontSize}`}>
        {`Budget set: `}
        <b>{budgetDate}</b>
      </span>
    )
  );
}
