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
    <div style={{ border: '1px solid #333', padding: '10px', margin: '10px' }}>
      <Link href={`/video/${video._id}`}>
        <h3>{video.title}</h3>
      </Link>
      <p>{video.description}</p>
    </div>
  );
};

export default VideoCard;
