import React from "react";
import { Unit } from "../../shared";
import styles from "../../styles/armySection.module.css";

export interface ArmySectionProps {
  title: string;
  units: Unit[];
  onSelectUnit: (unit: Unit) => void;
  attackerId?: string; // Attacker's unitId
  defenderId?: string; // Defender's unitId
}

const ArmySection: React.FC<ArmySectionProps> = ({
  title,
  units,
  onSelectUnit,
  attackerId,
  defenderId,
}) => {
  return (
    <div className={styles["army-section"]}>
      <h3>{title}</h3>
      {units.map((unit) => {
        const isAttacker = unit.unitId === attackerId;
        const isDefender = unit.unitId === defenderId;

        // Calculate total wounds by summing all models' health
        const totalModels = unit.models.length;
        const totalWounds = unit.models.reduce((acc, model) => acc + model.health, 0);

        return (
          <button
            key={unit.unitId}
            onClick={() => onSelectUnit(unit)}
            className={`${styles["unit-card"]} ${
              isAttacker
                ? styles["attacker-highlight"]
                : isDefender
                ? styles["defender-highlight"]
                : ""
            }`}
          >
            {unit.name} (Models: {totalModels}, Wounds: {totalWounds})
          </button>
        );
      })}
    </div>
  );
};

export default ArmySection;
