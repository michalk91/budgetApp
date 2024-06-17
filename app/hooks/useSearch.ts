import { useDebounce } from "use-debounce";
import { SyntheticEvent, useCallback, useState } from "react";

const findValuesBy = <T extends Record<string, any>>(
  arr: T[],
  key: string[],
  value: string,
  exception: { keyword: string; as: string; inKey: string } | undefined
): T[] => {
  const filteredKey = exception?.as
    .toLocaleLowerCase()
    .includes(value.toLocaleLowerCase())
    ? key.filter((key) => key !== exception?.inKey)
    : key;

  const filteredValue = exception?.keyword
    .toLocaleLowerCase()
    .includes(value.toLocaleLowerCase())
    ? exception?.as.toLocaleLowerCase()
    : value;

  return arr.filter((obj) =>
    filteredKey.some((k) => {
      if (typeof obj[k] === "string" && typeof filteredValue === "string") {
        return obj[k].toLowerCase().includes(filteredValue.toLowerCase());
      } else {
        return obj[k] === value;
      }
    })
  );
};

const useSearch = ({
  data,
  keys,
  exception,
  globalSearchKeywords,
}: {
  data: Record<string, any>[];
  keys: string[];
  exception?: { keyword: string; as: string; inKey: string };
  globalSearchKeywords?: string;
}) => {
  const [searchKeywords, setSearchKeywords] = useState<string>("");

  const [debouncedKeywords] = useDebounce(searchKeywords, 600);
  const [debouncedGlobalKeywords] = useDebounce(globalSearchKeywords, 600);

  const handleSearch = useCallback((e: SyntheticEvent) => {
    if (e.target instanceof HTMLInputElement) setSearchKeywords(e.target.value);
  }, []);

  const filteredArray =
    globalSearchKeywords === undefined && debouncedKeywords !== ""
      ? findValuesBy(data, keys, debouncedKeywords, exception)
      : data;

  const globalFilteredArray =
    globalSearchKeywords !== undefined &&
    debouncedGlobalKeywords &&
    debouncedGlobalKeywords !== ""
      ? findValuesBy(data, keys, debouncedGlobalKeywords, exception)
      : data;

  const notFound =
    globalSearchKeywords === undefined &&
    debouncedKeywords !== "" &&
    filteredArray.length === 0;

  const notFoundGlobal =
    globalSearchKeywords !== undefined &&
    debouncedGlobalKeywords &&
    debouncedGlobalKeywords !== ""
      ? globalFilteredArray.length === 0
      : false;

  return {
    handleSearch,
    filteredArray,
    searchKeywords,
    notFound,
    globalFilteredArray,
    notFoundGlobal,
  };
};

export default useSearch;
