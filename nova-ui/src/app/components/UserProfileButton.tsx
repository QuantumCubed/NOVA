// src/app/components/UserProfileButton.tsx
import React from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const UserProfileButton: React.FC = () => {
  return (
    <button className="user-profile-button" aria-label="User Profile">
      <UserCircleIcon className="user-profile-icon" />
    </button>
  );
};

export default UserProfileButton;