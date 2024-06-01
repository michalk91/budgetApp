import { useCallback } from "react";
import type { SortState, TableProps } from "../types";
import { TbArrowsSort } from "react-icons/tb";

export default function Table({
  title,
  headerCells,
  emptyTableCondition,
  emptyTableTitle,
  addNewRow,
  children,
  setSort,
  sortDirection,
  sortBy,
  handleSearch,
  searchKeywords,
  notFound,
}: TableProps) {
  const handleSort = useCallback(
    (sortBy: string, sortDirection: "ascending" | "descending") => {
      setSort(
        (state) =>
          ({
            ...state,
            sortBy,
            sortDirection,
          } as SortState)
      );
    },
    [setSort]
  );

  return (
    <>
      <span className="ml-2 font-bold text-xl mx-auto max-md:text-lg">
        {title}
      </span>
      <div className="relative bg-gray-200 text-center overflow-x-auto border-2 border-slate-300 rounded-lg max-md:mb-6 shadow-xl">
        <div className="flex flex-wrap justify-center items-center  max-lg:p-4 lg:hidden">
          <p>Sort by: </p>
          <select
            className="px-1 m-2 rounded-full bg-white "
            onChange={(e) => handleSort(e.target.value, sortDirection)}
            value={sortBy}
            name="choice"
          >
            {headerCells.map(
              (cell) =>
                cell.sortBy && (
                  <option value={cell.sortBy} key={cell.name}>
                    {cell.name}
                  </option>
                )
            )}
          </select>
          <select
            className="px-1 rounded-full max-w-full bg-white "
            onChange={(e) =>
              handleSort(sortBy, e.target.value as "ascending" | "descending")
            }
            value={sortDirection}
            name="choice"
          >
            <option value="ascending">ascending</option>
            <option value="descending">descending</option>
          </select>
        </div>
        <div className="flex justify-center items-center flex-wrap m-4">
          <p>Search: </p>
          <input
            value={searchKeywords}
            onChange={handleSearch}
            className="px-2 py-1 rounded-full max-lg: ml-1 max-lg:max-w-32 bg-white border-gray-300 border-2 "
          ></input>
        </div>
        <table className="table-fixed w-full text-sm text-left text-gray-500  ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 border-gray-300 border-t-2">
            <tr>
              {headerCells.map((cell) => (
                <th
                  key={cell.name}
                  scope="col"
                  className=" px-6 py-3 max-lg:hidden"
                >
                  <div className="flex items-center text-xs">
                    <div>{cell.name}</div>
                    {cell.sortBy !== undefined && (
                      <div
                        onClick={() =>
                          cell.sortBy &&
                          handleSort(
                            cell.sortBy,
                            sortDirection === "ascending"
                              ? "descending"
                              : "ascending"
                          )
                        }
                        className="pl-2 text-2xl hover:cursor-pointer"
                      >
                        <TbArrowsSort />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {emptyTableCondition && (
              <tr className={"bg-gray-100 border-b "}>
                <td
                  align="center"
                  colSpan={headerCells.length}
                  className="px-6 py-6 max-lg:block bg-white"
                >
                  <span className="ml-2 font-bold text-xl mx-auto">
                    {emptyTableTitle}
                  </span>
                </td>
              </tr>
            )}

            {notFound ? (
              <tr className={"bg-gray-100 border-b "}>
                <td
                  align="center"
                  colSpan={headerCells.length}
                  className="px-6 py-6 max-lg:block bg-white"
                >
                  <span className="ml-2 font-bold text-xl mx-auto">
                    Not found
                  </span>
                </td>
              </tr>
            ) : (
              children
            )}

            {addNewRow}
          </tbody>
        </table>
      </div>
    </>
  );
}
