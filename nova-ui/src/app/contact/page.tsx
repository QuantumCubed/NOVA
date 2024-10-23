// src/app/contact/page.tsx

"use client"; // Marks this as a Client Component

import React from "react";
import Header from "../components/Header"; // Adjust the import path as necessary

const ContactPage: React.FC = () => {
  return (
    <div>
      <Header />
      <main className="p-4 mt-16 ml-48">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg mb-4">
          We'd love to hear from you! Please reach out to us through any of the methods below.
        </p>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Email</h2>
            <p className="text-lg">contact@nova.com</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Phone</h2>
            <p className="text-lg">+1 (555) 123-4567</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Address</h2>
            <p className="text-lg">123 NOVA Street, Education City, Knowledge State, 12345</p>
          </div>
        </div>
        {/* Optional: Add a contact form or additional information */}
      </main>
    </div>
  );
};

export default ContactPage;
