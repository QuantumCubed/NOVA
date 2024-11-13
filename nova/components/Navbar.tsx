// components/Navbar.tsx

import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  FaHome,
  FaUpload,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaUser,
} from 'react-icons/fa';
import styles from './Navbar.module.css';

const Navbar = () => {
  const authContext = useContext(AuthContext);

  return (
    <nav className={styles.navbar}>
      <Link href="/" passHref legacyBehavior>
        <div className={styles.navItem}>
          <FaHome size={24} />
          <span>Home</span>
        </div>
      </Link>
      {authContext?.user ? (
        <>
          <Link href="/dashboard" passHref legacyBehavior>
            <div className={styles.navItem}>
              <FaUser size={24} />
              <span>Dashboard</span>
            </div>
          </Link>
          <Link href="/upload" passHref legacyBehavior>
            <div className={styles.navItem}>
              <FaUpload size={24} />
              <span>Upload</span>
            </div>
          </Link>
          <button onClick={authContext.logout} className={styles.navItem}>
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
    </nav>
  );
};

export default Navbar;
