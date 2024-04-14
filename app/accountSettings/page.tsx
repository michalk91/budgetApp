"use client";
import { SyntheticEvent, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { changeCurrencyType } from "../redux/usersSlice";

export default function Account() {
  const currencyType = useAppSelector((state) => state.user.currencyType);

  const dispatch = useAppDispatch();

  const [edit, setEdit] = useState({
    currencyType: currencyType,
  });

  useEffect(() => {
    dispatch(changeCurrencyType(edit.currencyType));
  }, [edit.currencyType, dispatch]);

  return (
    <section className="flex flex-col w-full h-screen max-h-full justify-center items-center">
      <form>
        <p>
          {`Currency Type: `}
          <select
            onChange={(e: SyntheticEvent) => {
              setEdit((state) => ({
                ...state,
                currencyType: (e.target as HTMLInputElement).value,
              }));
            }}
            value={edit.currencyType}
            name="choice"
          >
            <option value="USD">USD</option>
            <option value="PLN">PLN</option>
            <option value="EUR">EUR</option>
          </select>
        </p>
      </form>
    </section>
  );
}
