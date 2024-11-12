import React, { useState, useEffect } from 'react';
import { IoSettingsOutline } from "react-icons/io5";
import { clearChatHistory } from './Utils/fetchUtils';

const DropdownButton = ({setChatHistory, deploymentUrl}) => {
    const [isOpen, setIsOpen] = useState(false);
  
    // Toggle dropdown visibility
    const toggleDropdown = () => setIsOpen(!isOpen);
  
    return (
      <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        {/* Button for toggling the dropdown */}
        <button
          onClick={toggleDropdown}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '15px',
            fontSize: '20px',
            cursor: 'pointer',
          }}
        >
          <IoSettingsOutline  
          style={{
            transition: 'transform 0.3s ease', // Add transition for smooth rotation
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', // Rotate based on dropdown state
          }}
          size={30}/>
        </button>
  
        {/* Dropdown options */}
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: '60px', // Position the dropdown above the button
              right: '0',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              padding: '10px',
              zIndex: 1000, // Ensure dropdown is above other elements
              width: '200px',
            }}
          >
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li 
              style={{ padding: '8px', cursor: 'pointer' }}
              onClick={() => clearChatHistory(setChatHistory, deploymentUrl)}
              >Clear Conversation</li>
            </ul>
          </div>
        )}
      </div>
    );
  };

export default DropdownButton