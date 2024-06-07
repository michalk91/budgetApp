import { useState } from "react";

const usePagination = <T extends Record<string, any>>(data: T[]) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(Infinity);

  const indexOfLastPost = currentPage * rowsPerPage;
  const indexOfFirstPost = indexOfLastPost - rowsPerPage;
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
