// pages/index.tsx

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import VideoCard from "../components/VideoCard";
import { Video } from "../interfaces/Video";
import { useChannels } from "../hooks/useChannels";
import styles from "../styles/Home.module.css";

const HomePage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState<boolean>(true);
  const { channels, loading: loadingChannels } = useChannels();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("http://localhost:3001/load/videos");
        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }
        const videoData = await response.json();

        // Create a mapping from channel ID to channel name
        const channelIdToNameMap: { [key: string]: string } = {};
        channels.forEach((channel: any) => {
          channelIdToNameMap[channel._id] = channel.channel_name;
        });

        // Transform and map data to Video interface
        const transformedVideos: Video[] = videoData.map((video: any) => ({
          _id: video._id,
          title: video.title,
          description: video.description,
          video_src: video.video_src,
          thumbnail_src: video.thumbnail_src,
          channel: video.channel,
          channel_name:
            channelIdToNameMap[video.channel] || "Unknown Channel",
          date_published: video.date_published,
          view_count: video.view_count || 0,
          duration: Number(video.duration) || 0,
        }));

        setVideos(transformedVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoadingVideos(false);
      }
    };

    if (!loadingChannels) {
      fetchVideos();
    }
  }, [channels, loadingChannels]);

  if (loadingVideos || loadingChannels) {
    return (
      <div>
        <Navbar />
        <p>Loading videos...</p>
      </div>
    );
  }

  return (
    <div className={styles.homePage}>
      <Navbar />
      <main className={styles.videoGrid}>
        {videos.length > 0 ? (
          videos.map((video) => <VideoCard key={video._id} video={video} />)
        ) : (
          <p>No videos available.</p>
        )}
      </main>
    </div>
  );
};

export default HomePage;
