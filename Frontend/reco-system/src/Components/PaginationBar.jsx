import React from 'react';
import './PaginationBar.css'; // Import CSS file

function PaginationBar({ currentPage, prevPage, nextPage }) {
  return (
    <div className="pagination">
      <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
      <span>Page {currentPage}</span>
      <button onClick={nextPage}>Next</button>
    </div>
  );
}

export default PaginationBar;
