// src/app/components/Sidebar.tsx
"use client"; // Marks this as a Client Component

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FocusTrap from "focus-trap-react";

// Importing Heroicons for navigation
import {
  HomeIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline"; // Using outline icons for better visual

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactElement;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname(); // Get current path

  const links: NavLink[] = [
    {
      href: "/",
      label: "Home",
      icon: <HomeIcon className="w-6 h-6" />,
    },
    {
      href: "/about",
      label: "About",
      icon: <InformationCircleIcon className="w-6 h-6" />,
    },
    {
      href: "/services",
      label: "Services",
      icon: <Cog6ToothIcon className="w-6 h-6" />,
    },
    {
      href: "/contact",
      label: "Contact",
      icon: <EnvelopeIcon className="w-6 h-6" />,
    },
    // Add more links as needed
  ];

  // Handle Escape key to close sidebar
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <FocusTrap active={isOpen}>
      <div className="relative">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        ></div>

        {/* Sidebar */}
        <div
          className={`fixed top-16 left-0 w-48 bg-white shadow-lg h-full z-50 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full" /* Fully hide when closed */
          } transition-transform duration-300 ease-in-out rounded-tr-lg rounded-br-lg`}
          aria-label="Sidebar Navigation"
        >
          {/* Navigation Links */}
          <nav className="mt-10">
            <ul className="space-y-6 px-6">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex flex-col items-center text-gray-700 hover:text-blue-500 transition-colors duration-200 ${
                      pathname === link.href
                        ? "font-semibold text-blue-500"
                        : ""
                    }`}
                  >
                    {link.icon}
                    <span className="mt-1 text-sm">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </FocusTrap>
  );
};

export default Sidebar;
