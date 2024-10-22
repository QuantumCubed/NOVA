import React from "react";
import Header from "./components/Header";
import VideoCard from "./components/VideoCard";

const HomePage: React.FC = () => {
  const videoData = [
    {
      videoId: "1",
      thumbnailUrl: "/path/to/thumbnail1.jpg",
      title: "First Awesome Video",
      author: "John Doe",
      views: 123456,
      uploadDate: "2 days ago",
      duration: "10:23",
    },
    {
      videoId: "2",
      thumbnailUrl: "/path/to/thumbnail2.jpg",
      title: "Second Awesome Video",
      author: "Jane Smith",
      views: 654321,
      uploadDate: "1 week ago",
      duration: "15:45",
    },
    {
      videoId: "2",
      thumbnailUrl: "/path/to/thumbnail2.jpg",
      title: "Second Awesome Video",
      author: "Jane Smith",
      views: 654321,
      uploadDate: "1 week ago",
      duration: "15:45",
    },
    {
      videoId: "2",
      thumbnailUrl: "/path/to/thumbnail2.jpg",
      title: "Second Awesome Video",
      author: "Jane Smith",
      views: 654321,
      uploadDate: "1 week ago",
      duration: "15:45",
    },
    {
      videoId: "2",
      thumbnailUrl: "/path/to/thumbnail2.jpg",
      title: "Second Awesome Video",
      author: "Jane Smith",
      views: 654321,
      uploadDate: "1 week ago",
      duration: "15:45",
    },
    {
      videoId: "2",
      thumbnailUrl: "/path/to/thumbnail2.jpg",
      title: "Second Awesome Video",
      author: "Jane Smith",
      views: 654321,
      uploadDate: "1 week ago",
      duration: "15:45",
    },
    {
      videoId: "2",
      thumbnailUrl: "/path/to/thumbnail2.jpg",
      title: "Second Awesome Video",
      author: "Jane Smith",
      views: 654321,
      uploadDate: "1 week ago",
      duration: "15:45",
    },
    {
      videoId: "2",
      thumbnailUrl: "/path/to/thumbnail2.jpg",
      title: "Second Awesome Video",
      author: "Jane Smith",
      views: 654321,
      uploadDate: "1 week ago",
      duration: "15:45",
    },

    // Add more video data here
  ];

  return (
    <div>
      <Header />
      <main className="p-4 mt-16 ml-48">
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
