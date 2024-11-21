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
  FaTv,
} from "react-icons/fa";
import styles from "./Navbar.module.css";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";

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
    const newTheme = isDarkMode ? "light" : "dark"; // Determine new theme
    document.documentElement.setAttribute("data-theme", newTheme); // Apply new theme
    localStorage.setItem("theme", newTheme); // Save theme to localStorage
    setIsDarkMode(!isDarkMode); // Update state
    toast.info(`Switched to ${newTheme === "dark" ? "Dark" : "Light"} Mode`);
  };

  useEffect(() => {
    // On mount, initialize theme from localStorage
    const savedTheme = localStorage.getItem("theme") || "light"; // Default to light
    document.documentElement.setAttribute("data-theme", savedTheme);
    setIsDarkMode(savedTheme === "dark"); // Update state based on saved theme
  }, []);

  const handleSearchInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/search?search=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Search failed.");
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

  const handleLogout = () => {
    authContext?.logout();
    toast.success("Logged out successfully!");
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <button
            onClick={toggleSidebar}
            className={styles.navItem}
            title="Menu"
          >
            <FaBars size={24} />
          </button>
          <Link href="/" passHref legacyBehavior>
            <div title="Home" className={styles.navItem}>
              <FaHome size={24} />
            </div>
          </Link>
          <Link href="/channellist" passHref legacyBehavior>
            <div title="Channels" className={styles.navItem}>
              <FaTv size={24} />
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
            {showResults && (
              <div className={styles.searchResults} ref={searchResultsRef}>
                {searchResults.length > 0 ? (
                  searchResults.map((video) => (
                    <Link
                      key={video._id}
                      href={`/video/${video._id}`}
                      passHref
                      legacyBehavior
                    >
                      <a className={styles.resultItem}>{video.title}</a>
                    </Link>
                  ))
                ) : (
                  <div className={styles.resultItem}>No results found.</div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className={styles.navRight}>
          <button
            onClick={toggleTheme}
            className={styles.navItem}
            title="Toggle Theme"
          >
            {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
          </button>
          {authContext?.user ? (
            <>
              <button
                onClick={handleLogout}
                className={styles.navItem}
                title="Logout"
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
