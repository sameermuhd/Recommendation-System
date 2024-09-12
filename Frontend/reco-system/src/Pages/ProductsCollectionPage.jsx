// Import necessary React components and styles
import React, { useState, useEffect } from "react";
import ProductCard from "../Components/ProductCard";
import Header from "../Components/Header";
import FilterComponent from "../Components/FilterComponent";
import FooterComponent from '../Components/FooterComponent';
import "./ProductsCollectionPage.css";

function ProductsCollectionPage() {
  const productsPerPage = 20;
  const [products, setProducts] = useState([]);
  const [start, setStartIndex] = useState(0);
  const [end, setEndIndex] = useState(productsPerPage);
  const [hasMore, setHasMore] = useState(false);
  const [filter, setFilter] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Function to fetch data from the API
  const fetchProducts = async (startValue, endValue, filterValue) => {
    try {
      let url = `http://localhost:3000/api/products?start=${startValue}&end=${endValue}`;
      if (filterValue) {
        url += `&filter=${encodeURIComponent(filterValue)}`; // Add filter to API call
      }
      const response = await fetch(url);
      const data = await response.json();

      // Append the new products to the existing list
      setProducts((prevProducts) => [...prevProducts, ...data.products]);
      setHasMore(data.has_more); // Update if more products are available
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch initial products on component mount
  useEffect(() => {
    fetchProducts(start, end, filter);
  }, [filter]);

  // Function to load more products
  const handleLoadMore = () => {
    const newStart = end;
    const newEnd = end + productsPerPage;
    fetchProducts(newStart, newEnd, filter);

    // Update start and end indices for future requests
    setStartIndex(newStart);
    setEndIndex(newEnd);
  };

  // Handle filter selection from FilterComponent
  const handleFilterSelect = (selectedFilter) => {
    setProducts([]); // Reset the product list
    setStartIndex(0); // Reset the start index
    setEndIndex(productsPerPage); // Reset the end index
    setFilter(selectedFilter); // Update the filter to refetch products based on this
  };

  // Function to handle scroll event and toggle the scroll button visibility
  const handleScroll = () => {
    if (window.scrollY > 300) {
      // Show button when scrolled more than 300px
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  // Attach scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Clean up the event listener
    };
  }, []);

  // Function to scroll the user back to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll effect
    });
  };

  return (
    <div className="homepage-container">
      <Header />
      <FilterComponent onFilterSelect={handleFilterSelect} />
      <div className="content-container">
        <div className="product-list">
          {products.map((product) => (
            <ProductCard key={product.article_id} product={product} />
          ))}
        </div>
        <div className="loadButtonDiv">
          <button
            disabled={!hasMore}
            className="load-more-btn"
            onClick={handleLoadMore}
          >
            Load More Products
          </button>
        </div>

        {/* Scroll to Top Button */}
        {showScrollButton && (
          <button onClick={scrollToTop} className="scroll-to-top-btn">
            Scroll to Top
          </button>
        )}
      </div>
      <FooterComponent />
    </div>
  );
}

export default ProductsCollectionPage;
