// // context/AuthContext.tsx

// import { createContext, useState, useEffect } from "react";
// import { useRouter } from "next/router";

// interface UserData {
//   UID: string;
//   username: string;
//   first_name?: string;
//   last_name?: string;
//   email?: string;
//   acc_creation_date?: string;
//   exp: number;
//   iat: number;
// }

// interface AuthContextType {
//   user: UserData | null;
//   signup: (userData: any) => Promise<void>;
//   login: (credentials: any) => Promise<void>;
//   logout: () => void;
//   createChannel: (channelData: any) => Promise<void>;
// }

// export const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({ children }: any) => {
//   const [user, setUser] = useState<UserData | null>(null);
//   const router = useRouter();

//   const signup = async (userData: any) => {
//     try {
//       const response = await fetch("http://localhost:3001/user/add", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//       });

//       if (!response.ok) {
//         throw new Error("Signup failed");
//       }

//       console.log("Signup successful");
//     } catch (error) {
//       console.error("Signup error:", error);
//       throw error;
//     }
//   };

//   const login = async (credentials: any) => {
//     try {
//       const response = await fetch("http://localhost:3001/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(credentials),
//       });

//       if (!response.ok) {
//         throw new Error("Login failed");
//       }

//       // **Change Here:** Use response.text() instead of response.json()
//       const token = await response.text();

//       // **Log the received token for debugging**
//       console.log("Received Token:", token);

//       // Store the token without additional quotes
//       localStorage.setItem("token", token);

//       const userData = parseJwt(token);

//       if (!userData) {
//         throw new Error("Invalid token");
//       }

//       // Fetch full user profile
//       const profileResponse = await fetch("http://localhost:3001/user/profile", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!profileResponse.ok) {
//         throw new Error("Failed to fetch user profile");
//       }

//       const profileData = await profileResponse.json();

//       // Combine basic userData and profileData
//       const fullUserData = {
//         ...userData,
//         ...profileData,
//       };

//       setUser(fullUserData);

//       console.log("Login successful");
//     } catch (error) {
//       console.error("Login error:", error);
//       throw error;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     router.push("/");
//   };

//   const createChannel = async (channelData: any) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       throw new Error("User not authenticated");
//     }

//     try {
//       const response = await fetch("http://localhost:3001/channel/create", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(channelData),
//       });

//       if (!response.ok) {
//         throw new Error("Channel creation failed");
//       }

//       console.log("Channel created successfully");
//     } catch (error) {
//       console.error("Channel creation error:", error);
//       throw error;
//     }
//   };

//   // Helper function to parse JWT token
//   const parseJwt = (token: string): UserData | null => {
//     try {
//       const base64Url = token.split(".")[1];
//       const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//       const jsonPayload = decodeURIComponent(
//         atob(base64)
//           .split("")
//           .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//           .join("")
//       );

//       return JSON.parse(jsonPayload);
//     } catch (error) {
//       console.error("Failed to parse JWT:", error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const userData = parseJwt(token);

//       if (!userData) {
//         console.error("Invalid token");
//         logout();
//         return;
//       }

//       // Fetch full user profile
//       const fetchUserProfile = async () => {
//         try {
//           const profileResponse = await fetch("http://localhost:3001/user/profile", {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });

//           if (!profileResponse.ok) {
//             throw new Error("Failed to fetch user profile");
//           }

//           const profileData = await profileResponse.json();

//           // Combine basic userData and profileData
//           const fullUserData = {
//             ...userData,
//             ...profileData,
//           };

//           setUser(fullUserData);
//         } catch (error) {
//           console.error("Error fetching user profile:", error);
//           logout();
//         }
//       };

//       fetchUserProfile();
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, signup, login, logout, createChannel }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };































// context/AuthContext.tsx

import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

interface UserData {
  UID: string;
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  acc_creation_date?: string;
  exp: number;
  iat: number;
}

interface AuthContextType {
  user: UserData | null;
  signup: (userData: any) => Promise<void>;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  createChannel: (channelData: any) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

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
        throw new Error("Signup failed");
      }

      console.log("Signup successful");
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const login = async (credentials: any) => {
    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      // **Use response.text() to get the token as a string**
      let token = await response.text();

      // **Log the raw token for debugging**
      console.log("Raw Token Response:", token);

      // **Remove any surrounding quotes**
      token = token.replace(/^"|"$/g, '');

      // **Log the cleaned token**
      console.log("Cleaned Token:", token);

      // **Store the token without quotes**
      localStorage.setItem("token", token);

      const userData = parseJwt(token);

      if (!userData) {
        throw new Error("Invalid token");
      }

      // Fetch full user profile
      const profileResponse = await fetch("http://localhost:3001/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile Response Status:", profileResponse.status);

      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        console.error("Profile Fetch Error Response:", errorText);
        throw new Error("Failed to fetch user profile");
      }

      const profileData = await profileResponse.json();

      // Combine basic userData and profileData
      const fullUserData = {
        ...userData,
        ...profileData,
      };

      setUser(fullUserData);

      console.log("Login successful");
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

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
        throw new Error("Channel creation failed");
      }

      console.log("Channel created successfully");
    } catch (error) {
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
        return;
      }

      // Fetch full user profile
      const fetchUserProfile = async () => {
        try {
          const profileResponse = await fetch("http://localhost:3001/user/profile", {
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
          const fullUserData = {
            ...userData,
            ...profileData,
          };

          setUser(fullUserData);
        } catch (error: any) {
          console.error("Error fetching user profile:", error);
          logout();
        }
      };

      fetchUserProfile();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, createChannel }}>
      {children}
    </AuthContext.Provider>
  );
};
