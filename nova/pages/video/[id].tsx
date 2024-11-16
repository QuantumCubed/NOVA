// pages/video/[id].tsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

interface Video {
  _id: string;
  title: string;
  description: string;
  video_src: string;
  thumbnail_src: string;
  channel_name: string;
  date_published: string;
  view_count: number;
  duration: number; // Duration in seconds
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
        const response = await fetch(`http://127.0.0.1:3001/watch/${id}`);
        if (!response.ok) {
          throw new Error("Video not found.");
        }
        const data = await response.json();
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

  if (loading) {
    return (
      <div>
        <Navbar />
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div>
        <Navbar />
        <p>{error || "Video not found."}</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="video-page">
        <video width="100%" height="auto" controls>
          <source src={video.video_src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h1 className="video-title">{video.title}</h1>
        <p className="channel-name">{video.channel_name}</p>
        <p className="metadata">
          {video.view_count.toLocaleString()} views • {video.date_published}
        </p>
        <p className="video-description">{video.description}</p>
      </div>
    </div>
  );
}
