// // components/VideoCard.tsx

// import Link from 'next/link';

// interface Video {
//   _id: string;
//   title: string;
//   description: string;
//   video_src: string;
// }

// const VideoCard = ({ video }: { video: Video }) => {
//   return (
//     <div className="video-card">
//       <Link href={`/video/${video._id}`}>
//         <img
//           src={`http://127.0.0.1:3001/uploads/${video.video_src}/thumbnail.jpg`}
//           alt={video.title}
//           className="video-thumbnail"
//         />
//       </Link>
//       <div className="video-info">
//         <h3 className="video-title">{video.title}</h3>
//         <p className="video-description">{video.description}</p>
//       </div>
//     </div>
//   );
// };

// export default VideoCard;





























// components/VideoCard.tsx

import Link from 'next/link';

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

const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  const hoursStr = hours > 0 ? `${hours}:` : '';
  const minutesStr = minutes < 10 && hours > 0 ? `0${minutes}:` : `${minutes}:`;
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${hoursStr}${minutesStr}${secondsStr}`;
};

const VideoCard = ({ video }: { video: Video }) => {
  return (
    <div className="video-card">
      <Link href={`/video/${video._id}`}>
        <div className="thumbnail-wrapper">
          <img
            src={video.thumbnail_src}
            alt={video.title}
            className="video-thumbnail"
          />
          <span className="duration">{formatDuration(video.duration)}</span>
        </div>
      </Link>
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <p className="channel-name">{video.channel_name}</p>
        <p className="metadata">
          {video.view_count.toLocaleString()} views • {video.date_published}
        </p>
      </div>
    </div>
  );
};

export default VideoCard;
