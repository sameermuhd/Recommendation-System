import "./ShoppingCart.css";
import Header from "../Components/Header";
import FooterComponent from "../Components/FooterComponent";
import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { getSession } from "../utils/SessionUtils";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../Components/CustomAlert";

const QuantityPicker = ({
    productId,
    initialQuantity = 1,
    onQuantityChange,
}) => {
    const [quantity, setQuantity] = useState(initialQuantity);

    const handleDecrease = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            onQuantityChange?.(productId, newQuantity);
        }
    };

    const handleIncrease = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        onQuantityChange?.(productId, newQuantity);
    };

    return (
        <div className="sc-quantity-picker-container">
            <p className="sc-quantity-label">Quantity</p>
            <div className="sc-quantity-picker">
                <button onClick={handleDecrease} className="sc-quantity-button">
                    -
                </button>
                <span className="sc-quantity-value">{quantity}</span>
                <button onClick={handleIncrease} className="sc-quantity-button">
                    +
                </button>
            </div>
        </div>
    );
};

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const user = getSession();
    const { showAlert } = useAlert();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
        setCartItems(Object.values(storedCart));
    }, []);

    const handleQuantityChange = (articleId, newQuantity) => {
        if (newQuantity < 1) return;

        const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
        if (storedCart[articleId]) {
            storedCart[articleId].quantity = newQuantity;
        }
        localStorage.setItem("cart", JSON.stringify(storedCart));
        setCartItems(Object.values(storedCart));
    };

    const handleRemoveItem = (articleId) => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
        delete storedCart[articleId];
        localStorage.setItem("cart", JSON.stringify(storedCart));
        setCartItems(Object.values(storedCart));
        window.location.reload();
    };

    const handlePlaceOrder = () => {
        if (!user) {
            showAlert(
                "Please login to continue",
                "OK!",
                () => {},
                "error",
                true
            );
        } else {
            navigate("/orderConfirmation");
        }
    };

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <div>
            <Header />
            <div className="sc-shipping-info-container">
                <div className="sc-shipping-item">
                    <p>Free shipping above Rs.500</p>
                </div>
                <div className="sc-shipping-item">
                    <p>Free & flexible 15 days return</p>
                </div>
                <div className="sc-shipping-item">
                    <p>Estimated delivery time: 2-7 days</p>
                </div>
            </div>
            <div className="sc-shopping-cart">
                <h1 className="sc-cart-header">Shopping bag</h1>
                <div className="sc-cart-content">
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        <div className="sc-cart-items">
                            {cartItems.map((item) => (
                                <div
                                    className="sc-cart-item"
                                    key={item.article_id}
                                >
                                    <div className="sc-image-container">
                                        <img
                                            src={`http://localhost:3000/images/${item.article_id}`}
                                            alt={item.prod_name}
                                        />
                                    </div>
                                    <div className="sc-product-details">
                                        <h3>{item.prod_name}</h3>
                                        <p>Rs. XXX.XX</p>
                                        <div className="sc-details-row">
                                            <span>
                                                Category: {item.category}
                                            </span>
                                            <span>Section: {item.section}</span>
                                        </div>
                                        <div className="sc-details-row">
                                            <span>
                                                Colour: {item.colour_group_name}
                                            </span>
                                            <span>Total: Rs. XXXX.XX</span>
                                        </div>
                                        <div className="sc-details-row-last">
                                            <div className="sc-quantity-selector">
                                                <QuantityPicker
                                                    productId={item.article_id}
                                                    initialQuantity={
                                                        item.quantity
                                                    }
                                                    onQuantityChange={
                                                        handleQuantityChange
                                                    }
                                                />
                                            </div>
                                            <button
                                                className="sc-delete-button"
                                                onClick={() =>
                                                    handleRemoveItem(
                                                        item.article_id
                                                    )
                                                }
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {cartItems.length !== 0 && (
                        <div className="sc-cart-summary">
                            {user == null ? (
                                <div>
                                    <p className="sc-signin-offer">
                                        Sign in to use your personal offers!
                                    </p>
                                    <button
                                        className="sc-sign-in-button"
                                        onClick={handleLogin}
                                    >
                                        Sign in
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <p className="sc-signin-offer">
                                        Logged in as{" "}
                                        <strong>{user.email}</strong>
                                    </p>
                                </div>
                            )}

                            <div className="sc-order-details">
                                <div className="sc-order-line">
                                    <span>Order value</span>
                                    <span>Rs. X,XXX.XX</span>
                                </div>
                                <div className="sc-order-line">
                                    <span>Delivery</span>
                                    <span>FREE</span>
                                </div>
                                <hr className="sc-divider" />
                                <div className="sc-total-line">
                                    <span>Total</span>
                                    <span className="sc-total-amount">
                                        Rs. X,XXX.XX
                                    </span>
                                </div>
                            </div>

                            <button
                                className="sc-checkout-button"
                                onClick={handlePlaceOrder}
                            >
                                Continue to checkout
                            </button>

                            <div className="sc-payment-info">
                                <p className="sc-payment-methods">We accept:</p>
                                <div className="sc-payment-icons">
                                    <span>Cash on Delivery</span>
                                </div>
                            </div>

                            <p className="sc-policy">
                                Prices and delivery costs are not confirmed
                                until you've reached the checkout. 15 days free
                                returns. Read more about{" "}
                                <a href="#refund-policy">
                                    return and refund policy
                                </a>
                                .
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <FooterComponent />
        </div>
    );
};

export default ShoppingCart;
