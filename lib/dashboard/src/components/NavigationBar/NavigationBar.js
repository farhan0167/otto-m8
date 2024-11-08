import './NavigationBar.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { CiTextAlignJustify, CiLogout } from "react-icons/ci";
import { IoIosGitBranch } from "react-icons/io";
import { IoDocumentTextOutline } from "react-icons/io5";
import { TbLambda } from "react-icons/tb";

import { useAuth } from '../../contexts/AuthContext';

const NavigationBar = () => {
  const {logout} = useAuth();
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
            <CiTextAlignJustify />
          </Button>
          <Link to="/" className="nav-item text-black d-flex align-items-center mb-3">
            <IoIosGitBranch rotate={180}/>
            {!isCollapsed && <span className="nav-text">Create Workflow</span>}
          </Link>

          <Link to="/templates" className="nav-item text-black d-flex align-items-center mb-3">
            <IoDocumentTextOutline />
            {!isCollapsed && <span className="nav-text">Templates</span>}
          </Link>

          <Link to="/lambdas" className="nav-item text-black d-flex align-items-center mb-3">
            <TbLambda />
            {!isCollapsed && <span className="nav-text">Lambdas</span>}
          </Link>
          {isCollapsed && <Link to="/" className="nav-item text-black d-flex align-items-center mb-3">
            {isCollapsed && <CiLogout onClick={logout} />}
          </Link>}
          {!isCollapsed && <Button style={{width: '100%'}} onClick={logout}>Logout</Button>}
        </Nav>
      </Navbar>
    </div>
  );
};

export default NavigationBar;
