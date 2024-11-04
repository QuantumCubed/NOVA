// src/app/components/Header.tsx
"use client";

import React, { useState } from "react";
import HamburgerButton from "./HamburgerButton";
import LogoButton from "./LogoButton";
import SearchBar from "./SearchBar";
import UserProfileButton from "./UserProfileButton";
import Sidebar from "./Sidebar";
import ColorModeToggle from "./ColorModeToggle";

const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Toggle sidebar open and closed
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false); // Explicitly close sidebar
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

        {/* Right Section: Dark Mode Toggle and User/Profile Button */}
        <div className="color-mode-toggle-container">
          <ColorModeToggle />
        </div>

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
