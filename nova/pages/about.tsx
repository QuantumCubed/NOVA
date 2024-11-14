// pages/about.tsx

import Navbar from "../components/Navbar";

export default function About() {
  return (
    <div className="about-page">
      <Navbar />
      <div className="about-content">
        <main className="about-main">
          <h1>About Us</h1>
          <p>
            Welcome to <strong>NOVA</strong>, your go-to platform for
            educational videos. Our mission is to provide high-quality content
            to learners worldwide.
          </p>
          <p>
            At NOVA, we believe in the power of knowledge and aim to make
            learning accessible, engaging, and inspiring for everyone.
          </p>
          <p>
            Join us as we explore new horizons in education, from science and
            technology to arts and culture. NOVA is here to help you expand your
            knowledge and ignite your curiosity.
          </p>
        </main>
      </div>
    </div>
  );
}
