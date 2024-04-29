import React from "react";
import type { BudgetAddDateProps } from "../types";

export default function BudgetAddDate({ budgetDate }: BudgetAddDateProps) {
  return (
    budgetDate && (
      <span className={`py-5 md:-ml-3 text-xl max-md:-mt-6 max-md:text-lg`}>
        {`(set: `}
        <b>{budgetDate}</b>
        {`)`}
      </span>
    )
  );
}
