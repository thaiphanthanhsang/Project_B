import React, { memo } from "react";


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageClick = (page) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <nav className="flex justify-center">
      <ul className="flex items-center space-x-2">
        <li>
          <button 
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${
                currentPage === 1 
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-blue-600"
            }`}
          >
            «
          </button>
        </li>

        {pages.map((page) => (
          <li key={page}>
            <button 
                onClick={() => handlePageClick(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border font-medium transition-all duration-200 ${
                    currentPage === page
                    ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-105"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300"
                }`}
            >
                {page}
            </button>
          </li>
        ))}

        <li>
          <button 
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${
                currentPage === totalPages || totalPages === 0
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-blue-600"
            }`}
          >
            »
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default memo(Pagination);
