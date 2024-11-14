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

  // Function to shuffle the videos array
  function shuffleArray(array: Video[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true); // Start loading
      setError(null); // Clear previous error
      try {
        // Fetch all videos by using a search query that matches everything
        const res = await fetch("http://127.0.0.1:3001/search?search=.*");
        if (!res.ok) throw new Error("Failed to fetch videos"); // Handle non-2xx responses
        const data: Video[] = await res.json();
        const shuffledVideos = shuffleArray(data); // Shuffle the videos array
        setVideos(shuffledVideos);
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
  );
}
