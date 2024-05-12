import type { SubNavigationProps } from "../types";
import { useAppDispatch } from "../redux/hooks";
import { setSelectedOption } from "../redux/budgetsSlice";

export default function SubNavigation({ activeOption }: SubNavigationProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="flex justify-center  flex-wrap text-xl mt-10">
      <p
        onClick={() => dispatch(setSelectedOption("Expenses"))}
        className={`${
          activeOption === "Expenses" && "underline underline-offset-8"
        } p-4 hover:cursor-pointer hover:underline underline-offset-8`}
      >
        Expenses
      </p>
      <p
        onClick={() => dispatch(setSelectedOption("Manage categories"))}
        className={`${
          activeOption === "Manage categories" && "underline underline-offset-8"
        } p-4 hover:cursor-pointer hover:underline underline-offset-8`}
      >
        Manage categories
      </p>
      <p
        onClick={() => dispatch(setSelectedOption("Data visualization"))}
        className={`${
          activeOption === "Data visualization" &&
          "underline underline-offset-8"
        } p-4 hover:cursor-pointer hover:underline underline-offset-8`}
      >
        Data visualizaton
      </p>
    </div>
  );
}
