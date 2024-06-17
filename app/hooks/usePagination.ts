import { useState } from "react";

const usePagination = <T extends Record<string, any>>(
  data: T[],
  globalRowsPerPage?: number,
  globalCurrentPage?: number
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(Infinity);

  let indexOfLastPost, indexOfFirstPost;

  if (globalCurrentPage && globalRowsPerPage) {
    indexOfLastPost = globalCurrentPage * globalRowsPerPage;
    indexOfFirstPost = indexOfLastPost - globalRowsPerPage;
  } else {
    indexOfLastPost = currentPage * rowsPerPage;
    indexOfFirstPost = indexOfLastPost - rowsPerPage;
  }

  const paginatedData = data.slice(indexOfFirstPost, indexOfLastPost);

  return {
    paginatedData,
    setRowsPerPage,
    currentPage,
    rowsPerPage,
    setCurrentPage,
  };
};
export default usePagination;
