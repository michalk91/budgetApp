import type { PaginationProps } from "../types";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination = ({
  rowsPerPage,
  dataLength,
  currentPage,
  setCurrentPage,
  scrollElementRef,
}: PaginationProps) => {
  const paginationNumber = [];
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
    setCurrentPage(pageNumber);
    scrollToElement();
  };

  const nextPage = () => {
    currentPage < paginationNumber.length &&
      setCurrentPage((page: number) => page + 1);
    scrollToElement();
  };

  const prevPage = () => {
    currentPage > 1 && setCurrentPage((page: number) => page - 1);
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
