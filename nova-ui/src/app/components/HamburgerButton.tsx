// src/app/components/HamburgerButton.tsx
"use client"; // Marks this as a Client Component

import React from "react";
import { Bars3Icon } from "@heroicons/react/24/solid";

interface HamburgerButtonProps {
  onClick: () => void;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ onClick }) => {
  return (
    <button
      className="hamburger-button flex items-center justify-center p-2 focus:outline-none"
      aria-label="Toggle Menu"
      onClick={onClick}  // Keeps the original functionality
    >
      <Bars3Icon className="hamburger-icon w-6 h-6 text-black" />
    </button>
  );
};

export default HamburgerButton;

