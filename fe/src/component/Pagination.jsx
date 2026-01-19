import React, { memo } from "react";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageClick = (page) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <nav className="pagination-container">
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button onClick={() => handlePageClick(currentPage - 1)}>«</button>
        </li>

        {pages.map((page) => (
          <li
            key={page}
            className={`page-item ${currentPage === page ? "active" : ""}`}
          >
            <button onClick={() => handlePageClick(page)}>{page}</button>
          </li>
        ))}

        <li
          className={`page-item ${
            currentPage === totalPages || totalPages === 0 ? "disabled" : ""
          }`}
        >
          <button onClick={() => handlePageClick(currentPage + 1)}>»</button>
        </li>
      </ul>
    </nav>
  );
};

export default memo(Pagination);
