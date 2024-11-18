// frontend/pages/channels.tsx

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import ChannelCard from "../components/ChannelCard";
import styles from "../styles/Channels.module.css";

interface Channel {
  _id: string;
  owner: string;
  channel_name: string;
  description: string;
  subscriber_count: number;
  channel_icon_src: string;
  channel_banner_src: string;
  videos: string[]; // vIDs
}

export default function Channels() {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // States for creating a new channel
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState<boolean>(false);

  useEffect(() => {
    if (!authContext.loading && !authContext.user) {
      router.push("/login");
    }
  }, [authContext, router]);

  useEffect(() => {
    if (authContext.user) {
      fetchChannels();
    }
  }, [authContext.user]);

  const fetchChannels = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch("http://localhost:3001/channels", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch channels.");
      }

      const data: Channel[] = await response.json();
      setChannels(data);
    } catch (error: any) {
      console.error("Error fetching channels:", error);
      setError(error.message || "An error occurred while fetching channels.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreating(true);

    if (channelName.trim() === "") {
      setCreateError("Channel name is required.");
      setCreating(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch("http://localhost:3001/channel/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          channel_name: channelName,
          channel_description: channelDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create channel.");
      }

      // Fetch the updated channels list
      await fetchChannels();

      // Reset form fields
      setChannelName("");
      setChannelDescription("");
    } catch (error: any) {
      console.error("Error creating channel:", error);
      setCreateError(
        error.message || "An error occurred while creating the channel."
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className={styles.channelsPage}>
      <Navbar />
      <div className={styles.channelsContent}>
        <main className={styles.channelsMain}>
          <h1>Your Channels</h1>
          {loading ? (
            <p>Loading channels...</p>
          ) : error ? (
            <p className={styles.errorMessage}>{error}</p>
          ) : channels.length > 0 ? (
            <div className={styles.channelsList}>
              {channels.map((channel) => (
                <ChannelCard key={channel._id} channel={channel} />
              ))}
            </div>
          ) : (
            <p>You have not created any channels yet.</p>
          )}

          <div className={styles.createChannelSection}>
            <h2>Create a New Channel</h2>
            <form
              onSubmit={handleCreateChannel}
              className={styles.createChannelForm}
            >
              <div className={styles.formGroup}>
                <label htmlFor="channelName">Channel Name:</label>
                <input
                  type="text"
                  id="channelName"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  required
                  placeholder="Enter channel name"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="channelDescription">Description:</label>
                <input
                  id="channelDescription"
                  value={channelDescription}
                  onChange={(e) => setChannelDescription(e.target.value)}
                  placeholder="Enter channel description"
                />
              </div>
              {createError && (
                <p className={styles.errorMessage}>{createError}</p>
              )}
              <button
                type="submit"
                disabled={creating}
                className={styles.createButton}
              >
                {creating ? "Creating..." : "Create Channel"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
