"use client";

import React, { createContext, useEffect, useState } from "react";
import netlifyIdentity, { User as NetlifyUser } from "netlify-identity-widget";

/** Define what we want to expose from AuthContext. */
interface AuthContextValue {
  user: NetlifyUser | null;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  signup: () => void;
}

/** Create the AuthContext with default “empty” values. */
export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  signup: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<NetlifyUser | null>(null);

  useEffect(() => {
    // 1) Initialize the widget
    netlifyIdentity.init();

    // 2) If user is already logged in (page refresh scenario)
    const current = netlifyIdentity.currentUser();
    if (current) setUser(current);

    // 3) Listen for Netlify Identity events
    //    'login' event includes a user object
    const handleLogin = (u?: NetlifyUser | Error) => {
      if (u && !(u instanceof Error)) {
        setUser(u);
      }
      netlifyIdentity.close(); // close modal after successful login
    };

    const handleLogout = () => setUser(null);

    netlifyIdentity.on("login", handleLogin);
    netlifyIdentity.on("logout", handleLogout);

    // (Optional) handle 'signup' events as well:
    netlifyIdentity.on("signup", () => {
      // e.g. do something special on signup success
    });

    // 4) Cleanup event listeners on unmount
    return () => {
      netlifyIdentity.off("login", handleLogin);
      netlifyIdentity.off("logout", handleLogout);
      netlifyIdentity.off("signup");
    };
  }, []);

  // 5) Auth actions
  const login = () => netlifyIdentity.open("login");
  const signup = () => netlifyIdentity.open("signup");
  const logout = () => netlifyIdentity.logout();

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
