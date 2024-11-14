// pages/contact.tsx

import Navbar from "../components/Navbar";

export default function Contact() {
  return (
    <div className="contact-page">
      <Navbar />
      <div className="contact-content">
        <main className="contact-main">
          <h1>Contact Us</h1>
          <p>
            We'd love to hear from you! Please reach out to us through any of
            the methods below.
          </p>
          <div className="contact-details">
            <div>
              <h2>Email</h2>
              <p>contact@nova.com</p>
            </div>
            <div>
              <h2>Phone</h2>
              <p>+1 (555) 123-4567</p>
            </div>
            <div>
              <h2>Address</h2>
              <p>123 NOVA Street, Education City, Knowledge State, 12345</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
