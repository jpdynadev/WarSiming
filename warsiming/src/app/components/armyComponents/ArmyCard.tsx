// app/components/userArmy/ArmyCard.tsx
"use client";

import React from "react";
import HoverableUnitItem from "../armyComponents/HoverableUnitItem";

import styles from "../../styles/ArmyCard.module.css"; // We'll define some nice styles

interface ArmyCardProps {
  army: CustomArmy;
  onDeleteArmy: (armyId: string) => void;
}

interface CustomArmy {
  id: string;
  userEmail: string;
  name: string;
  notes?: string;
  faction: string;
  chosenUnits: ChosenUnit[];
}

interface ChosenUnit {
  id: string;
  templateName: string;
  points: number;
}

const ArmyCard: React.FC<ArmyCardProps> = ({ army, onDeleteArmy }) => {
  const totalPoints = army.chosenUnits.reduce((sum, u) => sum + (u.points || 0), 0);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <strong className={styles.armyName}>{army.name}</strong>
        <span className={styles.points}>{totalPoints} pts</span>
        {army.notes && <em className={styles.notes}>- {army.notes}</em>}

        <button
          onClick={() => onDeleteArmy(army.id)}
          className={styles.deleteButton}
        >
          Delete
        </button>
      </div>

      <div className={styles.unitList}>
        {army.chosenUnits.map((u) => (
          <HoverableUnitItem
            key={u.id}
            unitName={u.templateName}
            points={u.points}
            faction={army.faction} /* so we know where to look up attacks */
          />
        ))}
      </div>
    </div>
  );
};

export default ArmyCard;
