// hooks/useChannels.ts

import { useState, useEffect } from "react";

export const useChannels = () => {
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch("http://localhost:3001/load/channels");
        if (!response.ok) {
          throw new Error("Failed to fetch channels");
        }
        const data = await response.json();
        setChannels(data);
      } catch (error) {
        console.error("Error fetching channels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  return { channels, loading };
};
