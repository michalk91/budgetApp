import { useEffect } from "react";
import type { PaginationProps } from "../types";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination = ({
  rowsPerPage,
  dataLength,
  currentPage,
  setCurrentPage,
  scrollElementRef,
  setGlobalCurrentPage,
  addedElemID,
}: PaginationProps) => {
  const paginationNumber = [];

  useEffect(() => {
    if (addedElemID === "") return;

    if (dataLength >= rowsPerPage) {
      setCurrentPage && setCurrentPage(paginationNumber.length);
      setGlobalCurrentPage && setGlobalCurrentPage(paginationNumber.length);
    }
  }, [
    dataLength,
    rowsPerPage,
    paginationNumber.length,
    setCurrentPage,
    setGlobalCurrentPage,
    addedElemID,
  ]);

  for (let i = 1; i <= Math.ceil(dataLength / rowsPerPage); i++) {
    paginationNumber.push(i);
  }

  const scrollToElement = () => {
    setTimeout(() =>
      scrollElementRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    );
  };

  const handlePagination = (pageNumber: number) => {
    setCurrentPage && setCurrentPage(pageNumber);
    setGlobalCurrentPage && setGlobalCurrentPage(pageNumber);

    scrollToElement();
  };

  const nextPage = () => {
    if (currentPage < paginationNumber.length) {
      setCurrentPage && setCurrentPage((page: number) => page + 1);
      setGlobalCurrentPage && setGlobalCurrentPage(currentPage + 1);
    }
    scrollToElement();
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage && setCurrentPage((page: number) => page - 1);
      setGlobalCurrentPage && setGlobalCurrentPage(currentPage - 1);
    }
    scrollToElement();
  };

  return (
    <div className="flex items-center justify-center flex-wrap w-full text-center px-2">
      <button onClick={prevPage}>
        <IoIosArrowBack size={30} />
      </button>
      {paginationNumber.map((data) => (
        <button
          key={data}
          onClick={() => handlePagination(data)}
          className={`px-3 py-1 my-2 mx-1 rounded-full   ${
            currentPage === data
              ? "bg-slate-400 cursor-default"
              : "bg-transparent hover:underline underline-offset-4"
          }`}
        >
          {data}
        </button>
      ))}
      <button onClick={nextPage}>
        <IoIosArrowForward size={30} />
      </button>
    </div>
  );
};
export default Pagination;
