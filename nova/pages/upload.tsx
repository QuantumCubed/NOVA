// pages/upload.tsx

import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [channel, setChannel] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const authContext = useContext(AuthContext);
  const router = useRouter();

  if (!authContext?.user) {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a video file.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('tags', tags);
      formData.append('channel', channel);
      formData.append('file', file);

      const token = localStorage.getItem('token');

      const res = await fetch('http://127.0.0.1:3001/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      alert('Video uploaded successfully!');
      router.push('/');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Upload Video</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <br />
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <br />
        <label>
          Tags (comma separated):
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
        </label>
        <br />
        <label>
          Channel:
          <input type="text" value={channel} onChange={(e) => setChannel(e.target.value)} />
        </label>
        <br />
        <label>
          Video File:
          <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
        <br />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
