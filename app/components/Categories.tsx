import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { SyntheticEvent } from "react";
import { useState, useRef } from "react";
import { addCategory, deleteCategory } from "../redux/usersSlice";

export default function Categories() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.user.categories);

  const [categoryToDelete, setCategoryToDelete] = useState("");
  const [newCategory, setNewCategory] = useState(categories);

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      className="text-center"
      onSubmit={(e) => {
        (e.target as HTMLFormElement).reset();
        setCategoryToDelete("");
      }}
    >
      <span className="font-bold text-xl mx-auto">Categories</span>
      <div className="py-2">
        <div className="flex flex-wrap -ml-1 py-1">
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
    </form>
  );
}