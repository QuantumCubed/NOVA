// src/app/components/Header.tsx
"use client";

import React, { useState } from "react";
import HamburgerButton from "./HamburgerButton";
import LogoButton from "./LogoButton";
import SearchBar from "./SearchBar";
import UserProfileButton from "./UserProfileButton";
import Sidebar from "./Sidebar";
import ColorModeToggle from "./ColorModeToggle"; // Import the toggle component

const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar initially closed

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Toggle the sidebar open/closed
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false); // Explicitly close the sidebar
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

      {/* Sidebar with isOpen based on state */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </>
  );
};

export default Header;
