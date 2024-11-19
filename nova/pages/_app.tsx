// pages/_app.tsx

import { AppProps } from "next/app";
import { AuthProvider } from "../context/AuthContext";
import "../styles/globals.css";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify styles

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Initialize with light theme
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  return (
    <AuthProvider>
      <Component {...pageProps} />
      {/* Include ToastContainer once in your app */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // Options: 'light', 'dark', 'colored'
      />
    </AuthProvider>
  );
}

export default MyApp;
