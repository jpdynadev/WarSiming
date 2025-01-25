"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // <-- to detect current route
import { AuthContext } from "../../context/AuthContext";
import styles from "../../styles/authBar.module.css";

const AuthBar: React.FC = () => {
  const { user, isLoggedIn, login, logout, signup } = useContext(AuthContext);

  // Current path, e.g. "/" or "/user-armies"
  const pathname = usePathname();

  // Decide if we should show the "Home" link 
  // (only if not already on home)
  const showHomeLink = pathname !== "/";

  // Decide if we should show the "My Armies" link 
  // (only if logged in and not currently on "/user-armies")
  const showMyArmiesLink = isLoggedIn && pathname !== "/userArmies";

  return (
    <header className={styles.navbar}>
      {/* Left side brand */}
      <div className={styles.brand}>
        <Link href="/" className={styles.brandLink}>
          Warhammer Sim
        </Link>
      </div>

      {/* Right side actions */}
      <nav className={styles.navActions}>
        {/* If not on '/', show a Home link */}
        {showHomeLink && (
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
        )}

        {/* If logged in and not on '/user-armies', show My Armies */}
        {showMyArmiesLink && (
          <Link href="/userArmies" className={styles.navLink}>
            My Armies
          </Link>
        )}

        {isLoggedIn ? (
          <>
            <span className={styles.welcomeText}>
              Welcome, {user?.user_metadata?.full_name || user?.email}!
            </span>
            <button onClick={logout} className={styles.authButton}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={login} className={styles.authButton}>
              Log In
            </button>
            <button onClick={signup} className={styles.authButton}>
              Sign Up
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default AuthBar;
