import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import FilterComponent from '../Components/FilterComponent';
import FooterComponent from '../Components/FooterComponent';
import './HomePage.css';  // Import the CSS file for HomePage
import poster01 from '../Data/poster-01.png'
import poster02 from '../Data/poster-02.png'

const HomePage = () => {
  const navigate = useNavigate();

  const handleFilterSelect = (filter) => {
    navigate('/productsCollection'); // Redirect to the About page
  };

  return (
    <div className="home-page">
      <Header />
      <FilterComponent onFilterSelect={handleFilterSelect} />
      <div className="images-container">
        <img src={poster01} alt="Image 1" className="image-section-first" />
        <img src={poster02} alt="Image 2" className="image-section-second" />
      </div>
      <FooterComponent />
    </div>
  );
};

export default HomePage;
