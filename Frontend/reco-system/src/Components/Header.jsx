import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';  // Import the CSS file
import websiteLogo from '../Data/website-logo.png';
import { getSession } from '../utils/SessionUtils';

// Icons (You can use react-icons or SVGs)
import { FaBars, FaUserAlt, FaShoppingCart } from 'react-icons/fa';
import { LuUserCircle2 } from "react-icons/lu";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { HiBars3 } from "react-icons/hi2";

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!getSession();

  const reloadPage = () => {
    navigate('/'); // Redirect to the About page
  };

  const handleUserIconClick = () => {
    var destination = isLoggedIn ? '/getUserInfo' : '/login'
    navigate(destination)
  };

  const handleCartIconClick = () => {
    alert('Shopping cart clicked!');
  };
  return (
    <header className="header">
      {/* Hamburger Menu */}
      <div className="header-left">
        <HiBars3 className="icon" />
      </div>

      <div className="header-center">
      <img
        src={websiteLogo}
        alt="Logo"
        className="header-image"
        onClick={reloadPage}
      />
      </div>

      {/* User and Cart Icons */}
      <div className="header-right">
        <LuUserCircle2 className="icon" onClick={handleUserIconClick} />
        <AiOutlineShoppingCart className="icon" onClick={handleCartIconClick} />
      </div>
    </header>
  );
};

export default Header;
