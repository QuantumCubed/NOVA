// src/app/components/Header.tsx
"use client"; // Marks this as a Client Component

import React, { useState } from "react";
import HamburgerButton from "./HamburgerButton";
import LogoButton from "./LogoButton";
import SearchBar from "./SearchBar";
import UserProfileButton from "./UserProfileButton";
import Sidebar from "./Sidebar";
import ColorModeToggle from "./ColorModeToggle"; // Import the toggle component

const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // This will toggle the sidebar open and closed
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false); // This explicitly closes the sidebar
  };

  return (
    <>
      <header className="header-container">
        {/* Left Section: Hamburger Menu and Logo */}
        <div className="header-left-section">
          <HamburgerButton onClick={toggleSidebar} /> {/* Use toggleSidebar */}
          <LogoButton />
        </div>

        {/* Center Section: Search Bar */}
        <div className="header-center-section">
          <SearchBar />
        </div>

        {/* Right Section: Dark Mode Toggle and User/Profile Button */}
        <div className="color-mode-toggle-container">
          <ColorModeToggle /> {/* Placed inside a dedicated div */}
        </div>

        <div className="header-right-section">
          <UserProfileButton />
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} /> {/* Sidebar open state */}
    </>
  );
};

export default Header;
