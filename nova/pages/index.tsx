// pages/index.tsx

import Head from 'next/head';
import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard';

interface Video {
  _id: string;
  title: string;
  description: string;
  video_src: string;
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('http://127.0.0.1:3001/search?search=');
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div>
      <Head>
        <title>Nova</title>
      </Head>
      <Navbar />
      <div>
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}
