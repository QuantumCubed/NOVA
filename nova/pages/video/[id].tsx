// pages/video/[id].tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';

interface Video {
  _id: string;
  title: string;
  description: string;
  video_src: string;
}

export default function VideoPage() {
  const router = useRouter();
  const { id } = router.query;
  const [video, setVideo] = useState<Video | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchVideo = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:3001/video/${id}`);
        const data = await res.json();
        setVideo(data);
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };

    fetchVideo();
  }, [id]);

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <h1>{video.title}</h1>
      <video width="640" height="360" controls>
        <source src={`http://127.0.0.1:3001/uploads/${video.video_src}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p>{video.description}</p>
    </div>
  );
}
