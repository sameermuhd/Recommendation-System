import React, { useEffect } from "react";
import "./OrderConfirmation.css";
import Header from "../Components/Header";
import FooterComponent from "../Components/FooterComponent";
import { getSession } from "../utils/SessionUtils";
import { useNavigate } from "react-router-dom";

function OrderConfirmation() {
    const user = getSession();
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("cart");
    }, []);

    const handleContinueShopping = () => {
        navigate("/");
    };

    return (
        <div className="oc-thank-you-container">
            <Header />
            <div className="oc-shipping-info-container">
                <div className="oc-shipping-item">
                    <p>Free shipping above Rs.500</p>
                </div>
                <div className="oc-shipping-item">
                    <p>Free & flexible 15 days return</p>
                </div>
                <div className="oc-shipping-item">
                    <p>Estimated delivery time: 2-7 days</p>
                </div>
            </div>
            <div className="oc-primary-text">
                <h1>THANK YOU!</h1>
                <p>
                    Your order has been successfully confirmed, and a
                    confirmation email will arrive in your{" "}
                    <strong>{user ? user.email : ""}</strong> inbox shortly.
                    We're already preparing your order to ensure it gets to you
                    as soon as possible. While you wait, why not continue
                    exploring our newest collections? Treat yourself to more of
                    what you love and enjoy a seamless shopping experience with
                    us!
                </p>
                <div className="oc-button-container">
                    <button
                        className="oc-order-confirmation-btn"
                        onClick={handleContinueShopping}
                    >
                        CONTINUE SHOPPING
                    </button>
                </div>
                <p className="oc-return-policy-link">
                    <a href="">Read about our return policy</a>
                </p>
            </div>
            <FooterComponent />
        </div>
    );
}

export default OrderConfirmation;
