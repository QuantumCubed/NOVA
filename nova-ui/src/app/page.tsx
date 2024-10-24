import React from "react";
import Header from "./components/Header";
import VideoCard from "./components/VideoCard";

const HomePage: React.FC = () => {
  const videoData = [
    {
      videoId: "1",
      thumbnailUrl: "/Valorant_Montage.png",
      title: " Cold ❄️🔥 (Valorant Montage) ",
      author: "Not Wizzy",
      views: 999,
      uploadDate: "1 hour ago",
      duration: "1:16",
    },
    {
      videoId: "2",
      thumbnailUrl: "/Naruto_AMV.jpg",
      title: "Naruto vs Sasuke ✊ [AMV] ",
      author: "YouIn2012",
      views: 44478,
      uploadDate: "1 week ago",
      duration: "2:05",
    },
    {
      videoId: "3",
      thumbnailUrl: "/Lucid_Dreams.jpg",
      title: "Juice Wrld - Lucid Dreams",
      author: "Lyrical Lemonade",
      views: 1043887987,
      uploadDate: "6 year ago",
      duration: "3:50",
    },
    {
      videoId: "4",
      thumbnailUrl: "/Comp_Sci.jpg",
      title: "How To Get a Job 💻",
      author: "Raj Patel",
      views: 654321,
      uploadDate: "1 week ago",
      duration: "15:45",
    },
    {
      videoId: "5",
      thumbnailUrl: "/Vagabond.jpg",
      title: "Why You Should Read Vagabond",
      author: "TAKEZO",
      views: 94129,
      uploadDate: "1 week ago",
      duration: "15:45",
    },
    {
      videoId: "6",
      thumbnailUrl: "/Ted_Talk.jpg",
      title: "How To Speak Better English",
      author: "TED",
      views: 912901,
      uploadDate: "4 month ago",
      duration: "15:45",
    },
    {
      videoId: "7",
      thumbnailUrl: "/Photoshop.jpg",
      title: "AI Photoshop Tutorial",
      author: "CHAT GP IT",
      views: 48989,
      uploadDate: "2 week ago",
      duration: "11:45",
    },
    {
      videoId: "8",
      thumbnailUrl: "/Meditation.jpg",
      title: "10 Minute Yoga Nidra Meditation",
      author: "Musashi",
      views: 77889,
      uploadDate: "4 daysago",
      duration: "10:00",
    },

    // Add more video data here
  ];

  return (
    <div>
      <Header />
      <main className="p-4 mt-16 ml-48">
        {/* Use ml-48 (12rem) if sidebar pushes content aside */}
        {/* Your main content goes here */}
        {/* Add more content as needed */}
        <div className="video-grid">
          {videoData.map((video) => (
            <VideoCard
              key={video.videoId}
              videoId={video.videoId}
              thumbnailUrl={video.thumbnailUrl}
              title={video.title}
              author={video.author}
              views={video.views}
              uploadDate={video.uploadDate}
              duration={video.duration}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
