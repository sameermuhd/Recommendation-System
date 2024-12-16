import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css"; // Import the CSS file
import websiteLogo from "../Data/website-logo.png";
import { getSession } from "../utils/SessionUtils";
import FilterComponent from "../Components/FilterComponent";

// Icons (You can use react-icons or SVGs)
import { FaBars, FaUserAlt, FaShoppingCart } from "react-icons/fa";
import { BsCart2, BsPerson } from "react-icons/bs";
import { IoBagHandleOutline } from "react-icons/io5";
import { LuUserCircle2 } from "react-icons/lu";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { HiBars3 } from "react-icons/hi2";

const Header = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!getSession();

    const reloadPage = () => {
        navigate("/"); // Redirect to the About page
    };

    const handleUserIconClick = () => {
        var destination = isLoggedIn ? "/getUserInfo" : "/login";
        navigate(destination);
    };

    const handleShopNowClick = () => {
      navigate("/productsCollection")
    }

    const handleCartIconClick = () => {
        navigate("/shoppingCart");
    };

    const handleFilterSelect = (filter) => {
        navigate("/productsCollection"); // Redirect to the About page
    };

    return (
        <header className="header">
            {/* Hamburger Menu */}
            <div className="header-left">
                <img
                    src={websiteLogo}
                    alt="Logo"
                    className="header-image"
                    onClick={reloadPage}
                />
            </div>

            <div className="header-center"></div>

            {/* User and Cart Icons */}
            <div className="header-right">
                <button className="header-button" onClick={handleShopNowClick}>
                    <BsCart2 className="icon" /> Shop Now
                </button>
                <button className="header-button" onClick={handleUserIconClick}>
                    <BsPerson className="icon" /> {isLoggedIn ? "Account" : "Sign in"}
                </button>
                <button className="header-button" onClick={handleCartIconClick}>
                    <IoBagHandleOutline className="icon" /> Shopping Bag 
                </button>
            </div>
        </header>
    );
};

export default Header;
