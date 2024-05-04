// Import necessary React components and styles
import React, { useState, useEffect } from 'react';
import ProductCard from '../Components/ProductCard';
import Header from '../Components/Header';
import PaginationBar from '../Components/PaginationBar'; // Import the PaginationBar component
import './HomePage.css';

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsData, setProductsData] = useState([]);

  const pageLimit = 80; // Number of products per page

  useEffect(() => {
    // Load products data for the current page
    loadProductsData(currentPage);
  }, [currentPage]); // Reload data whenever currentPage changes

  useEffect(() => {
    // Scroll to the top of the page when currentPage changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const loadProductsData = async (page) => {
    try {
      const pageData = await import(`../Data/product_json_files/page_${page}.json`);
      setProductsData(pageData.default); // Default export of the dynamically imported module
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="homepage-container">
      <Header />
      <div className="content-container">
        <PaginationBar currentPage={currentPage} prevPage={prevPage} nextPage={nextPage} /> {/* PaginationBar at top */}
        <div className="product-list">
          {productsData.map(product => (
            <ProductCard key={product.article_id} product={product} />
          ))}
        </div>
        <PaginationBar currentPage={currentPage} prevPage={prevPage} nextPage={nextPage} /> {/* PaginationBar at bottom */}
      </div>
    </div>
  );
}

export default HomePage;
