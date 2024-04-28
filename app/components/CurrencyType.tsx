import { SyntheticEvent, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { changeCurrencyType } from "../redux/usersSlice";

export default function CurrencyType() {
  const currencyType = useAppSelector((state) => state.user.currencyType);

  const dispatch = useAppDispatch();

  const [currency, setCurrency] = useState(currencyType);

  useEffect(() => {
    dispatch(changeCurrencyType(currency));
  }, [currency, dispatch]);

  return (
    <select
      className="px-4 py-2 rounded-full mt-4 max-md:mx-auto"
      onChange={(e: SyntheticEvent) => {
        setCurrency((e.target as HTMLInputElement).value);
      }}
      value={currency}
      name="choice"
    >
      <option value="PLN">PLN</option>
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
    </select>
  );
}
