// src/app/components/Header.tsx
"use client"; // Marks this as a Client Component

import React, { useState } from 'react';
import HamburgerButton from './HamburgerButton';
import LogoButton from './LogoButton';
import SearchBar from './SearchBar';
import UserProfileButton from './UserProfileButton';
import Sidebar from './Sidebar';

const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className="header-container">
        {/* Left Section: Hamburger Menu and Logo */}
        <div className="header-left-section">
          <HamburgerButton onClick={toggleSidebar} />
          <LogoButton />
        </div>

        {/* Center Section: Search Bar */}
        <div className="header-center-section">
          <SearchBar />
        </div>

        {/* Right Section: User/Profile Button */}
        <div className="header-right-section">
          <UserProfileButton />
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </>
  );
};

export default Header;
