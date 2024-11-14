// pages/signup.tsx

import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Signup() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authContext = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authContext) {
      await authContext.signup({
        first_name,
        last_name,
        username,
        email,
        password,
      });
    }
  };

  return (
    <div className="signup-page">
      <Navbar />
      <div className="signup-content">
        <main className="signup-main">
          <h1>Signup</h1>
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="input-group">
              <input
                type="text"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="First Name"
                className="first-name-input"
              />
              <i className="first-name-icon fa fa-user"></i>
            </div>
            <div className="input-group">
              <input
                type="text"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Last Name"
                className="last-name-input"
              />
              <i className="last-name-icon fa fa-user"></i>
            </div>
            <div className="input-group">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Username"
                className="username-input"
              />
              <i className="username-icon fa fa-user-circle"></i>
            </div>
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                className="email-input"
              />
              <i className="email-icon fa fa-envelope"></i>
            </div>
            <div className="input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="password-input"
              />
              <i className="password-icon fa fa-lock"></i>
            </div>
            <button type="submit">Signup</button>
          </form>
        </main>
      </div>
    </div>
  );
}
