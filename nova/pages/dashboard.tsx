// pages/dashboard.tsx

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!authContext?.user) {
      router.push('/login');
    }
  }, [authContext, router]);

  if (!authContext?.user) {
    return null; // Render nothing or a loader while redirecting
  }

  const { username, first_name, last_name, email } = authContext.user;

  return (
    <div>
      <Navbar />
      <h1>Dashboard</h1>
      <p><strong>Username:</strong> {username}</p>
      {first_name && <p><strong>First Name:</strong> {first_name}</p>}
      {last_name && <p><strong>Last Name:</strong> {last_name}</p>}
      {email && <p><strong>Email:</strong> {email}</p>}
    </div>
  );
}
