"use client";

import React, { useState } from "react";
import NotificationModal from "./components/NotificationModal";
import LogoAnimation from "./components/LogoAnimation";
import ParentComponent from "./components/ParentComponent";
import AuthBar from "../app/components/auth/AuthBar";      
import { AnimatePresence } from "framer-motion";

const Page: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [showParentComponent, setShowParentComponent] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
    setShowLogo(true);
  };

  const handleLogoAnimationComplete = () => {
    setShowLogo(false);
    setShowParentComponent(true);
  };

  return (
    <main style={{ backgroundColor: "#1a1a1a", color: "#e0e0e0", minHeight: "100vh", padding: "20px" }}>
      {/* Our new AuthBar at the top */}
      <AuthBar />

      <AnimatePresence>
        {showModal && <NotificationModal onClose={handleModalClose} />}
        {showLogo && <LogoAnimation onAnimationComplete={handleLogoAnimationComplete} />}
        {showParentComponent && <ParentComponent />}
      </AnimatePresence>
    </main>
  );
};

export default Page;
