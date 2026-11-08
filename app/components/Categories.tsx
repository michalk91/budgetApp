import { useAppDispatch } from "../redux/hooks";
import { SyntheticEvent } from "react";
import { useState, useRef } from "react";
import { useAppSelector } from "../redux/hooks";
import { addCategory, deleteCategory } from "../redux/budgetsSlice";
import type { CategoriesProps } from "../types";
import Button from "./Button";
import { useIDfromPathname } from "../hooks/useIDfromPathname";

export default function Categories({ type }: CategoriesProps) {
  const dispatch = useAppDispatch();

  const budgetID = useIDfromPathname();

  const categories = useAppSelector((state) =>
    type === "expense"
      ? state.budgets.expenseCategories
      : state.budgets.incomeCategories
  );

  const allowManageCategories = useAppSelector(
    (state) => state.budgets.allowManageCategories
  );
  const userID = useAppSelector((state) => state.user.userID);
  const ownerID = useAppSelector((state) => state.budgets.ownerID);

  const [categoryToDelete, setCategoryToDelete] = useState("");
  const [newCategory, setNewCategory] = useState(categories);

  const inputRef = useRef<HTMLInputElement>(null);

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
                        ? "bg-danger-soft  border-red-400"
                        : "bg-success-soft  border-green-400"
                    }  cursor-pointer `
                  : `border-solid border-2 py-2 px-4 m-1 rounded-full ${
                      type === "expense"
                        ? "hover:bg-danger-soft border-red-400"
                        : "hover:bg-success-soft border-green-400"
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
              id="new-category"
              ref={inputRef}
              required
              type="text"
              placeholder="new category"
              className="font-bold py-2 mr-3 px-4 rounded-xl bg-surface border-2 border-line-strong"
            ></input>

            <Button
              handleClick={(e) => {
                e.preventDefault();
                if (
                  userID !== ownerID &&
                  userID &&
                  !allowManageCategories.includes(userID)
                )
                  return;

                dispatch(
                  addCategory({
                    budgetID,
                    category: {
                      categoryName: newCategory[newCategory.length - 1],
                      type,
                    },
                  })
                );

                if (!inputRef.current) return;

                inputRef.current.value = "";
              }}
              additionalStyles={`mt-4 ${
                userID !== ownerID &&
                userID &&
                !allowManageCategories.includes(userID)
                  ? "cursor-not-allowed bg-primary-disabled text-on-disabled"
                  : "bg-blue-500 hover:bg-blue-700"
              }`}
            >
              Add new
            </Button>
          </div>
        )}
        {categoryToDelete !== "" && (
          <div className="mt-5 max-md:-mt-1">
            <Button
              handleClick={(e) => {
                e.preventDefault();

                if (
                  userID !== ownerID &&
                  userID &&
                  !allowManageCategories.includes(userID)
                )
                  return;

                dispatch(
                  deleteCategory({
                    budgetID,
                    category: { categoryName: categoryToDelete, type },
                  })
                );

                setCategoryToDelete("");
              }}
              additionalStyles={`mx-1 ${
                userID !== ownerID &&
                userID &&
                !allowManageCategories.includes(userID)
                  ? "cursor-not-allowed bg-danger-disabled text-on-disabled"
                  : "bg-red-600 hover:bg-red-800"
              } `}
            >
              Delete
            </Button>
            <Button
              handleClick={(e) => {
                e.preventDefault();
                setCategoryToDelete("");
              }}
              additionalStyles="mx-1 bg-green-600 hover:bg-green-800"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}
