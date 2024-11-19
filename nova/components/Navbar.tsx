// components/Navbar.tsx

import Link from "next/link";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  FaHome,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaBars,
  FaSun,
  FaMoon,
  FaTv, // Import TV icon
} from "react-icons/fa";
import styles from "./Navbar.module.css";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify"; // Import toast

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
      toast.info("Switched to Light Mode");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      setIsDarkMode(true);
      toast.info("Switched to Dark Mode");
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
      // Use the actual backend URL directly
      const response = await fetch(
        `http://localhost:3001/search?search=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        // Attempt to parse error message from response
        let errorMessage = "An error occurred during the search.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error: any) {
      console.error("Error fetching search results:", error);
      toast.error(error.message || "Search failed. Please try again.");
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

  // Handle Logout with toast
  const handleLogout = () => {
    authContext?.logout();
    toast.success("Logged out successfully!");
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <button onClick={toggleSidebar} className={styles.navItem} aria-label="Open Menu">
            <FaBars size={24} />
          </button>
          <Link href="/" passHref legacyBehavior>
            <div className={styles.navItem}>
              <FaHome size={24} />
            </div>
          </Link>
          <Link href="/channellist" passHref legacyBehavior>
            <div className={styles.navItem}>
              <FaTv size={24} />
            </div>
          </Link>
          {/* Removed the Upload button/icon from the Navbar */}
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
          <button onClick={toggleTheme} className={styles.navItem} aria-label="Toggle Dark Mode">
            {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
          </button>
          {authContext?.user ? (
            <>
              {/* Removed Upload Button from Navbar */}
              <button onClick={handleLogout} className={styles.navItem} aria-label="Logout">
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
