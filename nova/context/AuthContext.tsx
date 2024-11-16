// context/AuthContext.tsx

import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

interface UserData {
  UID: string;
  username: string;
  channels_owned: string[]; // Added to store channel IDs
  first_name?: string;
  last_name?: string;
  email?: string;
  acc_creation_date?: string;
  exp: number;
  iat: number;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  signup: (userData: any) => Promise<void>;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  createChannel: (channelData: any) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const signup = async (userData: any) => {
    try {
      const response = await fetch("http://127.0.0.1:3001/user/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      console.log("Signup successful");
    } catch (error: any) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const login = async (credentials: any) => {
    try {
      const response = await fetch("http://127.0.0.1:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      // **Use response.text() to get the token as a string**
      let token = await response.text();

      // **Remove any surrounding quotes**
      token = token.replace(/^"|"$/g, "");

      // **Store the token without quotes**
      localStorage.setItem("token", token);

      const userData = parseJwt(token);

      if (!userData) {
        throw new Error("Invalid token");
      }

      // Fetch full user profile
      const profileResponse = await fetch("http://127.0.0.1:3001/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        console.error("Profile Fetch Error Response:", errorText);
        throw new Error("Failed to fetch user profile");
      }

      const profileData = await profileResponse.json();

      // Combine basic userData and profileData
      const fullUserData: UserData = {
        ...userData,
        ...profileData,
        channels_owned: profileData.channels_owned || [],
      };

      setUser(fullUserData);
      setLoading(false);

      console.log("Login successful");
    } catch (error: any) {
      console.error("Login error:", error);
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  const createChannel = async (channelData: any) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User not authenticated");
    }

    try {
      const response = await fetch("http://127.0.0.1:3001/channel/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(channelData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Channel creation failed");
      }

      console.log("Channel created successfully");
    } catch (error: any) {
      console.error("Channel creation error:", error);
      throw error;
    }
  };

  // Helper function to parse JWT token
  const parseJwt = (token: string): UserData | null => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to parse JWT:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = parseJwt(token);

      if (!userData) {
        console.error("Invalid token");
        logout();
        setLoading(false);
        return;
      }

      const fetchUserProfile = async () => {
        try {
          const profileResponse = await fetch("http://127.0.0.1:3001/user/profile", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!profileResponse.ok) {
            const errorText = await profileResponse.text();
            console.error("Profile Fetch Error Response:", errorText);
            throw new Error("Failed to fetch user profile");
          }

          const profileData = await profileResponse.json();

          // Combine basic userData and profileData
          const fullUserData: UserData = {
            ...userData,
            ...profileData,
            channels_owned: profileData.channels_owned || [],
          };

          setUser(fullUserData);
        } catch (error: any) {
          console.error("Error fetching user profile:", error);
          logout();
        } finally {
          setLoading(false);
        }
      };

      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, createChannel }}>
      {children}
    </AuthContext.Provider>
  );
};
