// contexts/AuthContext.tsx

import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface User {
  UID: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userPayload = parseJwt(token) as User & { exp: number };
      const currentTime = Math.floor(Date.now() / 1000);
      if (userPayload.exp < currentTime) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } else {
        setUser(userPayload);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('http://127.0.0.1:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_log: email, password_log: password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      const token = await res.json();
      const userPayload = parseJwt(token) as User;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userPayload));
      setUser(userPayload);
      router.push('/'); // Redirect to home page after login
    } catch (error: any) {
      alert(error.message);
    }
  };

  const signup = async (userData: any) => {
    try {
      const res = await fetch('http://127.0.0.1:3001/user/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      // Automatically log in the user after successful signup
      await login(userData.email, userData.password);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
