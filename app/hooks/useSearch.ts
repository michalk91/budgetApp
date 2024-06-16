import { useDebounce } from "use-debounce";
import { SyntheticEvent, useCallback, useState } from "react";

const useSearch = <T extends Record<string, any>>({
  data,
  keys,
  exception,
}: {
  data: T[];
  keys: string[];
  exception?: { keyword: string; as: string; inKey: string };
}) => {
  const [searchKeywords, setSearchKeywords] = useState<string>("");
  const [debouncedKeywords] = useDebounce(searchKeywords, 600);

  const handleSearch = useCallback((e: SyntheticEvent) => {
    if (e.target instanceof HTMLInputElement) setSearchKeywords(e.target.value);
  }, []);

  const findValuesBy = useCallback(
    (arr: T[], key: string[], value: string | number): T[] => {
      const filteredKey = exception?.as
        .toLocaleLowerCase()
        .includes(debouncedKeywords.toLocaleLowerCase())
        ? key.filter((key) => key !== exception?.inKey)
        : key;

      const filteredValue = exception?.keyword
        .toLocaleLowerCase()
        .includes(debouncedKeywords.toLocaleLowerCase())
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
    },
    [debouncedKeywords, exception]
  );

  const filteredArray =
    debouncedKeywords !== ""
      ? findValuesBy(data, keys, debouncedKeywords)
      : data;

  const notFound = debouncedKeywords !== "" && filteredArray.length === 0;

  return { handleSearch, filteredArray, searchKeywords, notFound };
};

export default useSearch;
