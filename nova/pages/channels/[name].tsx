import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import Navbar from "../../components/Navbar";
import VideoCard from "../../components/VideoCard";
import styles from "../../styles/ChannelPage.module.css";
import { AuthContext } from "../../context/AuthContext";
import { FaUpload, FaEdit, FaTimes } from "react-icons/fa";

interface Video {
  _id: string;
  title: string;
  description: string;
  video_src: string;
  thumbnail_src: string;
  channel_name: string;
  date_published: string;
  view_count: number;
  duration: number;
}

interface Channel {
  _id: string;
  owner: string; // User ID of the owner
  channel_name: string;
  description: string;
  subscriber_count: number;
  channel_icon_src: string;
  channel_banner_src: string;
  videos: Video[];
}

const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  const hoursStr = hours > 0 ? `${hours}:` : "";
  const minutesStr = minutes < 10 && hours > 0 ? `0${minutes}:` : `${minutes}:`;
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${hoursStr}${minutesStr}${secondsStr}`;
};

const ChannelPage = () => {
  const router = useRouter();
  const { name } = router.query;
  const authContext = useContext(AuthContext);

  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoDescription, setVideoDescription] = useState<string>("");
  const [videoTags, setVideoTags] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [newDescription, setNewDescription] = useState<string>(
    channel?.description || ""
  );
  const [updatingDescription, setUpdatingDescription] =
    useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) return;

    const channelName = (name as string).startsWith("@")
      ? (name as string).substring(1)
      : (name as string);

    const fetchChannel = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/channels/name/${encodeURIComponent(
            channelName
          )}`
        );
        if (!response.ok) {
          throw new Error("Channel not found.");
        }
        const data: Channel = await response.json();
        setChannel(data);
      } catch (error: any) {
        console.error("Error fetching channel:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [name]);

  useEffect(() => {
    if (channel) {
      setNewDescription(channel.description);
    }
  }, [channel]);

  const isChannelOwner =
    authContext?.user && channel
      ? authContext.user.UID === channel.owner
      : false;

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
    setUploadError(null);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setVideoTitle("");
    setVideoDescription("");
    setVideoTags("");
    setVideoFile(null);
    setThumbnailFile(null);
    setUploadError(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoFile) {
      setUploadError("Please select a video file to upload.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("title", videoTitle);
      formData.append("description", videoDescription);
      formData.append("tags", videoTags);
      formData.append("video_file", videoFile);
      formData.append("channel_name", channel?.channel_name || "");
      if (thumbnailFile) {
        formData.append("thumbnail_file", thumbnailFile);
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated.");
      }

      const response = await fetch(
        `http://localhost:3001/channels/${channel?._id}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Video upload failed.");
      }

      const updatedChannelResponse = await fetch(
        `http://localhost:3001/channels/name/${encodeURIComponent(
          channel!.channel_name
        )}`
      );

      if (!updatedChannelResponse.ok) {
        throw new Error("Failed to refresh channel data.");
      }

      const updatedChannel: Channel = await updatedChannelResponse.json();
      setChannel(updatedChannel);
      closeUploadModal();
    } catch (error: any) {
      console.error("Error uploading video:", error);
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
    setUpdateError(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setNewDescription(channel?.description || "");
    setUpdateError(null);
  };

  const handleDescriptionUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newDescription.trim().length === 0) {
      setUpdateError("Description cannot be empty.");
      return;
    }

    setUpdatingDescription(true);
    setUpdateError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated.");
      }

      const response = await fetch(
        `http://localhost:3001/channels/${channel?._id}/description`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ description: newDescription }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update description.");
      }

      const updatedChannel: Channel = (await response.json()).channel;
      setChannel(updatedChannel);
      closeEditModal();
    } catch (error: any) {
      console.error("Error updating description:", error);
      setUpdateError(error.message);
    } finally {
      setUpdatingDescription(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <p>Loading channel...</p>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div>
        <Navbar />
        <p>{error || "Channel not found."}</p>
      </div>
    );
  }

  return (
    <div
      className={`${styles.channelPage} ${
        document.body.classList.contains("dark-mode") ? styles.darkMode : ""
      }`}
    >
      <Navbar />
      <div className={styles.channelBanner}>
        {channel.channel_banner_src ? (
          <img
            src={channel.channel_banner_src}
            alt={`${channel.channel_name} Banner`}
            className={styles.bannerImage}
          />
        ) : (
          <div className={styles.defaultBanner}>No Banner</div>
        )}
      </div>
      <div className={styles.channelInfo}>
        <div className={styles.channelIcon}>
          {channel.channel_icon_src ? (
            <img
              src={channel.channel_icon_src}
              alt={`${channel.channel_name} Icon`}
              className={styles.iconImage}
            />
          ) : (
            <div className={styles.defaultIcon}>CI</div>
          )}
        </div>
        <div className={styles.channelDetails}>
          <h1>@{channel.channel_name}</h1>
          <div className={styles.descriptionContainer}>
            <p>{channel.description}</p>
            {isChannelOwner && (
              <button
                className={styles.editButton}
                onClick={openEditModal}
                aria-label="Edit Description"
              >
                <FaEdit />
              </button>
            )}
          </div>
          <p>Subscribers: {channel.subscriber_count.toLocaleString()}</p>
          <p>Videos: {channel.videos.length}</p>
          {isChannelOwner && (
            <button className={styles.uploadButton} onClick={openUploadModal}>
              <FaUpload /> Upload Video
            </button>
          )}
        </div>
      </div>
      <main className={styles.videoGrid}>
        {channel.videos.length > 0 ? (
          channel.videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))
        ) : (
          <p>No videos available for this channel.</p>
        )}
      </main>
      {isUploadModalOpen && (
        <div className={styles.modalOverlay} onClick={closeUploadModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={closeUploadModal}>
              <FaTimes size={20} />
            </button>
            <h2>Upload Video</h2>
            <form onSubmit={handleUpload} className={styles.uploadForm}>
              <div className={styles.formGroup}>
                <label htmlFor="videoTitle">Title</label>
                <input
                  type="text"
                  id="videoTitle"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="videoDescription">Description</label>
                <textarea
                  id="videoDescription"
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="videoTags">Tags (comma separated)</label>
                <input
                  type="text"
                  id="videoTags"
                  value={videoTags}
                  onChange={(e) => setVideoTags(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="videoFile">Video File</label>
                <input
                  type="file"
                  id="videoFile"
                  accept="video/*"
                  onChange={(e) =>
                    setVideoFile(e.target.files ? e.target.files[0] : null)
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="thumbnailFile">Thumbnail (optional)</label>
                <input
                  type="file"
                  id="thumbnailFile"
                  accept="image/*"
                  onChange={(e) =>
                    setThumbnailFile(e.target.files ? e.target.files[0] : null)
                  }
                />
              </div>
              {uploadError && (
                <p className={styles.uploadError}>{uploadError}</p>
              )}
              <button
                type="submit"
                className={styles.submitButton}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload Video"}
              </button>
            </form>
          </div>
        </div>
      )}
      {isEditModalOpen && (
        <div className={styles.modalOverlay} onClick={closeEditModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={closeEditModal}>
              <FaTimes size={20} />
            </button>
            <h2>Edit Channel Description</h2>
            <form
              onSubmit={handleDescriptionUpdate}
              className={styles.editForm}
            >
              <div className={styles.formGroup}>
                <label htmlFor="newDescription">Description</label>
                <textarea
                  id="newDescription"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  required
                  rows={4}
                ></textarea>
              </div>
              {updateError && (
                <p className={styles.uploadError}>{updateError}</p>
              )}
              <button
                type="submit"
                className={styles.submitButton}
                disabled={updatingDescription}
              >
                {updatingDescription ? "Updating..." : "Update Description"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelPage;
