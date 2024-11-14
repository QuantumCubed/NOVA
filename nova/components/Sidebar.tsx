import Link from "next/link";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaTimes, FaInfoCircle, FaEnvelope, FaUser } from "react-icons/fa";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const authContext = useContext(AuthContext);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        toggleSidebar(); // Close the sidebar if clicked outside
      }
    };

    // Add event listener on mount
    document.addEventListener("mousedown", handleOutsideClick);

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [toggleSidebar]);

  return (
    <div
      ref={sidebarRef}
      className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}
    >
      <div className={styles.sidebarHeader}>
        <button
          onClick={toggleSidebar}
          className={styles.closeButton}
          aria-label="Close Menu"
        >
          <FaTimes size={24} />
        </button>
      </div>
      <div className={styles.sidebarContent}>
        <Link href="/about" passHref legacyBehavior>
          <div className={styles.sidebarItem} onClick={toggleSidebar}>
            <FaInfoCircle size={24} />
            <span>About</span>
          </div>
        </Link>
        <Link href="/contact" passHref legacyBehavior>
          <div className={styles.sidebarItem} onClick={toggleSidebar}>
            <FaEnvelope size={24} />
            <span>Contact</span>
          </div>
        </Link>
        {authContext?.user && (
          <Link href="/dashboard" passHref legacyBehavior>
            <div className={styles.sidebarItem} onClick={toggleSidebar}>
              <FaUser size={24} />
              <span>Dashboard</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
