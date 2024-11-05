// src/app/auth/signin/page.tsx
"use client";

import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header"; // Import the Header component

const SignInPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <Header /> {/* Header added here */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 bg-white rounded shadow-md">
          <h2 className="mb-6 text-2xl font-bold text-center">Sign In</h2>

          {error && <p className="mb-4 text-red-500">{error}</p>}

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

          <div className="mb-6">
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

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Sign In
          </button>

          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default SignInPage;
