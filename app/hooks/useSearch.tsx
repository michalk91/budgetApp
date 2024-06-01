import { useDebounce } from "use-debounce";
import { SyntheticEvent, useState } from "react";

const useSearch = <T extends Record<string, any>>({
  data,
  keys,
  exception,
}: {
  data: T[];
  keys: string[];
  exception?: { keyword: string; as: string };
}) => {
  const [searchKeywords, setSearchKeywords] = useState<string>("");
  const [debouncedKeywords] = useDebounce(searchKeywords, 600);

  const handleSearch = (e: SyntheticEvent) => {
    if (e.target instanceof HTMLInputElement) setSearchKeywords(e.target.value);
  };

  const findValuesBy = (
    arr: T[],
    key: string[],
    value: string | number
  ): T[] => {
    return arr.filter((obj) =>
      key.some((k) => {
        if (typeof obj[k] === "string" && typeof value === "string") {
          return obj[k].toLowerCase().includes(value.toString().toLowerCase());
        } else if (typeof obj[k] === "number" && typeof value === "string") {
          return obj[k]
            .toString()
            .toLowerCase()
            .includes(value.toString().toLowerCase());
        } else {
          return obj[k] === value;
        }
      })
    );
  };

  const filteredArray =
    debouncedKeywords !== ""
      ? findValuesBy(
          data,
          keys,
          exception?.keyword.includes(debouncedKeywords)
            ? exception?.as.toLocaleLowerCase()
            : debouncedKeywords
        )
      : data;

  const notFound = debouncedKeywords !== "" && filteredArray.length === 0;

  return { handleSearch, filteredArray, searchKeywords, notFound };
};

export default useSearch;
