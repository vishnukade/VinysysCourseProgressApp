  // import React from 'react';
  // // import '../../../App.css';
  // import './homePage.css'
  // const Footer = () => {
  //   return (
  //     <footer className="footer">
  //       <p>&copy; 2025 Course Pr...</p>
  //       <div className="footer-links">
  //         <a href="./TermPolicy/Privacy.jsx">Privacy Policy</a>
  //         <a href="#terms">Terms of Service</a>
  //         <a href="#contact-us">Contact Us</a>
  //       </div>
  //     </footer>
  //   );
  // };

  // export default Footer;

  import React from 'react';
import { Link } from 'react-router-dom';
import './homePage.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2025 Course Progress Tracker</p>
      <div className="footer-links">
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms & Conditions</Link>
        <Link to="/contact">Contact Us</Link>
      </div>
    </footer>
  );
};

export default Footer;
