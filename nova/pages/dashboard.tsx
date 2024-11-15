// pages/dashboard.tsx

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authContext?.user) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [authContext, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authContext?.user) {
    return null;
  }

  const { username, first_name, last_name, email, acc_creation_date } = authContext.user;

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">Welcome to Your Dashboard</h1>
        <div className="user-info-card">
          <h2 className="user-info-title">User Information</h2>
          <p className="user-info">
            <strong>Username:</strong> {username}
          </p>
          {first_name && (
            <p className="user-info">
              <strong>First Name:</strong> {first_name}
            </p>
          )}
          {last_name && (
            <p className="user-info">
              <strong>Last Name:</strong> {last_name}
            </p>
          )}
          {email && (
            <p className="user-info">
              <strong>Email:</strong> {email}
            </p>
          )}
          {acc_creation_date && (
            <p className="user-info">
              <strong>Account Created:</strong>{" "}
              {new Date(acc_creation_date).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
