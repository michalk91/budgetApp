import React from "react";
import type { BudgetAddDateProps } from "../types";

export default function BudgetAddDate({
  fontSize = "xl",
  budgetDate,
}: BudgetAddDateProps) {
  return (
    budgetDate && (
      <span className={`py-5 md:-ml-3 text-${fontSize}`}>
        {`(set: `}
        <b>{budgetDate}</b>
        {`)`}
      </span>
    )
  );
}
