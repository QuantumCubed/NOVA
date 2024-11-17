// pages/dashboard.tsx

import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Link from "next/link";
import styles from "../styles/Dashboard.module.css"; // Ensure this CSS module exists

export default function Dashboard() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!authContext.loading && !authContext.user) {
      router.push("/login");
    }
  }, [authContext, router]);

  if (authContext.loading) {
    return (
      <div>
        <Navbar />
        <p>Loading...</p>
      </div>
    ); // You can replace this with a spinner or skeleton
  }

  if (!authContext.user) {
    return null; // Prevent rendering the dashboard content until authenticated
  }

  const { username, first_name, last_name, email, acc_creation_date, channels_owned } = authContext.user;

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
              <strong>Account Created:</strong> {new Date(acc_creation_date).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="channels-section">
          <h2>Your Channels</h2>
          {channels_owned && channels_owned.length > 0 ? (
            <ul className="channels-list">
              {channels_owned.map((channelId) => (
                <li key={channelId}>
                  <Link href={`/channels/${channelId}`} passHref legacyBehavior>
                    <a className="channel-link">Channel ID: {channelId}</a>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>You have not created any channels yet.</p>
          )}
          {/* Add a button/link to navigate to Channels page */}
          <Link href="/channels" passHref legacyBehavior>
            <button className="create-channel-button">Manage Channels</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
