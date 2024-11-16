// pages/dashboard.tsx

import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!authContext?.loading && !authContext?.user) {
      router.push("/login");
    }
  }, [authContext, router]);

  if (authContext?.loading) {
    return (
      <div>
        <Navbar />
        <p>Loading...</p>
      </div>
    ); // You can replace this with a spinner or skeleton
  }

  if (!authContext?.user) {
    return null; // Prevent rendering the dashboard content until authenticated
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
