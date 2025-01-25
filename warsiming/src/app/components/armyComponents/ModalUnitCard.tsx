// app/components/userArmy/ModalUnitCard.tsx

"use client";

import React from "react";
import { armyOptions } from "../../armyOptions";
import styles from "../../styles/ModalUnitCard.module.css";

interface ModalUnitCardProps {
  faction: string;
  unit: ChosenUnit;
  onRemoveUnit: (unitId: string) => void;
}

interface ChosenUnit {
  id: string;
  templateName: string;
  points: number;
}

interface Attack {
  name: string;
  type: "melee" | "ranged";
  range?: number;
  attacks: number;
  skill: number;
  strength: number;
  ap: number;
  damage: number;
}

export default function ModalUnitCard({
  faction,
  unit,
  onRemoveUnit,
}: ModalUnitCardProps) {
  const factionTemplates = armyOptions[faction];
  const foundTemplate = factionTemplates?.find((t) => t.name === unit.templateName);

  // If the found template has no attacks, we'll show a "No attacks" message
  const attacks: Attack[] = foundTemplate?.attacks || [];

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <span className={styles.unitName}>
          {unit.templateName} ({unit.points} pts)
        </span>
        <button
          className={styles.removeBtn}
          onClick={() => onRemoveUnit(unit.id)}
        >
          Remove
        </button>
      </div>

      {/* Attacks listing */}
      <div className={styles.attacksContainer}>
        {attacks.length === 0 ? (
          <p className={styles.noAttacks}>No attacks found.</p>
        ) : (
          attacks.map((atk, index) => {
            const attackClasses = getAttackClasses(atk);
            // Join them into one string for the className
            const gradientClass = attackClasses.join(" ");

            return (
              <div key={index} className={`${styles.attackRow} ${gradientClass}`}>
                <div className={styles.attackName}>{atk.name}</div>
                <div className={styles.attackStats}>
                  <span>Type: {atk.type}</span>
                  <span>Str {atk.strength}</span>
                  <span>AP {atk.ap}</span>
                  <span>Dmg {atk.damage}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/** Determine CSS classes for an attack based on type & damage, etc. */
function getAttackClasses(atk: Attack): string[] {
  // For example, if damage >= 2, call it "deadly" 
  // (and if damage=1 or strength < 5 => "weak"? Up to you!)
  const classes: string[] = [];

  if (atk.type === "melee") {
    classes.push(styles.melee);
  } else {
    classes.push(styles.ranged);
  }

  // Example logic for "deadly" vs "weak"
  if (atk.damage >= 2) {
    classes.push(styles.deadly);
  } else {
    classes.push(styles.weak);
  }

  return classes;
}
