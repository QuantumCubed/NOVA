// src/app/components/LogoButton.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const LogoButton: React.FC = () => {
  return (
    <Link href="/" aria-label="Home">
      <div className="logo-link flex items-center space-x-2">
        <Image
          src="/logo.png" // Ensure this path points to your actual logo image
          alt="Logo"
          width={100}
          height={40}
          className="logo-image"
        />
        <span className="logo-text text-xl font-bold text-black">NOVA</span>
      </div>
    </Link>
  );
};

export default LogoButton;
