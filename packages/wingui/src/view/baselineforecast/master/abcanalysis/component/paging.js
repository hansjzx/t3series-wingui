import React, { useState } from "react"; 
import '../css/paging.css'; 
import Pagination from "react-js-pagination"; 

const Paging = ({ currentPage,
                  totalPages,
                  pageSize,
                  setCurrentPage 
  }) => { 

  const handlePageChange = (pageNum) => { 
    setCurrentPage(pageNum); 
  };
  // const handlePageSizeChange = (event) => {
  //   setPageSize(event.target.value);
  //   setCurrentPage(1);
  // }
  

  return ( 
    <Pagination 
      activePage={currentPage} 
      itemsCountPerPage={pageSize} 
      totalItemsCount={totalPages*pageSize} 
      pageRangeDisplayed={5} 
      prevPageText={"‹"} 
      nextPageText={"›"} 
      onChange={handlePageChange} 
    /> 
  ); 
}; 

export default Paging;