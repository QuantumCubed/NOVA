// pages/video/[id].tsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import styles from "../../styles/VideoPage.module.css";
import { Video } from "../../interfaces/Video";
import { useChannels } from "../../hooks/useChannels";

export default function VideoPage() {
  const router = useRouter();
  const { id } = router.query;
  const [video, setVideo] = useState<Video | null>(null);
  const [loadingVideo, setLoadingVideo] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { channels, loading: loadingChannels } = useChannels();

  useEffect(() => {
    if (!id || loadingChannels) return;

    const fetchVideo = async () => {
      try {
        // Fetch video data
        const response = await fetch(`http://localhost:3001/watch/${id}`, {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error("Video not found.");
        }
        const data = await response.json();
        console.log("Fetched Video Data:", data);

        // Extract the correct video_src URL
        let videoSrc = data.video_src;
        if (videoSrc && !videoSrc.startsWith("http")) {
          videoSrc = `https://127.0.0.1:8443/watch/${id}/output.mpd`;
        }

        // Create a mapping from channel ID to channel name
        const channelIdToNameMap: { [key: string]: string } = {};
        channels.forEach((channel: any) => {
          channelIdToNameMap[String(channel._id)] = channel.channel_name;
        });

        const channelName =
          channelIdToNameMap[String(data.channel)] || "Unknown Channel";

        // Extract date_published
        let datePublished = data.date_published;
        if (datePublished && datePublished.$date) {
          datePublished = datePublished.$date;
        }

        // Transform data to match the Video interface
        const transformedVideo: Video = {
          _id: data._id,
          title: data.title,
          description: data.description,
          video_src: videoSrc,
          thumbnail_src: data.thumbnail_src,
          channel: data.channel,
          channel_name: channelName,
          date_published: datePublished,
          view_count: data.viewCount || 0,
          duration: Number(data.duration) || 0,
        };

        setVideo(transformedVideo);
      } catch (error: any) {
        console.error("Error fetching video:", error);
        setError(error.message);
      } finally {
        setLoadingVideo(false);
      }
    };

    fetchVideo();
  }, [id, channels, loadingChannels]);

  useEffect(() => {
    if (video) {
      import("dashjs")
        .then((dashjs) => {
          const player = dashjs.MediaPlayer().create();
          const videoElement = document.querySelector(
            "#videoPlayer"
          ) as HTMLMediaElement | null;
          if (videoElement) {
            player.initialize(videoElement, video.video_src, true);
          }
          return () => {
            player.reset();
          };
        })
        .catch((err) => {
          console.error("Failed to load dashjs:", err);
        });
    }
  }, [video]);

  if (loadingVideo || loadingChannels)
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );

  if (error || !video) {
    return (
      <div>
        <Navbar />
        <p>{error || "Video not available."}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.videoContainer}>
        <div className={styles.videoPlayer}>
          <video id="videoPlayer" controls className={styles.player}></video>
        </div>
        <div className={styles.videoDetails}>
          <h1 className={styles.title}>{video.title}</h1>
          <p className={styles.channelName}>@{video.channel_name}</p>
          <p className={styles.metadata}>
            {video.view_count?.toLocaleString() || "0"} views •{" "}
            {new Date(video.date_published).toLocaleDateString()}
          </p>
          <p className={styles.description}>{video.description}</p>
        </div>
      </div>
    </>
  );
}









// // pages/video/[id].tsx

// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import Navbar from "../../components/Navbar";
// import styles from "../../styles/VideoPage.module.css";
// import { Video } from "../../interfaces/Video";

// export default function VideoPage() {
//   const router = useRouter();
//   const { id } = router.query;
//   const [video, setVideo] = useState<Video | null>(null);
//   const [loadingVideo, setLoadingVideo] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!id) return;

//     const fetchVideo = async () => {
//       try {
//         // Fetch video data
//         const response = await fetch(`http://localhost:3001/watch/${id}`, {
//           method: "POST",
//         });
//         if (!response.ok) {
//           throw new Error("Video not found.");
//         }
//         const data = await response.json();
//         console.log("Fetched Video Data:", data);

//         // Extract the correct video_src URL
//         let videoSrc = data.video_src;
//         if (videoSrc && !videoSrc.startsWith("http")) {
//           videoSrc = `https://127.0.0.1:8443/watch/${id}/output.mpd`;
//         }

//         // Fetch channel name directly
//         let channelName = "Unknown Channel";
//         if (data.channel) {
//           const channelResponse = await fetch(
//             `http://localhost:3001/channels/${data.channel}`
//           );
//           if (channelResponse.ok) {
//             const channelData = await channelResponse.json();
//             channelName = channelData.channel_name || channelName;
//           }
//         }

//         // Extract date_published
//         let datePublished = data.date_published;
//         if (datePublished && datePublished.$date) {
//           datePublished = datePublished.$date;
//         }

//         // Transform data to match the Video interface
//         const transformedVideo: Video = {
//           _id: data._id,
//           title: data.title,
//           description: data.description,
//           video_src: videoSrc,
//           thumbnail_src: data.thumbnail_src,
//           channel: data.channel,
//           channel_name: channelName,
//           date_published: datePublished,
//           view_count: data.viewCount || 0,
//           duration: Number(data.duration) || 0,
//         };

//         setVideo(transformedVideo);
//       } catch (error: any) {
//         console.error("Error fetching video:", error);
//         setError(error.message);
//       } finally {
//         setLoadingVideo(false);
//       }
//     };

//     fetchVideo();
//   }, [id]);

//   useEffect(() => {
//     if (video) {
//       import("dashjs")
//         .then((dashjs) => {
//           const player = dashjs.MediaPlayer().create();
//           const videoElement = document.querySelector(
//             "#videoPlayer"
//           ) as HTMLMediaElement | null;
//           if (videoElement) {
//             player.initialize(videoElement, video.video_src, true);
//           }
//           return () => {
//             player.reset();
//           };
//         })
//         .catch((err) => {
//           console.error("Failed to load dashjs:", err);
//         });
//     }
//   }, [video]);

//   if (loadingVideo)
//     return (
//       <div className={styles.loadingContainer}>
//         <div className={styles.spinner}></div>
//       </div>
//     );

//   if (error || !video) {
//     return (
//       <div>
//         <Navbar />
//         <p>{error || "Video not available."}</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <div className={styles.videoContainer}>
//         <div className={styles.videoPlayer}>
//           <video id="videoPlayer" controls className={styles.player}></video>
//         </div>
//         <div className={styles.videoDetails}>
//           <h1 className={styles.title}>{video.title}</h1>
//           <p className={styles.channelName}>@{video.channel_name}</p>
//           <p className={styles.metadata}>
//             {video.view_count?.toLocaleString() || "0"} views •{" "}
//             {new Date(video.date_published).toLocaleDateString()}
//           </p>
//           <p className={styles.description}>{video.description}</p>
//         </div>
//       </div>
//     </>
//   );
// }
