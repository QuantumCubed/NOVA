// pages/dashboard.tsx

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Link from "next/link";
import Image from "next/image";

// Define the Channel interface
interface Channel {
  _id: string;
  channel_name: string;
  description: string;
  // Include other fields if necessary
}

export default function Dashboard() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  // State to hold the user's channels with detailed info
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelsLoading, setChannelsLoading] = useState<boolean>(true);
  const [channelsError, setChannelsError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authContext.loading && !authContext.user) {
      router.push("/login");
    }
  }, [authContext, router]);

  useEffect(() => {
    // Fetch channels only if the user is authenticated
    if (!authContext.loading && authContext.user) {
      const fetchChannels = async () => {
        try {
          const response = await fetch("http://localhost:3001/channels", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust if using cookies or other auth methods
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch channels.");
          }

          const data: Channel[] = await response.json();
          setChannels(data);
        } catch (error: any) {
          console.error("Error fetching channels:", error);
          setChannelsError(error.message || "An error occurred.");
        } finally {
          setChannelsLoading(false);
        }
      };

      fetchChannels();
    }
  }, [authContext.loading, authContext.user]);

  if (authContext.loading || channelsLoading) {
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
    // channels_owned, // Removed since we're fetching channels separately
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
                src="/anonymous.jpg" // Replace with user's actual profile picture if available
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
            {channels && channels.length > 0 ? (
              <ul className="channels-list">
                {channels.map((channel) => (
                  <li key={channel._id}>
                    <Link
                      href={`/channels/@${encodeURIComponent(
                        channel.channel_name
                      )}`}
                      passHref
                      legacyBehavior
                    >
                      <a className="channel-link">@{channel.channel_name}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-channels">You have not created any channels.</p>
            )}
            <Link href="/channels" passHref legacyBehavior>
              <button className="create-channel-button">Manage Channels</button>
            </Link>
          </div>
        </div>
        {/* Display error message if channels failed to load */}
        {channelsError && <p className="error-message">{channelsError}</p>}
      </div>
    </div>
  );
}
