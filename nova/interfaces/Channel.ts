// interfaces/Channel.ts

import { Video } from "./Video";

export interface Channel {
  _id: string;
  owner: string;
  channel_name: string;
  description: string;
  subscriber_count: number;
  channel_icon_src: string;
  channel_banner_src: string;
  videos: Video[];
}
