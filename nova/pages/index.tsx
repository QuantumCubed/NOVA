// // pages/index.tsx

// import Head from "next/head";
// import Navbar from "../components/Navbar";
// import { useEffect, useState } from "react";
// import VideoCard from "../components/VideoCard";

// interface Video {
//   _id: string;
//   title: string;
//   description: string;
//   video_src: string;
// }

// export default function Home() {
//   const [videos, setVideos] = useState<Video[]>([]);
//   const [loading, setLoading] = useState<boolean>(true); // Loading state
//   const [error, setError] = useState<string | null>(null); // Error state

//   // Function to shuffle the videos array
//   function shuffleArray(array: Video[]) {
//     for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
//   }

//   useEffect(() => {
//     const fetchVideos = async () => {
//       setLoading(true); // Start loading
//       setError(null); // Clear previous error
//       try {
//         // Fetch all videos by using a search query that matches everything
//         const res = await fetch("http://127.0.0.1:3001/search?search=.*");
//         if (!res.ok) throw new Error("Failed to fetch videos"); // Handle non-2xx responses
//         const data: Video[] = await res.json();
//         const shuffledVideos = shuffleArray(data); // Shuffle the videos array
//         setVideos(shuffledVideos);
//       } catch (error) {
//         console.error("Error fetching videos:", error);
//         setError("Failed to load videos. Please try again later.");
//       } finally {
//         setLoading(false); // Stop loading
//       }
//     };

//     fetchVideos();
//   }, []);

