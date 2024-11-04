// src/app/components/Sidebar.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, InformationCircleIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

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
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mount component to allow animation
    if (isOpen) {
      setIsMounted(true);
    }
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsMounted(false);
    }
  };

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

  // Manage focus trapping
  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      sidebarRef.current.focus();
    }
  }, [isOpen]);

  const links: NavLink[] = [
    { href: "/", label: "Home", icon: <HomeIcon className="w-6 h-6" /> },
    { href: "/about", label: "About", icon: <InformationCircleIcon className="w-6 h-6" /> },
    { href: "/contact", label: "Contact", icon: <EnvelopeIcon className="w-6 h-6" /> },
  ];

  if (!isMounted) return null; // Only render sidebar when mounted

  return (
    <div className="relative">
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-16 left-0 w-48 bg-white dark:bg-black dark:text-[#f4f4f4] shadow-lg h-full z-50 transform transition-transform duration-300 ease-in-out rounded-tr-lg rounded-br-lg ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar Navigation"
        onAnimationEnd={handleAnimationEnd}
        tabIndex={-1} // Make sidebar focusable for focus trap
      >
        {/* Navigation Links */}
        <nav className="mt-10">
          <ul className="space-y-6 px-6">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex flex-col items-center text-gray-700 dark:text-[#f4f4f4] hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 ${
                    pathname === link.href
                      ? "font-semibold text-blue-500 dark:text-blue-400"
                      : ""
                  }`}
                  onClick={onClose} // Close sidebar on link click
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
  );
};

export default Sidebar;
