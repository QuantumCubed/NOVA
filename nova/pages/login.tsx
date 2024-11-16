// pages/login.tsx

import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Login() {
  const [email_log, setEmail] = useState("");
  const [password_log, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (authContext) {
      try {
        await authContext.login({ email_log, password_log });
        router.push("/dashboard");
      } catch (error: any) {
        console.error("Login error:", error);
        setError(error.message || "An error occurred during login.");
      }
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
                value={email_log}
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
                value={password_log}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="password-input"
              />
              <i className="password-icon fa fa-lock"></i>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit">Login</button>
          </form>
        </main>
      </div>
    </div>
  );
}
