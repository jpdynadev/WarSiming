"use client";

import React from "react";
import styles from "../../styles/battleArea.module.css";
import { Unit, Attack } from "../../shared";

type AttackOptionsProps = {
  attacker: Unit;
  selectedAttack: Attack | null;
  onSelectAttack: (attack: Attack | null) => void;
};

const AttackOptions: React.FC<AttackOptionsProps> = ({
  attacker,
  selectedAttack,
  onSelectAttack,
}) => {
  const handleSelect = (attack: Attack) => {
    // Toggle selection: clear if already selected, or set new selection
    if (selectedAttack?.name === attack.name) {
      onSelectAttack(null);
    } else {
      onSelectAttack(attack);
    }
  };

  return (
    <div className={styles["attack-options"]}>
      <h3>Attacker: {attacker.name}</h3>
      {attacker.attacks.map((attack) => (
        <button
          key={attack.name}
          onClick={() => handleSelect(attack)}
          className={`${styles["attack-button"]} ${
            selectedAttack?.name === attack.name ? styles["selected-attack"] : ""
          }`}
        >
          {attack.name}
        </button>
      ))}
    </div>
  );
};

export default AttackOptions;