//   return (
//     <div>
//       <Head>
//         <title>Nova - Video Platform</title>
//       </Head>
//       <Navbar />
//       <main>
//         {loading ? (
//           <p>Loading videos...</p>
//         ) : error ? (
//           <p className="error-message">{error}</p>
//         ) : (
//           <div className="video-grid">
//             {videos.map((video) => (
//               <VideoCard key={video._id} video={video} />
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

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
  thumbnail_src: string;
  channel_name: string;
  date_published: string;
  view_count: number;
  duration: number; // Duration in seconds
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
        // Mock data with additional metadata
        const data: Video[] = [
          {
            _id: "1",
            title: "Exploring the Universe",
            description: "Join us on a journey through space.",
            video_src:
              "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnail_src:
              "https://via.placeholder.com/320x180?text=Exploring+the+Universe",
            channel_name: "SpaceTraveler",
            date_published: "2023-01-15",
            view_count: 120345,
            duration: 3600, // 1 hour
          },
          {
            _id: "2",
            title: "The Beauty of Nature",
            description: "A montage of breathtaking natural landscapes.",
            video_src:
              "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnail_src:
              "https://via.placeholder.com/320x180?text=The+Beauty+of+Nature",
            channel_name: "NatureLover",
            date_published: "2023-02-10",
            view_count: 95423,
            duration: 540, // 9 minutes
          },
          {
            _id: "3",
            title: "Cooking 101",
            description: "Learn the basics of cooking delicious meals.",
            video_src:
              "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnail_src:
              "https://via.placeholder.com/320x180?text=Cooking+101",
            channel_name: "ChefMaster",
            date_published: "2023-03-05",
            view_count: 65789,
            duration: 780, // 13 minutes
          },
          {
            _id: "4",
            title: "Tech Innovations",
            description: "Latest trends in technology and innovation.",
            video_src:
              "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnail_src:
              "https://via.placeholder.com/320x180?text=Tech+Innovations",
            channel_name: "TechGuru",
            date_published: "2023-04-20",
            view_count: 84567,
            duration: 420, // 7 minutes
          },
          {
            _id: "5",
            title: "Fitness at Home",
            description: "Stay fit with these easy home workouts.",
            video_src:
              "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnail_src:
              "https://via.placeholder.com/320x180?text=Fitness+at+Home",
            channel_name: "FitLife",
            date_published: "2023-05-30",
            view_count: 73210,
            duration: 1800, // 30 minutes
          },
          {
            _id: "6",
            title: "Fitness at Home",
            description: "Stay fit with these easy home workouts.",
            video_src:
              "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnail_src:
              "https://via.placeholder.com/320x180?text=Fitness+at+Home",
            channel_name: "FitLife",
            date_published: "2023-05-30",
            view_count: 73210,
            duration: 1800, // 30 minutes
          },
          {
            _id: "7",
            title: "Fitness at Home",
            description: "Stay fit with these easy home workouts.",
            video_src:
              "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnail_src:
              "https://via.placeholder.com/320x180?text=Fitness+at+Home",
            channel_name: "FitLife",
            date_published: "2023-05-30",
            view_count: 73210,
            duration: 1800, // 30 minutes
          },
          {
            _id: "8",
            title: "Fitness at Home",
            description: "Stay fit with these easy home workouts.",
            video_src:
              "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnail_src:
              "https://via.placeholder.com/320x180?text=Fitness+at+Home",
            channel_name: "FitLife",
            date_published: "2023-05-30",
            view_count: 73210,
            duration: 1800, // 30 minutes
          },
          {
            _id: "9",
            title: "Fitness at Home",
            description: "Stay fit with these easy home workouts.",
            video_src:
              "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnail_src:
              "https://via.placeholder.com/320x180?text=Fitness+at+Home",
            channel_name: "FitLife",
            date_published: "2023-05-30",
            view_count: 73210,
            duration: 1800, // 30 minutes
          },
          {
            _id: "10",
            title: "Fitness at Home",
            description: "Stay fit with these easy home workouts.",
            video_src:
              "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnail_src:
              "https://via.placeholder.com/320x180?text=Fitness+at+Home",
            channel_name: "FitLife",
            date_published: "2023-05-30",
            view_count: 73210,
            duration: 1800, // 30 minutes
          },
          {
            _id: "11",
            title: "Fitness at Home",
            description: "Stay fit with these easy home workouts.",
            video_src:
              "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnail_src:
              "https://via.placeholder.com/320x180?text=Fitness+at+Home",
            channel_name: "FitLife",
            date_published: "2023-05-30",
            view_count: 73210,
            duration: 1800, // 30 minutes
          },
          {
            _id: "12",
            title: "Fitness at Home",
            description: "Stay fit with these easy home workouts.",
            video_src:
              "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnail_src:
              "https://via.placeholder.com/320x180?text=Fitness+at+Home",
            channel_name: "FitLife",
            date_published: "2023-05-30",
            view_count: 73210,
            duration: 1800, // 30 minutes
          },
          {
            _id: "13",
            title: "Fitness at Home",
            description: "Stay fit with these easy home workouts.",
            video_src:
              "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnail_src:
              "https://via.placeholder.com/320x180?text=Fitness+at+Home",
            channel_name: "FitLife",
            date_published: "2023-05-30",
            view_count: 73210,
            duration: 1800, // 30 minutes
          },
          {
            _id: "14",
            title: "Fitness at Home",
            description: "Stay fit with these easy home workouts.",
            video_src:
              "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnail_src:
              "https://via.placeholder.com/320x180?text=Fitness+at+Home",
            channel_name: "FitLife",
            date_published: "2023-05-30",
            view_count: 73210,
            duration: 1800, // 30 minutes
          },
          {
            _id: "15",
            title: "Fitness at Home",
            description: "Stay fit with these easy home workouts.",
            video_src:
              "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnail_src:
              "https://via.placeholder.com/320x180?text=Fitness+at+Home",
            channel_name: "FitLife",
            date_published: "2023-05-30",
            view_count: 73210,
            duration: 1800, // 30 minutes
          },
          {
            _id: "16",
            title: "Fitness at Home",
            description: "Stay fit with these easy home workouts.",
            video_src:
              "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnail_src:
              "https://via.placeholder.com/320x180?text=Fitness+at+Home",
            channel_name: "FitLife",
            date_published: "2023-05-30",
            view_count: 73210,
            duration: 1800, // 30 minutes
          },
          {
            _id: "17",
            title: "Fitness at Home",
            description: "Stay fit with these easy home workouts.",
            video_src:
              "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnail_src:
              "https://via.placeholder.com/320x180?text=Fitness+at+Home",
            channel_name: "FitLife",
            date_published: "2023-05-30",
            view_count: 73210,
            duration: 1800, // 30 minutes
          },
          {
            _id: "18",
            title: "Fitness at Home",
            description: "Stay fit with these easy home workouts.",
            video_src:
              "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnail_src:
              "https://via.placeholder.com/320x180?text=Fitness+at+Home",
            channel_name: "FitLife",
            date_published: "2023-05-30",
            view_count: 73210,
            duration: 1800, // 30 minutes
          },
          {
            _id: "19",
            title: "Fitness at Home",
            description: "Stay fit with these easy home workouts.",
            video_src:
              "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnail_src:
              "https://via.placeholder.com/320x180?text=Fitness+at+Home",
            channel_name: "FitLife",
            date_published: "2023-05-30",
            view_count: 73210,
            duration: 1800, // 30 minutes
          },
          {
            _id: "20",
            title: "Fitness at Home",
            description: "Stay fit with these easy home workouts.",
            video_src:
              "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnail_src:
              "https://via.placeholder.com/320x180?text=Fitness+at+Home",
            channel_name: "FitLife",
            date_published: "2023-05-30",
            view_count: 73210,
            duration: 1800, // 30 minutes
          },
          // Add more mock videos as needed
        ];

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
          <p></p>
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
