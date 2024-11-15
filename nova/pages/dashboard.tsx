// pages/Dashboard.js

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
    return <div>Loading...</div>; // Show a loading spinner if preferred
  }

  if (!authContext?.user) {
    return null; // Render nothing while redirecting
  }

  const { username, first_name, last_name, email } = authContext.user;

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
        </div>
      </div>
    </div>
  );
}
