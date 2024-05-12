import useFormatter from "../hooks/useFormatter";
import type { DisplayAmountProps } from "../types";
import { useAppSelector } from "../redux/hooks";

export default function DisplayAmount({
  fontSize = "xl",
  valueFromStore,
  title,
  titleClass,
}: DisplayAmountProps) {
  const formatCurrency = useFormatter();

  const currencyType = useAppSelector((state) => state.budgets.currencyType);

  return (
    <>
      <span className={`text-center p-5 text-${fontSize} max-md:p-1`}>
        {`${title}: `}
        <b className={titleClass}>
          {formatCurrency(valueFromStore, currencyType)}
        </b>
      </span>
    </>
  );
}
