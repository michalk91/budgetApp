import { useCallback, useEffect, useRef, useState } from "react";
import type { SortOptions, TableProps } from "../types";
import { TbArrowsSort, TbArrowsUp, TbArrowsDown } from "react-icons/tb";
import Pagination from "./Pagination";
import useGroupTransition from "../hooks/useGroupTransition";

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
  responsiveBreakpoint = "max-lg",
  currentPage,
  dataLength,
  rowsPerPage,
  setSortGlobal,
  setRowsPerPage,
  setCurrentPage,
  setGlobalRowsPerPage,
  setGlobalCurrentPage,
  handleSearchGlobal,
  disablePageChange = false,
  startSortAnimation,
}: TableProps) {
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

  const [clickedCell, setClickedCell] = useState("");

  const handleSort = useCallback(
    (sortBy: string, sortDirection: "ascending" | "descending" | "without") => {
      setSort &&
        setSort(
          (state) =>
            ({
              ...state,
              sortBy,
              sortDirection,
            } as SortOptions)
        );
      setSortGlobal && setSortGlobal({ sortBy, sortDirection });
    },
    [setSort, setSortGlobal]
  );

  useEffect(() => {
    if (dataLength === rowsPerPage) {
      setCurrentPage && setCurrentPage(1);
      setGlobalCurrentPage && setGlobalCurrentPage(1);
    }
  }, [dataLength, rowsPerPage, setCurrentPage, setGlobalCurrentPage]);

  const {
    updateTransitionDimensions,
    groupTransitionEnd,
    enableTransition,
    disableTransition,
  } = useGroupTransition(tableBodyRef.current, startSortAnimation);

  useEffect(() => {
    if (groupTransitionEnd) disableTransition();
  }, [groupTransitionEnd, disableTransition]);

  return (
    <div>
      <span className="ml-2 font-bold text-xl mx-auto max-md:text-lg">
        {title}
      </span>
      <div className="relative bg-gray-200 text-center overflow-visible border-2 border-slate-300 rounded-lg max-md:mb-6 shadow-xl">
        <div
          className={`mt-4 hidden ${responsiveBreakpoint}:p-4 ${responsiveBreakpoint}:flex flex-wrap justify-center items-center`}
        >
          <p>Sort by: </p>
          {sortDirection !== "without" && (
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
          )}
          <select
            className="px-1 ml-1 self-center rounded-full max-w-full bg-white "
            onChange={(e) =>
              handleSort(
                sortBy,
                e.target.value as "ascending" | "descending" | "without"
              )
            }
            value={sortDirection}
            name="choice"
          >
            <option value="without">without sort</option>
            <option value="ascending">ascending</option>
            <option value="descending">descending</option>
          </select>
        </div>

        <div>
          <div className="flex justify-center sm:space-x-6 items-center flex-wrap m-2">
            <div className="flex items-center justify-center flex-wrap py-2">
              <p>Search: </p>
              <input
                value={searchKeywords}
                onChange={(e) => {
                  handleSearch && handleSearch(e);
                  handleSearchGlobal && handleSearchGlobal(e.target.value);
                }}
                className="px-2 py-1 rounded-full max-lg: ml-1 max-lg:max-w-32 bg-white border-gray-300 border-2 "
              ></input>
            </div>
            <div className="flex items-center justify-center flex-wrap py-2">
              <p>Show per page: </p>
              <select
                className="px-2 py-1 rounded-full max-lg: ml-1 max-lg:max-w-32 bg-white border-gray-300 border-2  "
                onChange={(e) => {
                  setRowsPerPage &&
                    setRowsPerPage(
                      e.target.value === "all"
                        ? Infinity
                        : Number(e.target.value)
                    );
                  setGlobalRowsPerPage &&
                    setGlobalRowsPerPage(
                      e.target.value === "all"
                        ? Infinity
                        : Number(e.target.value)
                    );

                  setCurrentPage && setCurrentPage(1);
                  setGlobalCurrentPage && setGlobalCurrentPage(1);
                }}
                value={rowsPerPage ? rowsPerPage : "all"}
                name="choice"
              >
                <option value="all">all</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>
        </div>

        <table className="table-fixed w-full text-sm text-left text-gray-500  ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 border-gray-300 border-t-2">
            <tr>
              {headerCells.map((cell) => (
                <th
                  key={cell.name}
                  scope="col"
                  className={`select-none px-6 py-3 ${responsiveBreakpoint}:hidden`}
                >
                  <div className="flex items-center text-xs">
                    <div>{cell.name}</div>
                    {cell.sortBy !== undefined && (
                      <div
                        onClick={() => {
                          setClickedCell(cell.name);
                          enableTransition();
                          updateTransitionDimensions();

                          cell.sortBy &&
                            handleSort(
                              cell.sortBy,
                              sortDirection === "without"
                                ? "ascending"
                                : sortDirection === "ascending"
                                ? "descending"
                                : "without"
                            );
                        }}
                        className="pl-2 text-2xl hover:cursor-pointer"
                      >
                        {sortDirection === "without" ? (
                          <TbArrowsSort />
                        ) : cell.name === clickedCell &&
                          sortDirection === "ascending" ? (
                          <TbArrowsDown />
                        ) : cell.name === clickedCell &&
                          sortDirection === "descending" ? (
                          <TbArrowsUp />
                        ) : (
                          <TbArrowsSort />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody ref={tableBodyRef}>
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
        {dataLength > rowsPerPage && (
          <Pagination
            rowsPerPage={rowsPerPage}
            dataLength={dataLength}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage && setCurrentPage}
            setGlobalCurrentPage={setGlobalCurrentPage && setGlobalCurrentPage}
            scrollElementRef={tableBodyRef}
            disablePageChange={disablePageChange}
          />
        )}
      </div>
    </div>
  );
}
