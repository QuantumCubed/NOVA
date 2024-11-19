// pages/create-channel.tsx

import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import styles from "../styles/CreateChannel.module.css";

export default function CreateChannel() {
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [creating, setCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCreating(true);

    if (channelName.trim() === "") {
      setError("Channel name is required.");
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

      alert("Channel created successfully!");
      setChannelName("");
      setChannelDescription("");
      router.push("/channels");
    } catch (error: any) {
      console.error("Error creating channel:", error);
      setError(
        error.message || "An error occurred while creating the channel."
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className={styles.createChannelPage}>
      <Navbar />
      <div className={`${styles.container} ${styles.fadeIn}`}>
        <h1>Create a New Channel</h1>
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
              placeholder="Channel name"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="channelDescription">Description:</label>
            <input
              id="channelDescription"
              value={channelDescription}
              onChange={(e) => setChannelDescription(e.target.value)}
              placeholder="Channel description"
            />
          </div>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button
            type="submit"
            disabled={creating}
            className={styles.createButton}
          >
            {creating ? "Creating..." : "Create Channel"}
          </button>
        </form>
      </div>
    </div>
  );
}
