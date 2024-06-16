const useSort = <
  K extends string,
  T extends Record<K, number | string | string[] | boolean>
>(
  items: T[],
  fieldName: K
) =>
  items.sort((a: T, b: T) => {
    if (typeof a[fieldName] === "number" && typeof b[fieldName] === "number") {
      return Number(a[fieldName]) - Number(b[fieldName]);
    } else if (
      typeof a[fieldName] === "string" &&
      typeof b[fieldName] === "string"
    ) {
      return (a[fieldName] as string).localeCompare(b[fieldName] as string);
    }
    return 0;
  });

export default useSort;
