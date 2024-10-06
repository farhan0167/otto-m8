import './NavigationBar.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { FaHome, FaUser, FaCog, FaAlignJustify } from 'react-icons/fa';

const NavigationBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`navigation-bar sidebar-background-color d-flex ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      <Navbar className="text-black flex-column">

        <Nav className="flex-column nav-links">
          <Button
            variant="light"
            onClick={toggleSidebar}
            className="toggle-btn mb-4 text-black"
          >
            <FaAlignJustify />
          </Button>
          <Link to="/" className="nav-item text-black d-flex align-items-center mb-3">
            <FaHome className="nav-icon me-3" />
            {!isCollapsed && <span className="nav-text">Workflow</span>}
          </Link>

          <Link to="/templates" className="nav-item text-black d-flex align-items-center mb-3">
            <FaUser className="nav-icon me-3" />
            {!isCollapsed && <span className="nav-text">Templates</span>}
          </Link>

          <Link to="/settings" className="nav-item text-black d-flex align-items-center mb-3">
            <FaCog className="nav-icon me-3" />
            {!isCollapsed && <span className="nav-text">Settings</span>}
          </Link>
        </Nav>
      </Navbar>
    </div>
  );
};

export default NavigationBar;
