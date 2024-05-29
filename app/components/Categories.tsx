import { useAppDispatch } from "../redux/hooks";
import { SyntheticEvent } from "react";
import { useState, useRef } from "react";
import { useAppSelector } from "../redux/hooks";
import { addCategory, deleteCategory } from "../redux/budgetsSlice";
import type { CategoriesProps } from "../types";
import Button from "./Button";

export default function Categories({ type }: CategoriesProps) {
  const dispatch = useAppDispatch();

  const categories = useAppSelector((state) =>
    type === "expense"
      ? state.budgets.expenseCategories
      : state.budgets.incomeCategories
  );
  // const userEmail = useAppSelector((state) => state.user.email);
  const allowManageCategories = useAppSelector(
    (state) => state.budgets.allowManageCategories
  );
  const userID = useAppSelector((state) => state.user.userID);
  const ownerID = useAppSelector((state) => state.budgets.ownerID);

  const [categoryToDelete, setCategoryToDelete] = useState("");
  const [newCategory, setNewCategory] = useState(categories);

  const inputRef = useRef<HTMLInputElement>(null);

  // const GUEST_EMAIL = process.env.GUEST_EMAIL;

  return (
    <form
      className="text-center my-10"
      onSubmit={(e) => {
        (e.target as HTMLFormElement).reset();
        setCategoryToDelete("");
      }}
    >
      <span className="font-bold text-xl mx-auto">
        {type === "expense" ? "Expense categories" : "Income categories"}
      </span>
      <div className="py-2">
        <div className="flex flex-wrap -ml-1 py-1 justify-center ">
          {categories?.map((category) => (
            <p
              key={category}
              onClick={(e: SyntheticEvent) => {
                const text = (e.target as HTMLElement).textContent;
                text && setCategoryToDelete(text);
              }}
              className={
                category === categoryToDelete
                  ? `border-solid border-2  py-2 px-4 m-1 rounded-full ${
                      type === "expense"
                        ? "bg-red-200  border-red-400"
                        : "bg-green-200  border-green-400"
                    }  cursor-pointer `
                  : `border-solid border-2 py-2 px-4 m-1 rounded-full ${
                      type === "expense"
                        ? "hover:bg-red-200 border-red-400"
                        : "hover:bg-green-200 border-green-400"
                    }  cursor-pointer`
              }
            >
              {category}
            </p>
          ))}
        </div>
        {categoryToDelete === "" && (
          <div className="mt-3">
            <input
              onChange={(e) => {
                setNewCategory((state) => [...state, e.target.value]);
              }}
              ref={inputRef}
              required
              type="text"
              placeholder="new category"
              className="font-bold py-2 mr-3 px-4 rounded-full bg-white border-2 border-black"
            ></input>

            <Button
              handleClick={(e) => {
                e.preventDefault();
                if (
                  // userEmail === GUEST_EMAIL ||
                  userID !== ownerID &&
                  userID &&
                  !allowManageCategories.includes(userID)
                )
                  return;

                dispatch(
                  addCategory({
                    categoryName: newCategory[newCategory.length - 1],
                    type,
                  })
                );

                if (!inputRef.current) return;

                inputRef.current.value = "";
              }}
              additionalStyles={`text-white font-bold py-2 px-6 rounded-full mt-4 max-md:px-6 max-md:py-4 ${
                // userEmail === GUEST_EMAIL ||
                userID !== ownerID &&
                userID &&
                !allowManageCategories.includes(userID)
                  ? "cursor-not-allowed bg-blue-300 "
                  : "bg-blue-500 hover:bg-blue-700"
              }`}
            >
              Add new
            </Button>
          </div>
        )}
        {categoryToDelete !== "" && (
          <div className="mt-6 max-md:-mt-1">
            <Button
              handleClick={(e) => {
                e.preventDefault();

                if (
                  // userEmail === GUEST_EMAIL ||
                  userID !== ownerID &&
                  userID &&
                  !allowManageCategories.includes(userID)
                )
                  return;

                dispatch(
                  deleteCategory({
                    categoryName: categoryToDelete,
                    type,
                  })
                );

                setCategoryToDelete("");
              }}
              additionalStyles={`text-white font-bold py-2 mx-1 px-6 rounded-full max-md:px-6 max-md:py-4 ${
                // userEmail === GUEST_EMAIL ||
                userID !== ownerID &&
                userID &&
                !allowManageCategories.includes(userID)
                  ? "cursor-not-allowed bg-red-300 "
                  : "bg-red-600 hover:bg-red-800"
              } `}
            >
              Delete
            </Button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setCategoryToDelete("");
              }}
              className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 mx-1 px-6 rounded-full max-md:px-6 max-md:py-4"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
