// src/pages/ProductDetailsPage.js
import React, { useState, useEffect } from 'react';
import './ProductPage.css'; // Import the CSS file for styling
import Header from '../Components/Header';
import ProductCard from '../Components/ProductCard';

function ProductPage() {
  // Function to decode product information from URL parameters
  const decodeProductInfo = (encodedProduct) => {
    return JSON.parse(decodeURIComponent(encodedProduct));
  };

  // Parse product information from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const productInfo = urlParams.get('product');
  const product = decodeProductInfo(productInfo);
  const imagePath = `http://localhost:3000/images/${product.article_id}`;

  const [additionalProducts, setAdditionalProducts] = useState([]);

  useEffect(() => {
    // Fetch additional product information from the API
    fetch(`http://localhost:3000/api/similar-products/${product.article_id}`)
      .then(response => response.json())
      .then(data => setAdditionalProducts(data))
      .catch(error => console.error('Error fetching additional products:', error));
  }, []);

  return (
    <div className="product-details-container">
      <Header />
      <div className="content-container">
        {/* Display product details */}
        <div className="product-details">
          <h1 className="page-title">Product Details</h1>
          <div className="product-info">
            <img src={imagePath} alt={product.prod_name} className="product-page-image" />
            <div className="product-description">
              <h2 className="product-title">{product.prod_name}</h2>
              <p className="product-type">{product.product_type_name}</p>
              <hr></hr>
              <p> {product.graphical_appearance_name}</p>
              <p> {product.colour_group_name}</p>
              <p> {product.product_group_name}</p>
              <p> {product.department_name}</p>
              <p> {product.section_name}</p>
              <hr></hr>
              <p> {product.detail_desc}</p>
            </div>
          </div>
          <br></br>
          <hr></hr>
          <div className="additional-products">
            <h1 className="additional-products-title">Recommended Products</h1>
            <div className="product-list">
            {additionalProducts.map(product => (
              <ProductCard key={product.article_id} product={product} />
            ))}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
