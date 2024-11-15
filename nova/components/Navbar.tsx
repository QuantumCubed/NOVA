// components/Navbar.tsx

import Link from "next/link";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  FaHome,
  FaUpload,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaBars,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import styles from "./Navbar.module.css";
import Sidebar from "./Sidebar";

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Search functionality states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      setIsDarkMode(true);
    }
  };

  const handleSearchInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      // Fetch search results from the backend
      const response = await fetch(
        `http://localhost:3001/search?search=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (searchResultsRef.current && e.target) {
      const targetElement = e.target as Element;
      if (
        !searchResultsRef.current.contains(targetElement) &&
        !targetElement.closest(`.${styles.navbarSearch}`)
      ) {
        setShowResults(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

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
          </button>
          <Link href="/" passHref legacyBehavior>
            <div className={styles.navItem}>
              <FaHome size={24} />
            </div>
          </Link>
        </div>
        <div className={styles.navCenter}>
          <div className={styles.navbarSearch}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              className={styles.searchInput}
              placeholder="Search videos..."
            />
            {showResults && searchResults.length > 0 && (
              <div className={styles.searchResults} ref={searchResultsRef}>
                {searchResults.map((video) => (
                  <Link
                    key={video._id}
                    href={`/video/${video._id}`}
                    passHref
                    legacyBehavior
                  >
                    <div className={styles.resultItem}>{video.title}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className={styles.navRight}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={styles.navItem}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
          </button>
          {authContext?.user ? (
            <>
              <Link href="/upload" passHref legacyBehavior>
                <div className={styles.navItem}>
                  <FaUpload size={24} />
                </div>
              </Link>
              <button
                onClick={authContext.logout}
                className={styles.navItem}
                aria-label="Logout"
              >
                <FaSignOutAlt size={24} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" passHref legacyBehavior>
                <div className={styles.navItem}>
                  <FaSignInAlt size={24} />
                </div>
              </Link>
              <Link href="/signup" passHref legacyBehavior>
                <div className={styles.navItem}>
                  <FaUserPlus size={24} />
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
