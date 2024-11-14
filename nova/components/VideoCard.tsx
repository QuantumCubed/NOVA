// components/VideoCard.tsx

import Link from 'next/link';

interface Video {
  _id: string;
  title: string;
  description: string;
  video_src: string;
}

const VideoCard = ({ video }: { video: Video }) => {
  return (
    <div className="video-card">
      <Link href={`/video/${video._id}`}>
        <img
          src={`http://127.0.0.1:3001/uploads/${video.video_src}/thumbnail.jpg`}
          alt={video.title}
          className="video-thumbnail"
        />
      </Link>
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-description">{video.description}</p>
      </div>
    </div>
  );
};

export default VideoCard;
