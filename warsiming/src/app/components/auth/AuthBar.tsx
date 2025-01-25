// app/components/AuthBar.tsx
"use client";

import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Link from "next/link";
import styles from "../../styles/authBar.module.css";

const AuthBar: React.FC = () => {
  const { user, isLoggedIn, login, logout, signup } = useContext(AuthContext);

  return (
    <div className={styles.authBar}>
      {isLoggedIn ? (
        <>
          <span>Welcome, {user?.user_metadata?.full_name || user?.email}!</span>
          {/* My Armies link */}
          <Link href="/userArmies" className={styles.authLink}>
            My Armies
          </Link>

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
    </div>
  );
};

export default AuthBar;
