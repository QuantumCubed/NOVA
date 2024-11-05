// src/app/components/UserProfileButton.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const UserProfileButton: React.FC = () => {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="relative">
      <button
        className="user-profile-button p-2 focus:outline-none"
        aria-label="User Profile"
        onClick={toggleMenu}
      >
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt="Profile Picture"
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <UserCircleIcon className="user-profile-icon w-8 h-8 text-gray-700" />
        )}
      </button>

      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 animate-fadeSlideIn animate-scaleIn transition duration-200 ease-out"
        >
          {session ? (
            <div className="py-1">
              <p className="px-4 py-2 text-sm text-gray-700">{session.user.name}</p>
              <hr />
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <Link
                href="/account-settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Account Settings
              </Link>
              <button
                onClick={() => signOut()}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="py-1">
              <button
                onClick={() => signIn()}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign In
              </button>
              <Link
                href="/auth/signup"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfileButton;
