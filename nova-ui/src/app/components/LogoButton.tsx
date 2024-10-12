// src/app/components/LogoButton.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const LogoButton: React.FC = () => {
  return (
    <Link href="/" aria-label="Home">
      <div className="logo-link">
        <Image
          src="/logo.png"
          alt="Logo"
          width={100}
          height={40}
          className="logo-image"
        />
        <span className="logo-text">NOVA</span>
      </div>
    </Link>
  );
};

export default LogoButton;
