// contexts/AuthContext.tsx

import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

interface User {
  UID: string;
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Initialize loading to true
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      const userPayload = JSON.parse(userData) as User;
      const currentTime = Math.floor(Date.now() / 1000);
      const tokenPayload = parseJwt(token) as { exp: number };

      if (tokenPayload.exp < currentTime) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } else {
        setUser(userPayload);
      }
    }
    setLoading(false); // Set loading to false after data is validated
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("http://127.0.0.1:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_log: email, password_log: password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      const token = await res.json();
      const tokenPayload = parseJwt(token) as User;
      const storedUserData = localStorage.getItem("user");
      const userPayload: User = {
        UID: tokenPayload.UID,
        username: tokenPayload.username,
      };

      if (storedUserData) {
        const storedData = JSON.parse(storedUserData);
        userPayload.first_name = storedData.first_name;
        userPayload.last_name = storedData.last_name;
        userPayload.email = storedData.email;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userPayload));
      setUser(userPayload);
      router.push("/"); // Redirect to home page after login
    } catch (error: any) {
      alert(error.message);
    }
  };

  const signup = async (userData: any) => {
    try {
      const res = await fetch("http://127.0.0.1:3001/user/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      // Store user data in localStorage
      const newUser = {
        UID: "", // We don't have the UID yet
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
      };
      localStorage.setItem("user", JSON.stringify(newUser));

      // Automatically log in the user after successful signup
      await login(userData.email, userData.password);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  const parseJwt = (token: string) => {
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
    } catch (e) {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
