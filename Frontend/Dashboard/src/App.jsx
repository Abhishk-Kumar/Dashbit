import React from 'react';
import {
  FaTachometerAlt, FaChartLine, FaShoppingCart, FaEnvelope, FaUsers, FaFileInvoice,
  FaCogs, FaBell, FaUser, FaSearch, FaCalendarAlt, FaTasks, FaLock, FaBook, FaTools
} from 'react-icons/fa';
import './App.css';
import DataDisplay from './DataDisplay';  // Import the DataDisplay component

const App = () => {
  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <img src="https://via.placeholder.com/50" alt="Logo" className="logo" /> {/* Replace with any good logo */}
          <h2>Dashbit</h2>
        </div>
        <ul className="menu">
          <li><button className="inactive"><FaTachometerAlt /> Dashboard</button></li>
          <li><button className="inactive"><FaChartLine /> Analytics</button></li>
          <li><button className="inactive"><FaShoppingCart /> eCommerce</button></li>
          <li><button className="inactive"><FaEnvelope /> Email</button></li>
          <li><button className="inactive"><FaUsers /> Users</button></li>
          <li><button className="inactive"><FaFileInvoice /> Invoices</button></li>
          <li><button className="inactive"><FaTasks /> Tasks</button></li>
          <li><button className="inactive"><FaCalendarAlt /> Calendar</button></li>
          <li><button className="inactive"><FaBell /> Notifications</button></li>
          <li><button className="inactive"><FaCogs /> Settings</button></li>
          <li><button className="inactive"><FaLock /> Access Control</button></li>
          <li><button className="inactive"><FaBook /> Documentation</button></li>
          <li><button className="inactive"><FaTools /> Extensions</button></li>
          <li><button className="inactive">Help Support</button></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navbar */}
        <div className="navbar">
          <div className="search-bar">
            <FaSearch className="search-icon" /> {/* Search Icon Inside */}
            <input type="text" className="search-input" placeholder="Search..." />
          </div>
          <div className="navbar-icons">
            <button><FaBell /></button>
            <button><FaUser /></button>
            <button><FaCogs /></button>
          </div>
        </div>

        {/* DataDisplay Component - Showing the graphs */}
        <div className="content-area">
          <DataDisplay />  {/* Embedding DataDisplay component */}
        </div>
      </div>
    </div>
  );
};

export default App;

