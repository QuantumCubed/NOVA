// pages/dashboard.tsx

import {
  useContext,
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
  useRef,
} from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify"; // Import toast for notifications

// Define the Channel interface
interface Channel {
  _id: string;
  channel_name: string;
  description: string;
  // Include other fields if necessary
}

export default function Dashboard() {
  const { user, loading, refetchUser } = useContext(AuthContext);
  const router = useRouter();

  // State to hold the user's channels with detailed info
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelsLoading, setChannelsLoading] = useState<boolean>(true);
  const [channelsError, setChannelsError] = useState<string | null>(null);

  // States for profile picture upload
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference to the hidden file input

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    // Fetch channels only if the user is authenticated
    if (!loading && user) {
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
  }, [loading, user]);

  if (loading || channelsLoading) {
    return (
      <div>
        <Navbar />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
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

  // Handler to trigger the hidden file input
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handler for file selection and upload
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
        throw new Error(errorData.message || "Failed to upload profile picture.");
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
                src={`http://localhost:3001/${UID}/profile_picture?${
                  new Date().getTime()
                }`} // Added timestamp for cache busting
                alt="Profile Picture"
                width={200}
                height={200}
                className="profile-picture"
                key={pfp_src} // Forces React to reload the Image component when pfp_src changes
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
                      href={`/channels/@${encodeURIComponent(channel.channel_name)}`}
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
}
