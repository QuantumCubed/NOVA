// pages/channels/[name].tsx

import { useRouter } from "next/router";
import { useEffect, useState, useContext, ChangeEvent, useRef } from "react";
import Navbar from "../../components/Navbar";
import VideoCard from "../../components/VideoCard";
import styles from "../../styles/ChannelPage.module.css";
import { AuthContext } from "../../context/AuthContext";
import { FaUpload, FaEdit, FaTimes, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";

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
  owner: string;
  channel_name: string;
  description: string;
  subscriber_count: number;
  channel_icon_src: string;
  channel_banner_src: string;
  videos: Video[];
}

const ChannelPage = () => {
  const router = useRouter();
  const { name } = router.query; // e.g., '@test1'
  const authContext = useContext(AuthContext);

  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subscribing, setSubscribing] = useState<boolean>(false);
  const [subError, setSubError] = useState<string | null>(null);

  // Modal states for uploading and editing
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [newDescription, setNewDescription] = useState<string>("");
  const [updatingDescription, setUpdatingDescription] =
    useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Banner Upload States
  const [isUploadingBanner, setIsUploadingBanner] = useState<boolean>(false);
  const [bannerUploadError, setBannerUploadError] = useState<string | null>(
    null
  );
  const bannerFileInputRef = useRef<HTMLInputElement | null>(null);

  // Channel Icon Upload States
  const [isUploadingIcon, setIsUploadingIcon] = useState<boolean>(false);
  const [iconUploadError, setIconUploadError] = useState<string | null>(null);
  const iconFileInputRef = useRef<HTMLInputElement | null>(null);

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
          const errorData = await response.json();
          throw new Error(errorData.message || "Channel not found.");
        }

        const data: Channel = await response.json();
        setChannel(data);
        console.log("Fetched Channel Data:", data); // Debugging

        if (authContext?.user && authContext.user.UID !== data.owner) {
          const subResponse = await fetch(
            `http://localhost:3001/channels/${data._id}/isSubscribed`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
              },
            }
          );

          if (subResponse.ok) {
            const subData = await subResponse.json();
            setIsSubscribed(subData.isSubscribed);
          } else {
            const errorData = await subResponse.json();
            throw new Error(
              errorData.message || "Failed to fetch subscription status."
            );
          }
        }
      } catch (error: any) {
        console.error("Error fetching channel:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [name, authContext?.user]);

  useEffect(() => {
    if (channel) {
      setNewDescription(channel.description);
    }
  }, [channel]);

  const isChannelOwner =
    authContext?.user && channel
      ? authContext.user.UID === channel.owner
      : false;

  const handleSubscribe = async () => {
    if (!authContext?.user) {
      router.push("/login");
      return;
    }

    setSubscribing(true);
    setSubError(null);

    try {
      const response = await fetch(
        `http://localhost:3001/subscribe/${channel?._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Subscription failed.");
      }

      setIsSubscribed(result.message === "Successfully Subscribed!");
      setChannel((prevChannel) =>
        prevChannel
          ? { ...prevChannel, subscriber_count: result.subscriber_count }
          : prevChannel
      );

      toast.success(result.message || "Subscription status updated.");
    } catch (error: any) {
      console.error("Subscription error:", error);
      setSubError(error.message);
      toast.error(error.message || "Subscription failed.");
    } finally {
      setSubscribing(false);
    }
  };

  // Upload Modal Functions
  const openUploadModal = () => {
    setIsUploadModalOpen(true);
    setUploadError(null);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    // Reset form states
    setVideoTitle("");
    setVideoDescription("");
    setVideoTags("");
    setVideoFile(null);
    setThumbnailFile(null);
    setUploadError(null);
  };

  // Upload form states
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoDescription, setVideoDescription] = useState<string>("");
  const [videoTags, setVideoTags] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

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
        formData.append("thumbnail", thumbnailFile);
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated.");
      }

      if (!channel) {
        throw new Error("Channel data is not available.");
      }

      const response = await fetch(
        `http://localhost:3001/channel/${channel._id}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Video upload failed.");
      }

      const updatedChannelResponse = await fetch(
        `http://localhost:3001/channels/name/${encodeURIComponent(
          channel.channel_name
        )}`
      );

      if (!updatedChannelResponse.ok) {
        throw new Error("Failed to refresh channel data.");
      }

      const updatedChannel: Channel = await updatedChannelResponse.json();
      console.log("Updated Channel After Video Upload:", updatedChannel); // Debugging
      setChannel(updatedChannel);

      closeUploadModal();
      toast.success("Video uploaded successfully!");
    } catch (error: any) {
      console.error("Error uploading video:", error);
      setUploadError(error.message);
      toast.error(error.message || "Failed to upload video.");
    } finally {
      setUploading(false);
    }
  };

  // Edit Description Modal Functions
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

      if (!channel) {
        throw new Error("Channel data is not available.");
      }

      const response = await fetch(
        `http://localhost:3001/channels/${channel._id}/description`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ description: newDescription }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to update description."
        );
      }

      const updatedChannel: Channel = responseData.updatedChannel;
      console.log("Updated Channel After Description Change:", updatedChannel); // Debugging
      setChannel(updatedChannel);
      closeEditModal();
      toast.success("Channel description updated successfully!");
    } catch (error: any) {
      console.error("Error updating description:", error);
      setUpdateError(error.message);
      toast.error(error.message || "Failed to update description.");
    } finally {
      setUpdatingDescription(false);
    }
  };

  // Banner Upload Handler Functions

  const handleBannerEditClick = () => {
    if (bannerFileInputRef.current) {
      bannerFileInputRef.current.click();
    }
  };

  const handleBannerFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, and GIF files are allowed.");
      return;
    }

    const formData = new FormData();
    // Add both required fields - empty file for icon since we're only updating banner
    const emptyFile = new File([""], "empty.png", { type: "image/png" });
    formData.append("channel_icon", emptyFile);
    formData.append("channel_banner", file);

    setIsUploadingBanner(true);
    setBannerUploadError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated.");
      }

      if (!channel) {
        throw new Error("Channel data is not available.");
      }

      const response = await fetch(
        `http://localhost:3001/channel/${channel._id}/visuals/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      // Handle potential non-JSON responses
      const contentType = response.headers.get("content-type");
      let responseData: any = {};
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Unknown server error occurred.");
      }

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to upload banner image."
        );
      }

      toast.success("Banner image updated successfully!");
      console.log("Banner Upload Response Data:", responseData); // Debugging

      // Refresh channel data
      const updatedChannelResponse = await fetch(
        `http://localhost:3001/channels/name/${encodeURIComponent(
          channel.channel_name
        )}`
      );

      if (!updatedChannelResponse.ok) {
        throw new Error("Failed to fetch updated channel data.");
      }

      const updatedChannel: Channel = await updatedChannelResponse.json();
      console.log("Updated Channel After Banner Upload:", updatedChannel); // Debugging
      setChannel(updatedChannel);
    } catch (error: any) {
      console.error("Banner upload error:", error);
      setBannerUploadError(error.message);
      toast.error(error.message || "Failed to upload banner image.");
    } finally {
      setIsUploadingBanner(false);
      if (bannerFileInputRef.current) {
        bannerFileInputRef.current.value = "";
      }
    }
  };

  // Channel Icon Upload Handler Functions

  const handleIconEditClick = () => {
    if (iconFileInputRef.current) {
      iconFileInputRef.current.click();
    }
  };

  const handleIconFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, and GIF files are allowed for icons.");
      return;
    }

    const formData = new FormData();
    // Add both required fields - empty file for banner since we're only updating icon
    const emptyFile = new File([""], "empty.png", { type: "image/png" });
    formData.append("channel_icon", file);
    formData.append("channel_banner", emptyFile);

    setIsUploadingIcon(true);
    setIconUploadError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated.");
      }

      if (!channel) {
        throw new Error("Channel data is not available.");
      }

      const response = await fetch(
        `http://localhost:3001/channel/${channel._id}/visuals/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      // Handle potential non-JSON responses
      const contentType = response.headers.get("content-type");
      let responseData: any = {};
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Unknown server error occurred.");
      }

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to upload channel icon."
        );
      }

      toast.success("Channel icon updated successfully!");
      console.log("Icon Upload Response Data:", responseData); // Debugging

      // Refresh channel data
      const updatedChannelResponse = await fetch(
        `http://localhost:3001/channels/name/${encodeURIComponent(
          channel.channel_name
        )}`
      );

      if (!updatedChannelResponse.ok) {
        throw new Error("Failed to fetch updated channel data.");
      }

      const updatedChannel: Channel = await updatedChannelResponse.json();
      console.log("Updated Channel After Icon Upload:", updatedChannel); // Debugging
      setChannel(updatedChannel);
    } catch (error: any) {
      console.error("Icon upload error:", error);
      setIconUploadError(error.message);
      toast.error(error.message || "Failed to upload channel icon.");
    } finally {
      setIsUploadingIcon(false);
      if (iconFileInputRef.current) {
        iconFileInputRef.current.value = "";
      }
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
    <div className={styles.channelPage} key={channel._id}>
      <Navbar />
      <div className={styles.channelBanner}>
        {channel.channel_banner_src ? (
          <img
            src={`http://localhost:3001${
              channel.channel_banner_src
            }?t=${Date.now()}`}
            alt={`${channel.channel_name} Banner`}
            className={styles.bannerImage}
            onError={(e) => {
              console.error("Failed to load banner image:", e);
              (e.target as HTMLImageElement).src = "/default-banner.png"; // Fallback image
            }}
          />
        ) : (
          <div className={styles.defaultBanner}>No Banner</div>
        )}
        {isChannelOwner && (
          <button
            className={styles.bannerEditButton}
            onClick={handleBannerEditClick}
            aria-label="Edit Banner Image"
          >
            <FaEdit />
          </button>
        )}
        {/* Hidden File Input for Banner Upload */}
        <input
          type="file"
          accept="image/*"
          ref={bannerFileInputRef}
          style={{ display: "none" }}
          onChange={handleBannerFileChange}
        />
        {/* Display upload status */}
        {isUploadingBanner && <p>Uploading banner...</p>}
        {bannerUploadError && (
          <p className={styles.errorMessage}>{bannerUploadError}</p>
        )}
      </div>
      <div className={styles.channelInfo}>
        <div className={styles.channelIcon}>
          {channel.channel_icon_src ? (
            <img
              src={`http://localhost:3001${
                channel.channel_icon_src
              }?t=${Date.now()}`}
              alt={`${channel.channel_name} Icon`}
              className={styles.iconImage}
              onError={(e) => {
                console.error("Failed to load icon image:", e);
                (e.target as HTMLImageElement).src = "/default-icon.png"; // Fallback icon
              }}
            />
          ) : (
            <div className={styles.defaultIcon}>CI</div>
          )}
          {/* Edit Icon Button */}
          {isChannelOwner && (
            <button
              className={styles.iconEditButton}
              onClick={handleIconEditClick}
              aria-label="Edit Channel Icon"
            >
              <FaEdit />
            </button>
          )}
          {/* Hidden File Input for Icon Upload */}
          <input
            type="file"
            accept="image/*"
            ref={iconFileInputRef}
            style={{ display: "none" }}
            onChange={handleIconFileChange}
          />
          {/* Display upload status */}
          {isUploadingIcon && <p>Uploading icon...</p>}
          {iconUploadError && (
            <p className={styles.errorMessage}>{iconUploadError}</p>
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
          {/* Subscribe/Unsubscribe Button */}
          {!isChannelOwner && (
            <button
              className={`${styles.subscribeButton} ${
                isSubscribed ? styles.subscribed : ""
              }`}
              onClick={handleSubscribe}
              disabled={subscribing}
            >
              {subscribing ? (
                "Processing..."
              ) : isSubscribed ? (
                <>
                  <FaCheck /> Subscribed
                </>
              ) : (
                "Subscribe"
              )}
            </button>
          )}
          {subError && <p className={styles.errorMessage}>{subError}</p>}
          {/* Upload Button */}
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

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className={styles.modalOverlay} onClick={closeUploadModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={closeUploadModal}
              aria-label="Close Modal"
            >
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

      {/* Edit Description Modal */}
      {isEditModalOpen && (
        <div className={styles.modalOverlay} onClick={closeEditModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={closeEditModal}
              aria-label="Close Modal"
            >
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
