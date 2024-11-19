// components/ChannelCard.tsx

import Link from "next/link";
import styles from "./ChannelCard.module.css";

interface Channel {
  _id: string;
  owner: string;
  channel_name: string;
  description: string;
  subscriber_count: number;
  channel_icon_src: string;
  channel_banner_src: string;
  videos: string[]; // vIDs
}

// Utility function to format channel name
const formatChannelName = (name: string) => {
  if (name.length > 8) {
    return `${name.slice(0, 5)}...`;
  }
  return name;
};

const ChannelCard = ({ channel }: { channel: Channel }) => {
  return (
    <div className={styles.channelCard}>
      <Link href={`/channels/${channel._id}`} passHref legacyBehavior>
        <div className={styles.channelBanner}>
          {channel.channel_banner_src ? (
            <img
              src={channel.channel_banner_src}
              alt={`${channel.channel_name} Banner`}
            />
          ) : (
            <div className={styles.defaultBanner}>No Banner</div>
          )}
        </div>
      </Link>
      <div className={styles.channelInfo}>
        <div className={styles.channelIcon}>
          {channel.channel_icon_src ? (
            <img
              src={channel.channel_icon_src}
              alt={`${channel.channel_name} Icon`}
            />
          ) : (
            <div className={styles.defaultIcon}>CI</div>
          )}
        </div>
        <div className={styles.channelDetails}>
          <h3 className={styles.channelName}>
            {formatChannelName(channel.channel_name)}
          </h3>
          <p className={styles.channelDescription}>{channel.description}</p>
          <p className={styles.subscriberCount}>
            {channel.subscriber_count.toLocaleString()} Subscribers
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChannelCard;
