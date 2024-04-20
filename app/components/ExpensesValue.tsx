import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { fetchUserData } from "../redux/usersSlice";
import useFormatter from "../hooks/useFormatter";
import type { CurrentBudgetProps } from "../types";

export default function ExpensesValue({ fontSize = "xl" }: CurrentBudgetProps) {
  const expensesFromStore = useAppSelector((state) => state.user.expensesValue);
  const currencyType = useAppSelector((state) => state.user.currencyType);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const formatCurrency = useFormatter();

  return (
    <>
      <span className={`p-5 text-${fontSize}`}>
        {`Expenses: `}
        <b
          className={
            expensesFromStore === 0 ? " text-lime-600" : " text-rose-500"
          }
        >
          {formatCurrency(expensesFromStore, currencyType)}
        </b>
      </span>
    </>
  );
}
