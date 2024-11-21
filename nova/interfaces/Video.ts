// interfaces/Video.ts

export interface Video {
    _id: string;
    title: string;
    description: string;
    video_src: string;
    thumbnail_src: string;
    channel: string; // Channel ID
    channel_name: string; // Channel Name
    date_published: string;
    view_count: number;
    duration: number;
  }
  