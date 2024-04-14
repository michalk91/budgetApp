"use client";
import { SyntheticEvent, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { changeCurrencyType, addCategory } from "../redux/usersSlice";

export default function Account() {
  const currencyType = useAppSelector((state) => state.user.currencyType);
  const categories = useAppSelector((state) => state.user.categories);

  const dispatch = useAppDispatch();

  const [edit, setEdit] = useState({
    currencyType: currencyType,
    categories,
  });

  useEffect(() => {
    dispatch(changeCurrencyType(edit.currencyType));
  }, [edit.currencyType, dispatch]);

  return (
    <section className="flex flex-col w-full h-screen max-h-full justify-center items-center">
      <form>
        <span>Categories: </span>
        <div className="py-2">
          <input
            onChange={(e: SyntheticEvent) => {
              setEdit((state) => ({
                ...state,
                categories: [
                  ...categories,
                  (e.target as HTMLInputElement).value,
                ],
              }));
            }}
            required
            type="text"
            placeholder="new category"
            className="  font-bold py-2 m-1 px-4 rounded-full "
          ></input>
          <button
            onClick={(e: SyntheticEvent) => {
              e.preventDefault();

              dispatch(
                addCategory(edit.categories[edit.categories.length - 1])
              );
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 m-1 px-6 rounded-full "
          >
            Add new
          </button>
        </div>
        <div className="flex flex-wrap">
          {categories?.map((category) => (
            <p
              key={category}
              className="border-solid border-2 border-blue-400 py-2 px-4 m-1 rounded-full hover:bg-blue-200"
            >
              {category}
            </p>
          ))}
        </div>

        <p className="my-5">
          {`Currency Type: `}
          <select
            className="px-2 py-1 rounded-lg "
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
