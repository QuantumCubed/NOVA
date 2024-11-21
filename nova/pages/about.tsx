// pages/about.tsx

// import Navbar from "../components/Navbar";

// export default function About() {
//   return (
//     <div className="about-page">
//       <Navbar />
//       <div className="about-content">
//         <main className="about-main">
//           <h1>About Us</h1>
//           <p>
//             Welcome to <strong>NOVA</strong>, your go-to platform for
//             educational videos. Our mission is to provide high-quality content
//             to learners worldwide.
//           </p>
//           <p>
//             At NOVA, we believe in the power of knowledge and aim to make
//             learning accessible, engaging, and inspiring for everyone.
//           </p>
//           <p>
//             Join us as we explore new horizons in education, from science and
//             technology to arts and culture. NOVA is here to help you expand your
//             knowledge and ignite your curiosity.
//           </p>
//         </main>
//       </div>
//     </div>
//   );
// }


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

        {/* Image Gallery Section */}
        <section className="image-gallery">
          <div className="image-container">
            <figure className="gallery-item">
              <img
                src="https://plus.unsplash.com/premium_photo-1682545693199-918b2ac2f510?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Placeholder 1"
                className="gallery-image"
              />
              <figcaption className="gallery-caption">
                <strong>10+</strong> Users in the U.S.
              </figcaption>
            </figure>
            <figure className="gallery-item">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Placeholder 2"
                className="gallery-image"
              />
              <figcaption className="gallery-caption">
                <strong>10+</strong> Gaming channels
              </figcaption>
            </figure>
            <figure className="gallery-item">
              <img
                src="https://images.unsplash.com/photo-1585692614093-62dab82e9d08?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Placeholder 3"
                className="gallery-image"
              />
              <figcaption className="gallery-caption">
                <strong>10+</strong> Live channels
              </figcaption>
            </figure>
            <figure className="gallery-item">
              <img
                src="https://plus.unsplash.com/premium_photo-1661416307260-5013ab7adc3f?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Placeholder 4"
                className="gallery-image"
              />
              <figcaption className="gallery-caption">
                <strong>4+</strong> Team members
              </figcaption>
            </figure>
          </div>
        </section>
      </div>
    </div>
  );
}