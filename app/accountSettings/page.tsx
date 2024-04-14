"use client";
import { SyntheticEvent, useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import {
  changeCurrencyType,
  addCategory,
  deleteCategory,
} from "../redux/usersSlice";

export default function Account() {
  const currencyType = useAppSelector((state) => state.user.currencyType);
  const categories = useAppSelector((state) => state.user.categories);

  const dispatch = useAppDispatch();

  const inputRef = useRef<HTMLInputElement>(null);

  const [currency, setCurrency] = useState(currencyType);
  const [categoryToDelete, setCategoryToDelete] = useState("");
  const [newCategory, setNewCategory] = useState(categories);

  useEffect(() => {
    dispatch(changeCurrencyType(currency));
  }, [currency, dispatch]);

  return (
    <section className="flex flex-col w-full h-screen max-h-full justify-center items-center">
      <form onSubmit={(e) => (e.target as HTMLFormElement).reset()}>
        <span>Categories: </span>
        <div className="py-2">
          <div className="flex flex-wrap -ml-1">
            {categories?.map((category) => (
              <p
                key={category}
                onClick={(e: SyntheticEvent) => {
                  const text = (e.target as HTMLElement).textContent;
                  text && setCategoryToDelete(text);
                }}
                className={
                  category === categoryToDelete
                    ? "border-solid border-2 border-blue-400 py-2 px-4 m-1 rounded-full bg-blue-200 cursor-pointer"
                    : "border-solid border-2 border-blue-400 py-2 px-4 m-1 rounded-full hover:bg-blue-200 cursor-pointer"
                }
              >
                {category}
              </p>
            ))}
          </div>
          {categoryToDelete === "" && (
            <div className="mt-3">
              <input
                onChange={(e: SyntheticEvent) => {
                  setNewCategory((state) => [
                    ...state,
                    (e.target as HTMLInputElement).value,
                  ]);
                }}
                ref={inputRef}
                required
                type="text"
                placeholder="new category"
                className="  font-bold py-2 mr-3 px-4 rounded-full "
              ></input>

              <button
                onClick={(e: SyntheticEvent) => {
                  e.preventDefault();

                  dispatch(addCategory(newCategory[newCategory.length - 1]));

                  if (!inputRef.current) return;

                  (inputRef.current as HTMLInputElement).value = "";
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full "
              >
                Add new
              </button>
            </div>
          )}
          {categoryToDelete !== "" && (
            <div className="mt-3">
              <button
                onClick={(e: SyntheticEvent) => {
                  e.preventDefault();
                  dispatch(deleteCategory(categoryToDelete));

                  setCategoryToDelete("");
                }}
                className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 mx-1 px-6 rounded-full "
              >
                Delete
              </button>
              <button
                onClick={(e: SyntheticEvent) => {
                  e.preventDefault();
                  setCategoryToDelete("");
                }}
                className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 mx-1 px-6 rounded-full "
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <p className="my-5">
          {`Currency Type: `}
          <select
            className="px-2 py-1 rounded-lg "
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
        </p>
      </form>
    </section>
  );
}
