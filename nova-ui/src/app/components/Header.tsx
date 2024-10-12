// src/app/components/Header.tsx
import React from 'react';
import HamburgerButton from './HamburgerButton';
import LogoButton from './LogoButton';
import SearchBar from './SearchBar';
import UserProfileButton from './UserProfileButton';

const Header: React.FC = () => {
  return (
    <header className="header-container">
      {/* Left Section: Hamburger Menu and Logo */}
      <div className="header-left-section">
        <HamburgerButton />
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
  );
};

export default Header;
