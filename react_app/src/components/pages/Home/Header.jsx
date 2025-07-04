// import React from 'react';
// import { FaLaptopCode } from 'react-icons/fa';
// // import '../../../App.css';
// import './homePage.css'

// const Header = () => {
//   return (
//     <header className="header">
//       <div className="logo">
//         <FaLaptopCode size={24} style={{ marginRight: '10px' }} />
//         Vinsys Course Progress Tracker
//       </div>
//       <nav className="nav-links">
//         <a href="#home">Home</a>
//         <a href="#features">Features</a>
//         <a href="#contact">Contact</a>
//       </nav>
//     </header>
//   );
// };

// export default Header;


import React from 'react';
import { FaLaptopCode } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // <-- import Link
import './homePage.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <FaLaptopCode size={24} style={{ marginRight: '10px' }} />
        Vinsys Course Progress Tracker
      </div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/features">Features</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
};

export default Header;
