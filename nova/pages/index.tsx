// pages/index.tsx

import { useEffect, useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import VideoCard from "../components/VideoCard";

interface Video {
  _id: string;
  title: string;
  description: string;
  videoSrc: string;
  thumbnailSrc: string;
  channelName: string;
  datePublished: string;
  viewCount: number;
  duration: number;
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      const response = await fetch("http://localhost:3001/load/videos");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch videos.");
      }
      const data: Video[] = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received.");
      }

      setVideos(data);
    } catch (err: any) {
      console.error("Error fetching videos:", err);
      setError(err.message || "An error occurred while fetching videos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <>
    <Navbar />
    <div className="home-container">
      <Head>
        <title>NOVA</title>
      </Head>
      <main>
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
    </>
  );
}