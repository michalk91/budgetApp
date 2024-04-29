import { useAppDispatch } from "../redux/hooks";
import { SyntheticEvent } from "react";
import { useState, useRef } from "react";
import { useAppSelector } from "../redux/hooks";
import { addCategory, deleteCategory } from "../redux/usersSlice";

export default function IncomeCategories() {
  const dispatch = useAppDispatch();

  const categories = useAppSelector((state) => state.user.incomeCategories);
  const userEmail = useAppSelector((state) => state.user.email);

  const [categoryToDelete, setCategoryToDelete] = useState("");
  const [newCategory, setNewCategory] = useState(categories);

  const inputRef = useRef<HTMLInputElement>(null);

  const GUEST_EMAIL = process.env.GUEST_EMAIL;

  return (
    <form
      className="text-center m-6 "
      onSubmit={(e) => {
        (e.target as HTMLFormElement).reset();
        setCategoryToDelete("");
      }}
    >
      <span className="font-bold text-xl mx-auto">Income categories</span>
      <div className="py-2">
        <div className="flex flex-wrap -ml-1 py-1 justify-center">
          {categories?.map((category) => (
            <p
              key={category}
              onClick={(e: SyntheticEvent) => {
                const text = (e.target as HTMLElement).textContent;
                text && setCategoryToDelete(text);
              }}
              className={
                category === categoryToDelete
                  ? "border-solid border-2 border-green-400 py-2 px-4 m-1 rounded-full bg-green-200 cursor-pointer"
                  : "border-solid border-2 border-green-400 py-2 px-4 m-1 rounded-full hover:bg-green-200 cursor-pointer"
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
              className="  font-bold py-2 mr-3 px-4 rounded-full "
            ></input>

            <button
              onClick={(e) => {
                e.preventDefault();

                if (userEmail === GUEST_EMAIL) return;

                dispatch(
                  addCategory({
                    categoryName: newCategory[newCategory.length - 1],
                    type: "income",
                  })
                );

                if (!inputRef.current) return;

                inputRef.current.value = "";
              }}
              className={`text-white font-bold py-2 px-6 rounded-full mt-4 ${
                userEmail === GUEST_EMAIL
                  ? "cursor-not-allowed bg-blue-300 "
                  : "bg-blue-500 hover:bg-blue-700"
              }`}
            >
              Add new
            </button>
          </div>
        )}
        {categoryToDelete !== "" && (
          <div className="mt-3">
            <button
              onClick={(e) => {
                e.preventDefault();

                if (userEmail === GUEST_EMAIL) return;

                dispatch(
                  deleteCategory({
                    categoryName: categoryToDelete,
                    type: "income",
                  })
                );

                setCategoryToDelete("");
              }}
              className={`text-white font-bold py-2 mx-1 px-6 rounded-full ${
                userEmail === GUEST_EMAIL
                  ? "cursor-not-allowed bg-red-300 "
                  : "bg-red-600 hover:bg-red-800"
              } `}
            >
              Delete
            </button>
            <button
              onClick={(e) => {
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
    </form>
  );
}
