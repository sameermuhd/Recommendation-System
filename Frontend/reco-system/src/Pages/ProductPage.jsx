// src/pages/ProductDetailsPage.js
import React, { useState, useEffect } from "react";
import "./ProductPage.css"; // Import the CSS file for styling
import Header from "../Components/Header";
import FooterComponent from "../Components/FooterComponent";
import ProductCard from "../Components/ProductCard";
import { FaShoppingCart, FaDollarSign, FaShippingFast } from "react-icons/fa"; // Import icons
import { useAlert } from "../Components/CustomAlert";

function ProductPage() {
    const { showAlert } = useAlert();

    // Function to decode product information from URL parameters
    const decodeProductInfo = (encodedProduct) => {
        return JSON.parse(decodeURIComponent(encodedProduct));
    };

    // Parse product information from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productInfo = urlParams.get("product");
    const product = decodeProductInfo(productInfo);
    const imagePath = `http://localhost:3000/images/${product.article_id}`;

    const [additionalProducts, setAdditionalProducts] = useState([]);

    useEffect(() => {
        // Fetch additional product information from the API
        console.log(product.article_id);
        fetch(
            `http://localhost:3000/api/similar-products/${product.article_id}`
        )
            .then((response) => response.json())
            .then((data) => setAdditionalProducts(data))
            .catch((error) =>
                console.error("Error fetching additional products:", error)
            );
    }, []);

    // Add product to session storage
    const addToCart = () => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || {};

        if (storedCart[product.article_id]) {
            // If product already exists, increase the quantity
            storedCart[product.article_id].quantity += 1;
        } else {
            // Add new product to cart
            storedCart[product.article_id] = {
                article_id: product.article_id,
                prod_name: product.prod_name,
                colour_group_name: product.colour_group_name,
                quantity: 1,
                section: product.section_name,
                category: product.product_type_name,
            };
        }

        // Save updated cart back to localStorage
        localStorage.setItem("cart", JSON.stringify(storedCart));
        showAlert(
            "Product added to cart!",
            "OK!",
            () => {},
            "success",
            false
        );
    };

    return (
        <div className="product-details-container">
            <Header />
            <div className="content-container">
                <div className="product-details">
                    <h1 className="page-title">Product Details</h1>
                    <div className="product-info">
                        <img
                            src={imagePath}
                            alt={product.prod_name}
                            className="product-page-image"
                        />
                        <div className="product-description">
                            <section className="product-header">
                                <h2 className="product-title">
                                    {product.prod_name}
                                </h2>
                                <p className="product-type">
                                    Category: {product.product_type_name}
                                </p>
                            </section>

                            <section className="product-specifications">
                                <h3 className="section-title">
                                    Specifications
                                </h3>
                                <div className="spec-grid">
                                    <div className="spec-item">
                                        <strong>Appearance:</strong>{" "}
                                        {product.graphical_appearance_name}
                                    </div>
                                    <div className="spec-item">
                                        <strong>Color:</strong>{" "}
                                        {product.colour_group_name}
                                    </div>
                                    <div className="spec-item">
                                        <strong>Group:</strong>{" "}
                                        {product.product_group_name}
                                    </div>
                                    <div className="spec-item">
                                        <strong>Department:</strong>{" "}
                                        {product.department_name}
                                    </div>
                                    <div className="spec-item">
                                        <strong>Section:</strong>{" "}
                                        {product.section_name}
                                    </div>
                                </div>
                            </section>

                            <section className="product-description-section">
                                <h3 className="section-title">Description</h3>
                                <p className="section-desc-p">
                                    {product.detail_desc}
                                </p>
                            </section>

                            <section className="product-pricing">
                                <h3 className="section-title">Pricing</h3>
                                <div className="pricing-grid">
                                    <p className="delivery-date">
                                        <FaShippingFast
                                            size={22}
                                            style={{ color: "#27ae60" }}
                                        />
                                        <strong> Estimated Delivery:</strong>{" "}
                                        <span>
                                            {new Date(
                                                Date.now() +
                                                    2 * 24 * 60 * 60 * 1000
                                            ).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </p>
                                    <p className="mrp-info">
                                        MRP inclusive of all taxes
                                    </p>
                                    <p className="mrp-amount">Rs. X,XXX.00</p>
                                </div>
                            </section>

                            <div className="product-actions">
                                <button
                                    className="add-to-cart"
                                    onClick={addToCart}
                                >
                                    <FaShoppingCart /> Add to Cart
                                </button>
                                <button className="buy-now">Buy Now</button>
                            </div>
                        </div>
                    </div>
                    <br />
                    <hr />
                    <div className="additional-products">
                        <h1 className="additional-products-title">
                            Recommended Products
                        </h1>
                        <div className="product-list">
                            {additionalProducts.map((product) => (
                                <ProductCard
                                    key={product.article_id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <FooterComponent />
        </div>
    );
}

export default ProductPage;
