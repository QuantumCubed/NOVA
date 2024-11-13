// components/Navbar.tsx

import Link from 'next/link';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  FaHome,
  FaUpload,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaBars,
  FaSun,     // Imported FaSun
  FaMoon,    // Imported FaMoon
} from 'react-icons/fa';
import styles from './Navbar.module.css';
import Sidebar from './Sidebar';

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode toggle

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <button
            onClick={toggleSidebar}
            className={styles.navItem}
            aria-label="Open Menu"
          >
            <FaBars size={24} />
            <span>Menu</span>
          </button>
          <Link href="/" passHref legacyBehavior>
            <div className={styles.navItem}>
              <FaHome size={24} />
              <span>Home</span>
            </div>
          </Link>
        </div>
        <div className={styles.navRight}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={styles.navItem}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
            <span>{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>
          {authContext?.user ? (
            <>
              <Link href="/upload" passHref legacyBehavior>
                <div className={styles.navItem}>
                  <FaUpload size={24} />
                  <span>Upload</span>
                </div>
              </Link>
              <button
                onClick={authContext.logout}
                className={styles.navItem}
                aria-label="Logout"
              >
                <FaSignOutAlt size={24} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" passHref legacyBehavior>
                <div className={styles.navItem}>
                  <FaSignInAlt size={24} />
                  <span>Login</span>
                </div>
              </Link>
              <Link href="/signup" passHref legacyBehavior>
                <div className={styles.navItem}>
                  <FaUserPlus size={24} />
                  <span>Signup</span>
                </div>
              </Link>
            </>
          )}
        </div>
      </nav>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Navbar;
