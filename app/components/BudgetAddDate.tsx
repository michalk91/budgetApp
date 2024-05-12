import React from "react";
import type { BudgetAddDateProps } from "../types";

export default function BudgetAddDate({ budgetDate }: BudgetAddDateProps) {
  return (
    budgetDate && (
      <span
        className={`text-center pl-0 p-5 md:-ml-3 text-xl max-md:-mt-6 max-md:text-lg`}
      >
        {`(created: `}
        <b>{budgetDate}</b>
        {`)`}
      </span>
    )
  );
}
