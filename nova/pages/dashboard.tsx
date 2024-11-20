// pages/dashboard.tsx

import { useContext, useEffect, useState, ChangeEvent, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";

interface Channel {
  _id: string;
  channel_name: string;
  description: string;
  // Add other fields if necessary
}

const Dashboard = () => {
  // **1. Declare all Hooks at the top level, unconditionally**
  const { user, loading, refetchUser } = useContext(AuthContext);

  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelsLoading, setChannelsLoading] = useState<boolean>(true);
  const [channelsError, setChannelsError] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [imageError, setImageError] = useState(false); // Hook for image error

  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference to the hidden file input

  // **2. Fetch channels owned by the user**
  useEffect(() => {
    const fetchChannels = async () => {
      if (user && user.channels_owned.length > 0) {
        try {
          const response = await fetch("http://localhost:3001/channels", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      } else {
        setChannelsLoading(false);
      }
    };

    fetchChannels();
  }, [user]);

  // **3. Profile Picture Upload Handlers**
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Validate file type (optional)
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, and GIF files are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("profile_pic", file);

    setIsUploading(true);

    try {
      const response = await fetch("http://localhost:3001/profile/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to upload profile picture."
        );
      }

      toast.success("Profile picture updated successfully!");

      // Refetch user data to get the updated profile picture
      await refetchUser();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "An error occurred during upload.");
    } finally {
      setIsUploading(false);
      // Reset the file input value to allow uploading the same file again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // **4. Image Error Handler**
  const handleImageError = () => {
    setImageError(true);
  };

  // **5. Handle Logout**
  const handleLogout = () => {
    // Assuming Navbar handles logout, this can be removed or kept as per your implementation
    // If you want a logout button here, ensure it's implemented correctly
  };

  // **6. Render Component**
  if (loading || channelsLoading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Already redirected to login via AuthContext
  }

  const {
    username,
    first_name,
    last_name,
    email,
    acc_creation_date,
    UID, // Ensure UID is available
    pfp_src, // Profile picture source
  } = user;

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
                src={
                  imageError || !pfp_src
                    ? "/anonymous.jpg" // Fallback for new users or image errors
                    : `http://localhost:3001/${UID}/profile_picture?${new Date().getTime()}`
                }
                alt="Profile Picture"
                width={200}
                height={200}
                className="profile-picture"
                onError={handleImageError} // Handle image load errors
              />

              <button
                className="edit-profile-picture-button"
                onClick={handleButtonClick}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Edit Profile Picture"}
              </button>
              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
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
              <p>You have not created any channels yet.</p>
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
};

export default Dashboard;
