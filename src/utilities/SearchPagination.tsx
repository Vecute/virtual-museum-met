import React from "react";
import "../styles/searchPagination.scss";

interface PaginationProps {
  totalPages: number; 
  currentPage: number;
  onPageChange: (page: number) => void; 
}

const SearchPagination: React.FC<PaginationProps> = ({
  totalPages: initialTotalPages,
  currentPage,
  onPageChange,
}) => {

  const totalPages = Math.min(initialTotalPages, 50); // Ограничиваем количество страниц до 50
  
  const renderPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <li
            key={i} 
            className={currentPage === i ? "active" : ""} 
            onClick={() => onPageChange(i)} 
          >
            {i}
          </li>
        );
      }
    } else {
      pageNumbers.push(
        <li
          key={1}
          className={currentPage === 1 ? "active" : ""}
          onClick={() => onPageChange(1)}
        >
          1
        </li>
      );

      if (currentPage > 3) {
        pageNumbers.push(
          <li className="search-pagination__ellipsis" key="dots-start">
            ...
          </li>
        );
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <li
            key={i}
            className={currentPage === i ? "active" : ""}
            onClick={() => onPageChange(i)}
          >
            {i}
          </li>
        );
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push(
          <li className="search-pagination__ellipsis" key="dots-end">
            ...
          </li>
        );
      }

      pageNumbers.push(
        <li
          key={totalPages}
          className={currentPage === totalPages ? "active" : ""}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </li>
      );
    }

    return pageNumbers;
  };

  return <ul className="search-pagination">{renderPageNumbers()}</ul>;
};

export default SearchPagination;