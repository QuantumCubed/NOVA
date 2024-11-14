// pages/index.tsx

import Head from "next/head";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";

interface Video {
  _id: string;
  title: string;
  description: string;
  video_src: string;
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true); // Start loading
      setError(null); // Clear previous error
      try {
        const res = await fetch("http://127.0.0.1:3001/search?search=");
        if (!res.ok) throw new Error("Failed to fetch videos"); // Handle non-2xx responses
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setError("Failed to load videos. Please try again later.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchVideos();
  }, []);

  return (
    <div>
      <Head>
        <title>Nova - Video Platform</title>
      </Head>
      <Navbar />
      <main className="video-container">
        {loading ? (
          <p>Loading videos...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="video-grid">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
