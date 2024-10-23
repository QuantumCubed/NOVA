// src/app/about/page.tsx

"use client"; // Marks this as a Client Component

import React from "react";
import Header from "../components/Header"; // Adjust the import path as necessary

const AboutPage: React.FC = () => {
  return (
    <div>
      <Header />
      <main className="p-4 mt-16 ml-48">
        <h1 className="text-3xl font-bold mb-4">About NOVA</h1>
        <p className="text-lg">
          Welcome to NOVA, your go-to platform for educational videos. Our mission is to provide high-quality content to learners worldwide.
        </p>
        {/* Add more content as needed */}
      </main>
    </div>
  );
};

export default AboutPage;
