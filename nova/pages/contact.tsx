// // pages/contact.tsx

// import Navbar from "../components/Navbar";

// export default function Contact() {
//   return (
//     <div className="contact-page">
//       <Navbar />
//       <div className="contact-content">
//         <main className="contact-main">
//           <h1>Contact Us</h1>
//           <p>
//             We'd love to hear from you! Please reach out to us through any of
//             the methods below.
//           </p>
//           <div className="contact-details">
//             <div>
//               <h2>Email</h2>
//               <p>contact@nova.com</p>
//             </div>
//             <div>
//               <h2>Phone</h2>
//               <p>+1 (555) 123-4567</p>
//             </div>
//             <div>
//               <h2>Address</h2>
//               <p>123 NOVA Street, Education City, Knowledge State, 12345</p>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }



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
            the methods below or fill out the form to send us a direct message.
          </p>
          <div className="contact-container">
            {/* Contact Details */}
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
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2396.025967976208!2d-77.11442154630305!3d38.83885448709564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1732082944632!5m2!1sen!2sus"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Nova Location Map"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-container">
              <h2>Contact Us</h2>
              <form action="https://formspree.io/f/xgveznjw" method="post" id="contactForm" noValidate>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    required
                  />
                  <span className="error-message" id="nameError"></span>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your Email"
                    required
                  />
                  <span className="error-message" id="emailError"></span>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Your Phone Number"
                    required
                  />
                  <span className="error-message" id="phoneError"></span>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Your Message"
                    rows={5}
                    required
                  ></textarea>
                  <span className="error-message" id="messageError"></span>
                </div>
                <button type="submit" className="submit-button">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

