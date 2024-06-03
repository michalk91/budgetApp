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
      const filteredKey =
        exception?.as.localeCompare(debouncedKeywords, undefined, {
          sensitivity: "accent",
        }) !== -1
          ? key.filter((key) => key !== exception?.inKey)
          : key;

      const filteredValue =
        exception?.keyword.localeCompare(debouncedKeywords, undefined, {
          sensitivity: "accent",
        }) !== -1
          ? exception?.as
          : value;

      return arr.filter((obj) =>
        filteredKey.some((k) => {
          if (typeof obj[k] === "string" && typeof filteredValue === "string") {
            for (let i = 0; i < filteredValue.length; i++) {
              if (
                obj[k]
                  .charAt(i)
                  .localeCompare(filteredValue.charAt(i), undefined, {
                    sensitivity: "accent",
                  }) !== 0
              ) {
                return false;
              }
            }
            return true;
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
