// components/VideoCard.tsx

import Link from "next/link";
import styles from "./VideoCard.module.css"; // Ensure this path is correct

interface Video {
  _id: string;
  title: string;
  description: string;
  videoSrc: string;
  thumbnailSrc: string;
  channelName: string;
  datePublished: string;
  viewCount: number;
  duration: number;
}

const formatDuration = (duration: number) => {
  if (isNaN(duration) || duration < 0) return "0:00"; // Handle invalid durations

  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  const hoursStr = hours > 0 ? `${hours}:` : "";
  const minutesStr = minutes < 10 && hours > 0 ? `0${minutes}:` : `${minutes}:`;
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${hoursStr}${minutesStr}${secondsStr}`;
};

const VideoCard = ({ video }: { video: Video }) => {
  const duration = Number(video.duration); // Ensure duration is a number

  return (
    <div className={styles.videoCard}>
      <Link href={`/video/${video._id}`} passHref legacyBehavior>
        <a>
          <div className={styles.thumbnailWrapper}>
            <img
              src={`http://localhost:3001/${video._id}/thumbnail`}
              alt={video.title}
              className={styles.videoThumbnail}
              onError={(e) => {
                console.error("Failed to load thumbnail:", e);
                (e.target as HTMLImageElement).src = "/default-thumbnail.png"; // Fallback thumbnail
              }}
            />
            <span className={styles.duration}>
              {formatDuration(duration)}
            </span>
          </div>
          <div className={styles.videoInfo}>
            <h3 className={styles.videoTitle}>{video.title}</h3>
            <p className={styles.channelName}>@{video.channelName}</p>
            <p className={styles.metadata}>
              {video.viewCount?.toLocaleString() || "0"} views •{" "}
              {new Date(video.datePublished).toLocaleDateString()}
            </p>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default VideoCard;
