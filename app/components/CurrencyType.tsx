import { SyntheticEvent, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";

export default function CurrencyType() {
  const currencyType = useAppSelector((state) => state.budgets.currencyType);

  const [currency, setCurrency] = useState(currencyType);

  return (
    <select
      className="px-4 py-2 rounded-full mt-4 max-md:mx-auto bg-white"
      onChange={(e: SyntheticEvent) => {
        setCurrency(
          (e.target as HTMLInputElement).value as "PLN" | "EUR" | "USD"
        );
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
