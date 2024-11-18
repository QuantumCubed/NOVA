import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Link from "next/link";
import Image from "next/image";

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
    );
  }

  if (!authContext.user) {
    return null;
  }

  const {
    username,
    first_name,
    last_name,
    email,
    acc_creation_date,
    channels_owned,
  } = authContext.user;

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">Welcome to Your Dashboard</h1>
        <div className="cards-container">
          {/* User Information Card */}
          <div className="user-info-card">
            <div className="user-info-section">
              <h2 className="user-info-title">
                <strong>User Information</strong>
              </h2>
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

            {/* Profile Picture Section */}
            <div className="profile-picture-section">
              <Image
                src="/anonymous.jpg"
                alt="Anonymous Profile"
                width={200}
                height={200}
                className="profile-picture"
              />
              <button className="edit-profile-picture-button">
                Edit Profile Picture
              </button>
            </div>
          </div>

          {/* Channels Card */}
          <div className="user-info-card">
            <h2 className="user-info-title-channels">
              <strong>Your Channels</strong>
            </h2>
            {channels_owned && channels_owned.length > 0 ? (
              <ul className="channels-list">
                {channels_owned.map((channelId) => (
                  <li key={channelId}>
                    <Link
                      href={`/channels/${channelId}`}
                      passHref
                      legacyBehavior
                    >
                      <a className="channel-link">Channel ID: {channelId}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>You have not created any channels yet.</p>
            )}
            <Link href="/channels" passHref legacyBehavior>
              <button className="create-channel-button">Manage Channels</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
