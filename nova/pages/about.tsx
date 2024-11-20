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

//       <section className="section section-short">
//         <div className="stat-section">
//           <div className="stat-section-item">
//             <figure className="stat-img">
//               <img 
//                 width={277} 
//                 height={220} 
//                 src="https://press.hulu.com/app/uploads/2020/06/Subs_554x440_V1-2.jpg?resize=277,220" 
//                 className="attachment-about-stat size-about-stat" 
//                 alt="Educational Video Platform Image" 
//                 decoding="async" 
//                 loading="lazy" 
//               />
//             </figure>
//             <figcaption className="stat-content">
// 					<h2 className="stat-title"><span className="odometer odometer-auto-theme" data-stat="52"><div className="odometer-inside"><span className="odometer-digit"><span className="odometer-digit-spacer">8</span><span className="odometer-digit-inner"><span className="odometer-ribbon"><span className="odometer-ribbon-inner"><span className="odometer-value">5</span></span></span></span></span><span className="odometer-digit"><span className="odometer-digit-spacer">8</span><span className="odometer-digit-inner"><span className="odometer-ribbon"><span className="odometer-ribbon-inner"><span className="odometer-value">2</span></span></span></span></span></div></span>M</h2>
// 					<p className="stat-description">Paid subscribers in the U.S. (as of September 2024)</p>
// 				</figcaption>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
