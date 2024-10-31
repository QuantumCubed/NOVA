// src/app/auth/signup/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Additional fields
  const [username, setUsername] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, username, profilePictureUrl }),
    });

    if (res.ok) {
      // Automatically sign in the user after successful sign-up
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
        setError(signInRes.error);
      } else {
        router.push("/");
      }
    } else {
      const data = await res.json();
      setError(data.message || "An error occurred during sign-up");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 bg-white rounded shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center">Sign Up</h2>

        {error && <p className="mb-4 text-red-500">{error}</p>}

        <div className="mb-4">
          <label htmlFor="username" className="block mb-2 font-medium">
            Username
          </label>
          <input
            id="username"
            type="text"
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="profilePictureUrl" className="block mb-2 font-medium">
            Profile Picture URL (optional)
          </label>
          <input
            id="profilePictureUrl"
            type="url"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            value={profilePictureUrl}
            onChange={(e) => setProfilePictureUrl(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;
