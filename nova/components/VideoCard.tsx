// components/VideoCard.tsx

import Link from "next/link";
import styles from "./VideoCard.module.css";
import { Video } from "../interfaces/Video";

const formatDuration = (duration: number) => {
  if (isNaN(duration) || duration < 0) return "0:00";

  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);

  const hoursStr = hours > 0 ? `${hours}:` : "";
  const minutesStr =
    minutes < 10 && hours > 0 ? `0${minutes}:` : `${minutes}:`;
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${hoursStr}${minutesStr}${secondsStr}`;
};

const VideoCard = ({ video }: { video: Video }) => {
  const duration = Number(video.duration);

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
                (e.target as HTMLImageElement).src = "/default-thumbnail.png";
              }}
            />
            <span className={styles.duration}>
              {formatDuration(duration)}
            </span>
          </div>
          <div className={styles.videoInfo}>
            <h3 className={styles.videoTitle}>{video.title}</h3>
            <p className={styles.channelName}>@{video.channel_name}</p>
            <p className={styles.metadata}>
              {video.view_count?.toLocaleString() || "0"} views •{" "}
              {new Date(video.date_published).toLocaleDateString()}
            </p>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default VideoCard;
