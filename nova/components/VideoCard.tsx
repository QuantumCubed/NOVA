// components/VideoCard.tsx

import Link from "next/link";
import styles from "./VideoCard.module.css"; // Ensure this path is correct

interface Video {
  _id: string;
  title: string;
  description: string;
  video_src: string;
  thumbnail_src: string;
  channel_name: string;
  date_published: string;
  viewCount: number; // Updated from view_count to viewCount
  duration: number; // Ensure this field exists in the backend
}

const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  const hoursStr = hours > 0 ? `${hours}:` : "";
  const minutesStr = minutes < 10 && hours > 0 ? `0${minutes}:` : `${minutes}:`;
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${hoursStr}${minutesStr}${secondsStr}`;
};

const VideoCard = ({ video }: { video: Video }) => {
  return (
    <div className={styles.videoCard}>
      <Link href={`/video/${video._id}`} passHref legacyBehavior>
        <a>
          <div className={styles.thumbnailWrapper}>
            <img
              src={video.thumbnail_src}
              alt={video.title}
              className={styles.videoThumbnail}
            />
            <span className={styles.duration}>
              {formatDuration(video.duration)}
            </span>
          </div>
          <div className={styles.videoInfo}>
            <h3 className={styles.videoTitle}>{video.title}</h3>
            <p className={styles.channelName}>@{video.channel_name}</p>
            <p className={styles.metadata}>
              {video.viewCount.toLocaleString()} views •{" "}
              {new Date(video.date_published).toLocaleDateString()}
            </p>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default VideoCard;
