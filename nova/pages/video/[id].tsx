// pages/video/[id].tsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import styles from "../../styles/VideoPage.module.css";

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

export default function VideoPage() {
  const router = useRouter();
  const { id } = router.query;
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
  
    const fetchVideo = async () => {
      try {
        const response = await fetch(`http://localhost:3001/watch/${id}`, {
          method: 'POST',
        });
        if (!response.ok) {
          throw new Error("Video not found.");
        }
        const data = await response.json();
        console.log("Fetched Video Data:", data);
  
        if (data.video_src && !data.video_src.startsWith('http')) {
          // Set to the correct HTTPS path
          data.video_src = `https://127.0.0.1:8443/watch/${id}/output.mpd`;
        }
  
        setVideo(data);
      } catch (error: any) {
        console.error("Error fetching video:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchVideo();
  }, [id]);

  useEffect(() => {
    if (video) {
      import('dashjs').then(dashjs => {
        const player = dashjs.MediaPlayer().create();
        const videoElement = document.querySelector("#videoPlayer") as HTMLMediaElement | null;
        if (videoElement) {
          player.initialize(videoElement, video.video_src, true);
        }
        return () => {
          player.reset();
        };
      }).catch(err => {
        console.error("Failed to load dashjs:", err);
      });
    }
  }, [video]);

  if (loading) return (
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
            {new Date(video.date_published).toLocaleDateString()}
          </p>
          <p className={styles.description}>{video.description}</p>
        </div>
      </div>
    </>
  );
}