"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "../styles/LogoAnimation.module.css";

interface LogoAnimationProps {
  onAnimationComplete: () => void;
}

const LogoAnimation: React.FC<LogoAnimationProps> = ({ onAnimationComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onAnimationComplete={onAnimationComplete}
      className={styles["logo-container"]}
    >
      <img src="/logo.png" alt="Logo" className={styles["logo"]} />
    </motion.div>
  );
};

export default LogoAnimation;
