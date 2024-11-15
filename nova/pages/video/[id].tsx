// // pages/video/[id].tsx

// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import Navbar from '../../components/Navbar';

// interface Video {
//   _id: string;
//   title: string;
//   description: string;
//   video_src: string;
// }

// export default function VideoPage() {
//   const router = useRouter();
//   const { id } = router.query;
//   const [video, setVideo] = useState<Video | null>(null);

//   useEffect(() => {
//     if (!id) return;

//     const fetchVideo = async () => {
//       try {
//         const res = await fetch(`http://127.0.0.1:3001/video/${id}`);
//         const data = await res.json();
//         setVideo(data);
//       } catch (error) {
//         console.error('Error fetching video:', error);
//       }
//     };

//     fetchVideo();
//   }, [id]);

//   if (!video) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <Navbar />
//       <h1>{video.title}</h1>
//       <video width="640" height="360" controls>
//         <source src={`http://127.0.0.1:3001/uploads/${video.video_src}`} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//       <p>{video.description}</p>
//     </div>
//   );
// }


























// pages/video/[id].tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';

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

const mockVideos: Video[] = [
  // ... (Same as the updated mock data in index.tsx)
];

export default function VideoPage() {
  const router = useRouter();
  const { id } = router.query;
  const [video, setVideo] = useState<Video | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchVideo = () => {
      // Use mock data to find the video by ID
      const foundVideo = mockVideos.find((vid) => vid._id === id);
      if (foundVideo) {
        setVideo(foundVideo);
      } else {
        setVideo(null);
      }
    };

    fetchVideo();
  }, [id]);

  if (!video) {
    return (
      <div>
        <Navbar />
        <p>Video not found.</p>
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
