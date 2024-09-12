import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';  // Import the CSS file
import websiteLogo from '../Data/website-logo.png';

const Header = () => {
  const navigate = useNavigate();
  const reloadPage = () => {
    navigate('/'); // Redirect to the About page
  };

  return (
    <header className="header">
      <img
        src={websiteLogo}
        alt="Logo"
        className="header-image"
        onClick={reloadPage}
      />
    </header>
  );
};

export default Header;
