// pages/video/[id].tsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import styles from "../../styles/VideoPage.module.css";
import { Video } from "../../interfaces/Video";

export default function VideoPage() {
  const router = useRouter();
  const { id } = router.query;
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchVideoData = async () => {
      try {
        // Fetch all videos
        const videoResponse = await fetch("http://localhost:3001/load/videos");
        if (!videoResponse.ok) {
          throw new Error("Failed to fetch videos");
        }
        const videoDataArray = await videoResponse.json();
        console.log("Fetched Video Data Array:", videoDataArray);

        // Find the video with the matching ID
        const videoData = videoDataArray.find((video: any) => video._id === id);
        if (!videoData) {
          throw new Error("Video not found.");
        }
        console.log("Matched Video Data:", videoData);

        // Fetch all channels
        const channelResponse = await fetch("http://localhost:3001/load/channels");
        if (!channelResponse.ok) {
          throw new Error("Failed to fetch channels");
        }
        const channelData = await channelResponse.json();
        console.log("Fetched Channel Data:", channelData);

        // Create a mapping from channel ID to channel name
        const channelIdToNameMap: { [key: string]: string } = {};
        channelData.forEach((channel: any) => {
          channelIdToNameMap[String(channel._id)] = channel.channel_name;
        });

        // Get the channel name
        const channelName =
          channelIdToNameMap[String(videoData.channel)] || "Unknown Channel";

        // Extract date_published
        let datePublished = videoData.date_published;
        if (datePublished && datePublished.$date) {
          datePublished = datePublished.$date;
        } else if (typeof datePublished === "string") {
          datePublished = datePublished;
        } else {
          datePublished = null;
        }

        // Construct video source URL using NGINX base URL
        const videoSrc = `https://127.0.0.1:8443/watch/${id}/output.mpd`;

        // Transform data to match the Video interface
        const transformedVideo: Video = {
          _id: videoData._id,
          title: videoData.title,
          description: videoData.description,
          video_src: videoSrc,
          thumbnail_src: videoData.thumbnail_src,
          channel: videoData.channel,
          channel_name: channelName,
          date_published: datePublished,
          view_count: videoData.viewCount || 0,
          duration: Number(videoData.duration) || 0,
        };

        console.log("Transformed Video Data:", transformedVideo);

        setVideo(transformedVideo);
      } catch (error: any) {
        console.error("Error fetching video data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [id]);

  useEffect(() => {
    if (video) {
      import("dashjs")
        .then((dashjs) => {
          const player = dashjs.MediaPlayer().create();
          const videoElement = document.querySelector(
            "#videoPlayer"
          ) as HTMLMediaElement | null;
          if (videoElement) {
            player.initialize(videoElement, video.video_src, true);
          }
          return () => {
            player.reset();
          };
        })
        .catch((err) => {
          console.error("Failed to load dashjs:", err);
        });
    }
  }, [video]);

  if (loading)
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );

  if (error || !video) {
    return (
      <div>
        <Navbar />
        <p>{error || "Video not available."}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.videoContainer}>
        <div className={styles.videoPlayer}>
          <video id="videoPlayer" controls className={styles.player}></video>
        </div>
        <div className={styles.videoDetails}>
          <h1 className={styles.title}>{video.title}</h1>
          <p className={styles.channelName}>@{video.channel_name}</p>
          <p className={styles.metadata}>
            {video.view_count?.toLocaleString() || "0"} views •{" "}
            {video.date_published
              ? new Date(video.date_published).toLocaleDateString()
              : "Unknown Date"}
          </p>
          <p className={styles.description}>{video.description}</p>
        </div>
      </div>
    </>
  );
}
