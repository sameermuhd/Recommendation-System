import React from "react";
import "./FooterComponent.css";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import PinterestIcon from "@mui/icons-material/Pinterest";
import FacebookIcon from "@mui/icons-material/Facebook";
import websiteLogo from '../Data/website-logo.png';

const FooterComponent = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <div className="footer-column">
          <h4>SHOP</h4>
          <ul>
            <li>Ladieswear</li>
            <li>Baby/Children</li>
            <li>Menswear</li>
            <li>Sport</li>
            <li>Divided</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>CORPORATE INFO</h4>
          <ul>
            <li>About Tengen group</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>HELP</h4>
          <ul>
            <li>Customer Service</li>
            <li>Legal & Privacy</li>
            <li>Contact</li>
            <li>Report a scam</li>
          </ul>
        </div>
        <div className="footer-column footer-newsletter">
          <p>
            Sign up now and be the first to know about exclusive offers, latest
            fashion news & style tips!
          </p>
          <a href="#">Read more &rarr;</a>
        </div>
      </div>

      <div className="footer-social">
        <div className="social-icons">
          {/* Add social media icons here */}
          <InstagramIcon sx={{ m: 2 }} />
          <YouTubeIcon sx={{ m: 2 }} />
          <PinterestIcon sx={{ m: 2 }} />
          <FacebookIcon sx={{ m: 2 }} />
        </div>
        <div className="footer-copyright">
          <p>
            The content of this site is copyright-protected and is the property
            of Tengen Ltd & Debanjan Kushal Ghosh.
          </p>
          <div className="footer-logo">
            <img
              src={websiteLogo}
              alt="Logo"
              className="footer-image"
            />
          </div>
          <p>INDIA | Rs.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
