import React from "react";
import styles from "../../styles/battleArea.module.css";
import { Unit, Attack } from "../../shared";

type AttackOptionsProps = {
  attacker: Unit;
  selectedAttack: Attack | null;
  onSelectAttack: (attack: Attack) => void;
};

const AttackOptions: React.FC<AttackOptionsProps> = ({ attacker, selectedAttack, onSelectAttack }) => {
  return (
    <div className={styles["attack-options"]}>
      <h3>Attacker: {attacker.name}</h3>
      {attacker.attacks.map((attack) => (
        <button
          key={attack.name}
          onClick={() => onSelectAttack(attack)}
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
