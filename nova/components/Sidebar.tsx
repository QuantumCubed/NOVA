// components/Sidebar.tsx

import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  FaTimes,
  FaInfoCircle,
  FaEnvelope,
  FaUser,
} from 'react-icons/fa';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const authContext = useContext(AuthContext);

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
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
