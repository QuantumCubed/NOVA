// src/app/components/UserProfileButton.tsx
import React from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const UserProfileButton: React.FC = () => {
  return (
    <button className="user-profile-button p-2 focus:outline-none" aria-label="User Profile">
      <UserCircleIcon className="user-profile-icon w-8 h-8 text-gray-700" />
    </button>
  );
};

export default UserProfileButton;
