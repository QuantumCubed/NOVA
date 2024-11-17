// pages/upload.tsx

import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!authContext.loading && !authContext.user) {
      router.push("/login");
    }
  }, [authContext, router]);

  if (authContext.loading) {
    return (
      <div>
        <Navbar />
        <p>Loading...</p>
      </div>
    ); // You can replace this with a spinner or skeleton
  }

  if (!authContext.user) {
    return null; // Prevent rendering the upload form until authenticated
  }

  const { channels_owned } = authContext.user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Ensure the user has at least one channel
    if (!channels_owned || channels_owned.length === 0) {
      alert("No channels found. Please create a channel first.");
      return;
    }

    // For simplicity, use the first channel
    const channelID = channels_owned[0];

    if (!channelID) {
      setError("Invalid channel ID.");
      return;
    }

    if (!file) {
      alert("Please select a video file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tags", tags);
      formData.append("file", file);

      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3001/${channelID}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Upload failed");
      }

      alert("Video uploaded successfully!");
      router.push("/");
    } catch (error: any) {
      console.error("Upload error:", error);
      setError(error.message || "An error occurred during upload.");
    }
  };

  return (
    <div className="upload-page">
      <Navbar />
      <div className="upload-content">
        <main className="upload-main">
          <h1>Upload Video</h1>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="upload-form">
            <div className="input-group">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Title"
                className="title-input"
              />
              <i className="title-icon fa fa-video"></i>
            </div>
            <div className="input-group">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Description"
                className="description-textarea"
              />
              <i className="description-icon fa fa-file-alt"></i>
            </div>
            <div className="input-group">
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags (comma separated)"
                className="tags-input"
              />
              <i className="tags-icon fa fa-tags"></i>
            </div>
            <div className="input-group">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
                className="video-file-input"
              />
              <i className="file-icon fa fa-upload"></i>
            </div>
            <button type="submit" className="upload-button">
              Upload
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
