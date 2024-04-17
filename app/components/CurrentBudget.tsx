import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { fetchUserData } from "../redux/usersSlice";
import useFormatter from "../hooks/useFormatter";

export default function CurrentBudget() {
  const budgetFromStore = useAppSelector((state) => state.user.budget);
  const currencyType = useAppSelector((state) => state.user.currencyType);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const formatCurrency = useFormatter();

  return (
    <>
      <span className="p-5 text-xl">
        {`Current budget: `}
        <b
          className={budgetFromStore > 0 ? " text-lime-600" : " text-rose-500"}
        >
          {formatCurrency(budgetFromStore, currencyType)}
        </b>
      </span>
    </>
  );
}
