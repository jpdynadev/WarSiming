"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "../styles/NotificationModal.module.css";

interface NotificationModalProps {
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles["modal-backdrop"]}
    >
      <motion.div
        className={styles["modal-content"]}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <h2>Welcome to the War Gaming App!</h2>
        <p>Prepare for battle! Select your armies and start the simulation.</p>
        <button onClick={onClose}>Continue</button>
      </motion.div>
    </motion.div>
  );
};

export default NotificationModal;
