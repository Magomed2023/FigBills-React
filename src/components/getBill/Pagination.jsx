import React from 'react';

const Pagination = ({ data, pages, currentPage, onPageChange }) => {


  const handlePageChange = (page) => {
    onPageChange(page);
  };

  return (
    <div className="pagination">
      {Array.from({ length: pages }, (_, index) => index + 1).map(
        (page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={page === currentPage ? 'active' : ''}
          >
            {page}
          </button>
        )
      )}
    </div>
  );
};

export default Pagination;
 