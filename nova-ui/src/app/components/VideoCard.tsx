import Image from "next/image";
import Link from "next/link";
import React from "react";

interface VideoCardProps {
  videoId: string;
  thumbnailUrl: string;
  title: string;
  author: string;
  views: number;
  uploadDate: string;
  duration: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  videoId,
  thumbnailUrl,
  title,
  author,
  views,
  uploadDate,
  duration,
}) => {
  return (
    <div className="video-card">
      {/* Thumbnail */}
      <Link href={`/video/${videoId}`}>
        <div className="thumbnail-container">
          <Image
            src={thumbnailUrl}
            alt={title}
            width={320}
            height={180}
            className="thumbnail"
          />
          <span className="duration">{duration}</span>
        </div>
      </Link>

      {/* Video details */}
      <div className="video-details">
        <Link href={`/video/${videoId}`}>
          <h3 className="video-title">{title}</h3>
        </Link>
        <p className="video-author">{author}</p>
        <p className="video-meta">
          {views.toLocaleString()} views • {uploadDate}
        </p>
      </div>
    </div>
  );
};

export default VideoCard;
