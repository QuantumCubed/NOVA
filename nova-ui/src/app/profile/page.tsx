// src/app/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ProfilePage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      const fetchUserData = async () => {
        const res = await fetch(`/api/user/${session.user.id}`);
        if (res.ok) {
          const data = await res.json();
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
          setProfilePictureUrl(data.profilePictureUrl || null);
        } else {
          setError("Failed to load user data");
        }
      };

      fetchUserData();
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    const res = await fetch("/api/user/update", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      router.refresh(); // Refresh the page to show updated data
    } else {
      const data = await res.json();
      setError(data.message || "An error occurred while updating profile");
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePictureUrl(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-6 text-2xl font-bold text-center">Your Profile</h2>
      {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="firstName" className="block mb-2 font-medium">First Name</label>
          <input
            id="firstName"
            type="text"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block mb-2 font-medium">Last Name</label>
          <input
            id="lastName"
            type="text"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="profilePicture" className="block mb-2 font-medium">Profile Picture</label>
          {profilePictureUrl && <img src={profilePictureUrl} alt="Profile Preview" className="mb-4 w-32 h-32 rounded-full object-cover" />}
          <input id="profilePicture" type="file" accept="image/*" onChange={handleProfilePictureChange} />
        </div>
        <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfilePage;
