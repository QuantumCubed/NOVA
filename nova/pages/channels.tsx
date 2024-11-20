// pages/channels.tsx

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

  const redirectToCreateChannel = () => {
    router.push("/create-channel");
  };

  return (
    <div className={styles.channelsPage}>
      <Navbar />
      <div className={styles.channelsContent}>
        <div className={styles.headerRow}>
          <h1 className={styles.pageTitle}>Your Channels</h1>
          <button
            className={styles.createChannelButton}
            onClick={redirectToCreateChannel}
          >
            Create New Channel
          </button>
        </div>
        <div className={styles.channelsList}>
          {loading ? (
            <p>Loading channels...</p>
          ) : error ? (
            <p className={styles.errorMessage}>{error}</p>
          ) : channels.length > 0 ? (
            channels.map((channel) => (
              <ChannelCard key={channel._id} channel={channel} />
            ))
          ) : (
            <p>You have not created any channels yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
