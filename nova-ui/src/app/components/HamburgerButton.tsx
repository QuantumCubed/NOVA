// src/app/components/HamburgerButton.tsx
import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/solid';

const HamburgerButton: React.FC = () => {
  return (
    <button className="hamburger-button" aria-label="Menu">
      <Bars3Icon className="hamburger-icon" />
    </button>
  );
};

export default HamburgerButton;
