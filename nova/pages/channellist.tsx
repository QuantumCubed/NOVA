import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ChannelCard from "../components/ChannelCard";
import styles from "../styles/ChannelsList.module.css";
import { toast } from "react-toastify";

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

const ChannelList = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch(`http://localhost:3001/load/channels`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch channels.");
        }
        const data: Channel[] = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received.");
        }

        setChannels(data);
        toast.success("Channels loaded successfully!");
      } catch (err: any) {
        console.error("Error fetching channels:", err);
        setError(err.message || "An error occurred while fetching channels.");
        toast.error(
          err.message || "An error occurred while fetching channels."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className={styles.loading}>Loading channels...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  const truncateDescription = (description: string) => {
    if (description.length > 10) {
      return description.slice(0, 11) + "...";
    }
    return description;
  };

  const truncateChannelName = (name: string) => {
    if (name.length > 8) return name.slice(0, 10) + "...";
    return name;
  };

  return (
    <div className={styles.channelListPage}>
      <Navbar />
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>All Channels</h1>
        {channels.length > 0 ? (
          <div className={styles.channelsGrid}>
            {channels.map((channel, index) => (
              <div
                key={channel._id}
                style={{ animationDelay: `${index * 0.1}s` }}
                className={styles.channelCardWrapper}
              >
                <ChannelCard
                  channel={{
                    ...channel,
                    description: truncateDescription(channel.description),
                    channel_name: truncateChannelName(channel.channel_name),
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p>No channels available.</p>
        )}
      </main>
    </div>
  );
};

export default ChannelList;
