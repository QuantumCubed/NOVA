// src/app/components/Sidebar.tsx
"use client"; // Marks this as a Client Component

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Correct import for App Directory
import { XMarkIcon } from '@heroicons/react/24/solid';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname(); // Get current path

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
    // Add more links as needed
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 w-64 bg-white shadow-lg h-full z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full" /* Fully hide when closed */
        } transition-transform duration-300 ease-in-out rounded-tr-lg rounded-br-lg`}
        aria-label="Sidebar Navigation"
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-700 focus:outline-none"
          onClick={onClose}
          aria-label="Close Sidebar"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Navigation Links */}
        <nav className="mt-10">
          <ul className="space-y-4 px-6">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block text-gray-700 hover:text-blue-500 transition-colors duration-200 ${
                    pathname === link.href ? "font-semibold text-blue-500" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
