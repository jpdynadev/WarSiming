import React from "react";
import styles from "../../styles/battleArea.module.css";

type AttackLogProps = {
  log: string;
};

const AttackLog: React.FC<AttackLogProps> = ({ log }) => {
  return (
    <div className={styles["attack-log"]}>
      <h4>Attack Log</h4>
      <pre>{log}</pre>
    </div>
  );
};

export default AttackLog;
