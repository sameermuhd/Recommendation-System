import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import FilterComponent from '../Components/FilterComponent';
import FooterComponent from '../Components/FooterComponent';
import './HomePage.css';  // Import the CSS file for HomePage
import poster01 from '../Data/poster-01.png'
import poster02 from '../Data/poster-02.png'
import poster03 from '../Data/poster-03.svg'
import poster04 from '../Data/poster-04.svg'
import poster05 from '../Data/poster-05.svg'

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Header />
      <div className="images-container">
        <img src={poster03} alt="Image 1" className="image-section-first" />
        <img src={poster04} alt="Image 1" className="image-section-first" />
        <img src={poster05} alt="Image 1" className="image-section-first" />
      </div>
      <FooterComponent />
    </div>
  );
};

export default HomePage;
