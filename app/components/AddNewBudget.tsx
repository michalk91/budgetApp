import { SyntheticEvent, useCallback, useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { AddNewBudgetProps } from "../types";
import { addNewBudget } from "../redux/budgetsSlice";
import Button from "./Button";
import AmountInput from "./AmountInput";
import { validateAmount } from "../utils/validateAmount";
import { toast } from "react-toastify";

export default function AddNewBudget({ setNewBudget }: AddNewBudgetProps) {
  const dispatch = useAppDispatch();

  const [budgetFromInput, setBudgetFromInput] = useState({
    name: "",
    amount: "",
    currencyType: "PLN",
  });

  const { name, amount, currencyType } = budgetFromInput;

  const notifyEmptyBudgetName = useCallback(
    () => toast.error("You need to enter the budget name."),
    []
  );

  const notifyBudgetAdded = useCallback(
    () =>
      toast.success(
        "The budget has been successfully added to your dashboard."
      ),
    []
  );

  const handleAddBudget = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      if (name === "") {
        notifyEmptyBudgetName();
        return;
      }

      const amountError = validateAmount(amount, "budget");

      if (amountError) {
        toast.error(amountError);
        return;
      }

      const budgetValue = Number(amount);

      dispatch(
        addNewBudget({
          budgetName: name,
          budgetValue,
          currencyType: currencyType as "PLN" | "EUR" | "USD",
        })
      );
      setBudgetFromInput({ name: "", amount: "", currencyType: "PLN" });
      setNewBudget(false);
      notifyBudgetAdded();
    },
    [
      amount,
      currencyType,
      dispatch,
      name,
      setNewBudget,
      notifyBudgetAdded,
      notifyEmptyBudgetName,
    ]
  );

  return (
    <>
      <tr className="bg-surface-muted max-lg:text-center ">
        <td className="px-6 py-6 max-lg:block">
          <span className="font-bold text-xl mx-auto max-lg:ml-0">
            New budget
          </span>
        </td>

        <td
          data-cell="name"
          className="px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_']  max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-md:pb-0 max-lg:flex max-lg:flex-col max-lg:items-center"
        >
          <input
            onChange={(e) =>
              setBudgetFromInput((state) => ({
                ...state,
                name: e.target.value,
              }))
            }
            required
            type="text"
            value={name}
            placeholder="name"
            className="px-2 py-1 rounded-xl bg-surface max-w-32 border-2 -ml-2 max-lg:ml-0"
          ></input>
        </td>

        <td
          data-cell="amount"
          className="px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_']  max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-md:pb-0 max-lg:flex max-lg:flex-col max-lg:items-center"
        >
          <AmountInput
            onChange={(e) => {
              setBudgetFromInput((state) => ({
                ...state,
                amount: e.target.value,
              }));
            }}
            required
            value={amount}
            className="max-w-32 -ml-1"
          />
          <select
            className="px-2 py-1 ml-1 rounded-xl bg-surface max-w-32 border-2"
            onChange={(e) => {
              setBudgetFromInput((state) => ({
                ...state,
                currencyType: e.target.value as "PLN" | "EUR" | "USD",
              }));
            }}
            value={currencyType}
            name="choice"
          >
            <option value="PLN">PLN</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </td>
        <td className="pl-6 max-lg:hidden">You</td>
        <td className="max-lg:block max-lg:pb-4 max-lg:my-4">
          <Button
            handleClick={handleAddBudget}
            additionalStyles="bg-green-700 hover:bg-green-900"
          >
            Add
          </Button>
          <Button
            handleClick={() => setNewBudget(false)}
            additionalStyles="bg-red-600 hover:bg-red-800"
          >
            Cancel
          </Button>
        </td>
      </tr>
    </>
  );
}
