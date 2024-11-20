// components/ChannelCard.tsx

import Link from "next/link";
import styles from "./ChannelCard.module.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify"; // Import toast

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

interface ChannelCardProps {
  channel: Channel;
  isEditable?: boolean;
  onEdit?: (channelId: string) => void;
  onDelete?: (channelId: string) => void;
}

const ChannelCard = ({
  channel,
  isEditable = false,
  onEdit,
  onDelete,
}: ChannelCardProps) => {
  // Encode the channel name to make it URL-safe
  const encodedChannelName = encodeURIComponent(channel.channel_name);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(channel._id);
      toast.info("Edit action triggered.");
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(channel._id);
      toast.warn("Delete action triggered.");
    }
  };

  return (
    <div className={styles.channelCard}>
      <Link href={`/channels/@${encodedChannelName}`} passHref legacyBehavior>
        <a>
          <div className={styles.channelBanner}>
            {channel.channel_banner_src ? (
              <img
                src={`http://127.0.0.1:3001/channel/${channel._id}/channel_banner`}
                alt={`${channel.channel_name} Banner`}
              />
            ) : (
              <div className={styles.defaultBanner}>No Banner</div>
            )}
          </div>
          <div className={styles.channelInfo}>
            <div className={styles.channelIcon}>
              {channel.channel_icon_src ? (
                <img
                  src={`http://127.0.0.1:3001/channel/${channel._id}/channel_icon`}
                  alt={`${channel.channel_name} Icon`}
                />
              ) : (
                <div className={styles.defaultIcon}>CI</div>
              )}
            </div>
            <div className={styles.channelDetails}>
              <h3 className={styles.channelName}>{channel.channel_name}</h3>
              <p className={styles.channelDescription}>{channel.description}</p>
              <p className={styles.subscriberCount}>
                {channel.subscriber_count.toLocaleString()} Subscribers
              </p>
            </div>
          </div>
        </a>
      </Link>
      {isEditable && (
        <div className={styles.actionButtons}>
          <button
            onClick={handleEdit}
            className={styles.editButton}
            aria-label="Edit Channel"
          >
            <FaEdit />
          </button>
          <button
            onClick={handleDelete}
            className={styles.deleteButton}
            aria-label="Delete Channel"
          >
            <FaTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChannelCard;
