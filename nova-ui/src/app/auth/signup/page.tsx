// src/app/auth/signup/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Header from "../../components/Header"; // Import Header

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div
      className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 dark:bg-cover dark:bg-center"
      style={{ backgroundImage: "url('/Space.jpg')" }}
    >
      {/* Header at the top */}
      <Header />

      {/* Main content area */}
      <div className="flex flex-grow items-center justify-center p-8 bg-white dark:bg-black dark:bg-opacity-50">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
        >
          <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-8">
            Create an Account
          </h2>

          {error && (
            <p className="mb-4 text-center text-red-500 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="mb-4">
            <label
              htmlFor="username"
              className="block mb-2 font-medium text-gray-700 dark:text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              className="w-full px-4 py-3 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-3 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-4 py-3 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="profilePictureUrl"
              className="block mb-2 font-medium text-gray-700 dark:text-gray-300"
            >
              Profile Picture URL (optional)
            </label>
            <input
              id="profilePictureUrl"
              type="url"
              className="w-full px-4 py-3 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
              value={profilePictureUrl}
              onChange={(e) => setProfilePictureUrl(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            Sign Up
          </button>

          <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-blue-500 hover:underline dark:text-blue-400">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
