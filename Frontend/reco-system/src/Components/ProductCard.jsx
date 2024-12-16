// src/components/ProductCard.js
import React from 'react';
import './ProductCard.css';

function ProductCard({ product }) {
  if (!product.article_id.startsWith("0")) {
    product.article_id = "0" + product.article_id;
}
  const imagePath = `http://localhost:3000/images/${product.article_id}`;

  // Function to encode product information as URL parameters
  const encodeProductInfo = (product) => {
    return encodeURIComponent(JSON.stringify(product));
  };

  return (
    <div className="product-card-pp">
      <img src={imagePath} alt={product.prod_name} className='productImg-pp'/>
      <div className="product-details-pp">
        <h2>{product.prod_name}</h2>
        <p>{product.product_type_name}</p>
        <a href={`/product?product=${encodeProductInfo(product)}`} target = "_blank">View Details</a>
      </div>
    </div>
  );
}

export default ProductCard;
