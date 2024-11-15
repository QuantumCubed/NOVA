// pages/login.tsx

import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authContext = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authContext) {
      await authContext.login(email, password);
    }
  };

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-content">
        <main className="login-main">
          <h1>Login</h1>
          <form onSubmit={handleSubmit} className="login-form">
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

            <button type="submit">Login</button>
          </form>
        </main>
      </div>
    </div>
  );
}
