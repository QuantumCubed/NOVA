// context/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

// Define the structure of user data
interface UserData {
  UID: string;
  username: string;
  channels_owned: string[]; // Stores channel IDs
  first_name?: string;
  last_name?: string;
  email?: string;
  acc_creation_date?: string;
  pfp_src?: string; // Added pfp_src
  exp: number;
  iat: number;
}

// Define the structure of the authentication context
interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  signup: (userData: any) => Promise<void>;
  login: (credentials: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  createChannel: (channelData: any) => Promise<void>;
  refetchUser: () => Promise<void>; // Added refetchUser
}

// Initialize the AuthContext with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signup: async () => {},
  login: async () => ({ success: false }),
  logout: () => {},
  createChannel: async () => {},
  refetchUser: async () => {}, // Added refetchUser
});

// AuthProvider component that wraps the application
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

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

  // Signup function
  const signup = async (userData: any) => {
    try {
      const response = await fetch("http://localhost:3001/user/add", {
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
      toast.success("Signup successful! Please log in.");
      router.push("/login");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Signup failed.");
      throw error;
    }
  };

  // Login function with updated error handling
  const login = async (
    credentials: any
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, message: errorData.message || "Login failed" };
      }

      // **Use response.json() to correctly parse the token**
      const token: string = await response.json();

      // Store the token as is
      localStorage.setItem("token", token);

      const userData = parseJwt(token);

      if (!userData) {
        return { success: false, message: "Invalid token" };
      }

      // Fetch full user profile using the token
      const profileResponse = await fetch(
        "http://localhost:3001/user/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        console.error("Profile Fetch Error Response:", errorText);
        return { success: false, message: "Failed to fetch user profile" };
      }

      const profileData = await profileResponse.json();

      // Combine basic userData and profileData
      const fullUserData: UserData = {
        UID: userData.UID,
        username: userData.username,
        channels_owned: profileData.channels_owned || [],
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email,
        acc_creation_date: profileData.acc_creation_date,
        pfp_src: profileData.pfp_src, // Ensure pfp_src is included
        exp: userData.exp,
        iat: userData.iat,
      };

      setUser(fullUserData);
      setLoading(false);

      console.log("Login successful");
      toast.success("Login successful!");
      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      setLoading(false);
      toast.error(error.message || "Login failed.");
      return { success: false, message: error.message || "Login failed" };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
    toast.info("Logged out successfully.");
  };

  // Create Channel function
  const createChannel = async (channelData: any) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User not authenticated");
    }

    try {
      const response = await fetch("http://localhost:3001/channel/create", {
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
      toast.success("Channel created successfully!");
      await refetchUser(); // Update channels_owned
    } catch (error: any) {
      console.error("Channel creation error:", error);
      toast.error(error.message || "Channel creation failed.");
      throw error;
    }
  };

  // Refetch user function
  const refetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const profileResponse = await fetch(
        "http://localhost:3001/user/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        console.error("Profile Fetch Error Response:", errorText);
        throw new Error("Failed to fetch user profile");
      }

      const profileData = await profileResponse.json();

      // Combine basic userData and profileData
      const fullUserData: UserData = {
        UID: user?.UID || "",
        username: user?.username || "",
        channels_owned: profileData.channels_owned || [],
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email,
        acc_creation_date: profileData.acc_creation_date,
        pfp_src: profileData.pfp_src, // Ensure pfp_src is included
        exp: user?.exp || 0,
        iat: user?.iat || 0,
      };

      setUser(fullUserData);
      console.log("User data refetched successfully.");
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      logout();
    }
  };

  // Effect to check authentication status on initial load
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
          const profileResponse = await fetch(
            "http://localhost:3001/user/profile",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!profileResponse.ok) {
            const errorText = await profileResponse.text();
            console.error("Profile Fetch Error Response:", errorText);
            throw new Error("Failed to fetch user profile");
          }

          const profileData = await profileResponse.json();

          // Combine basic userData and profileData
          const fullUserData: UserData = {
            UID: userData.UID,
            username: userData.username,
            channels_owned: profileData.channels_owned || [],
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            email: profileData.email,
            acc_creation_date: profileData.acc_creation_date,
            pfp_src: profileData.pfp_src, // Ensure pfp_src is included
            exp: userData.exp,
            iat: userData.iat,
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
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        createChannel,
        refetchUser,
      }} // Included refetchUser
    >
      {children}
    </AuthContext.Provider>
  );
};
