import useFormatter from "../hooks/useFormatter";
import type { DisplayAmountProps } from "../types";

export default function DisplayAmount({
  fontSize = "xl",
  valueFromStore,
  currencyType,
  title,
  titleClass,
}: DisplayAmountProps) {
  const formatCurrency = useFormatter();

  return (
    <>
      <span className={`p-5 text-${fontSize}`}>
        {`${title}: `}
        <b className={titleClass}>
          {formatCurrency(valueFromStore, currencyType)}
        </b>
      </span>
    </>
  );
}
