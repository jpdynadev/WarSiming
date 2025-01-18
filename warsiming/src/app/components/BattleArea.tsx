"use client";

import React, { useState, useEffect } from "react";
import { Unit } from "../shared";
import styles from "../styles/battleArea.module.css";

type BattleAreaProps = {
  attackerUnits: Unit[];
  defenderUnits: Unit[];
};

const BattleArea: React.FC<BattleAreaProps> = ({ attackerUnits, defenderUnits }) => {
  const [updatedAttackerUnits, setUpdatedAttackerUnits] = useState<Unit[]>([]);
  const [updatedDefenderUnits, setUpdatedDefenderUnits] = useState<Unit[]>([]);
  const [selectedAttacker, setSelectedAttacker] = useState<Unit | null>(null);
  const [selectedDefender, setSelectedDefender] = useState<Unit | null>(null);
  const [attackLog, setAttackLog] = useState<string>("");

  // Sync local state with props when they change
  useEffect(() => {
    setUpdatedAttackerUnits(attackerUnits);
    setUpdatedDefenderUnits(defenderUnits);
  }, [attackerUnits, defenderUnits]);

  const handleAttack = () => {
    if (!selectedAttacker || !selectedDefender) return;

    let damageRemaining = selectedAttacker.attacks;
    let hitRolls = [];
    let woundRolls = [];
    let saveRolls = [];
    let damageDealt = 0;

    // Step 1: Hit Rolls
    hitRolls = Array.from({ length: selectedAttacker.attacks }, () =>
      Math.floor(Math.random() * 6) + 1
    ).filter((roll) => roll >= selectedAttacker.ballisticSkill);

    // Step 2: Wound Rolls
    woundRolls = hitRolls.map(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      if (selectedAttacker.strength >= 2 * selectedDefender.toughness) return roll >= 2;
      if (selectedAttacker.strength > selectedDefender.toughness) return roll >= 3;
      if (selectedAttacker.strength === selectedDefender.toughness) return roll >= 4;
      if (selectedAttacker.strength < selectedDefender.toughness / 2) return roll >= 6;
      return roll >= 5;
    });

    const wounds = woundRolls.filter((wound) => wound).length;

    // Step 3: Saving Throws
    saveRolls = Array.from({ length: wounds }, () =>
      Math.floor(Math.random() * 6) + 1
    ).filter((roll) => roll >= (selectedDefender.invulnerableSave ?? selectedDefender.save));

    const failedSaves = wounds - saveRolls.length;
    damageDealt = failedSaves;

    // Step 4: Apply Damage
    const newDefenderUnits = updatedDefenderUnits.map((unit) => {
      if (unit.name === selectedDefender.name) {
        const updatedModels = unit.models.map((model) => {
          if (damageRemaining > 0) {
            const damage = Math.min(damageRemaining, model.health);
            damageRemaining -= damage;
            return { ...model, health: model.health - damage };
          }
          return model;
        }).filter((model) => model.health > 0); // Remove dead models

        return { ...unit, models: updatedModels };
      }
      return unit;
    }).filter((unit) => unit.models.length > 0); // Remove empty units

    setUpdatedDefenderUnits(newDefenderUnits);

    // Deselect the defender if it’s destroyed
    if (!newDefenderUnits.find((unit) => unit.name === selectedDefender.name)) {
      setSelectedDefender(null);
    }

    // Log the breakdown of the attack
    setAttackLog(`
      Attacker: ${selectedAttacker.name}
      Defender: ${selectedDefender.name}

      Hit Rolls: ${hitRolls.join(", ")} (${hitRolls.length}/${selectedAttacker.attacks})
      Wound Rolls: ${woundRolls.map((w) => (w ? "Success" : "Fail")).join(", ")} (${wounds}/${hitRolls.length})
      Saves: ${saveRolls.join(", ")} (${saveRolls.length}/${wounds})
      Damage Dealt: ${damageDealt}
    `);
  };

  return (
    <div className={styles["battle-area"]}>
      <h2 className={styles["battle-header"]}>Battle Area</h2>

      <div className={styles["unit-section"]}>
        {/* Attacker Section */}
        <div className={styles["attacker-section"]}>
          <h3>Attacker Army</h3>
          {updatedAttackerUnits.length === 0 && <p>No units in the attacker army</p>}
          {updatedAttackerUnits.map((unit) => (
            <button
              key={unit.name}
              onClick={() => setSelectedAttacker(unit)}
              className={`${styles["unit-card"]} ${
                selectedAttacker?.name === unit.name ? styles["selected"] : ""
              }`}
              disabled={unit.models.length === 0}
            >
              {unit.name} (Models: {unit.models.length})
            </button>
          ))}
        </div>

        {/* Defender Section */}
        <div className={styles["defender-section"]}>
          <h3>Defender Army</h3>
          {updatedDefenderUnits.length === 0 && <p>No units in the defender army</p>}
          {updatedDefenderUnits.map((unit) => (
            <button
              key={unit.name}
              onClick={() => setSelectedDefender(unit)}
              className={`${styles["unit-card"]} ${
                selectedDefender?.name === unit.name ? styles["selected"] : ""
              }`}
              disabled={unit.models.length === 0}
            >
              {unit.name} (Models: {unit.models.length})
            </button>
          ))}
        </div>
      </div>

      <button
        className={styles["attack-button"]}
        onClick={handleAttack}
        disabled={!selectedAttacker || !selectedDefender}
      >
        Roll Attack
      </button>

      {/* Display Selected Info */}
      <div className={styles["selected-info"]}>
        {selectedAttacker && (
          <div>
            <h4>Attacker:</h4>
            <p>{selectedAttacker.name} (Models: {selectedAttacker.models.length})</p>
          </div>
        )}
        {selectedDefender && (
          <div>
            <h4>Defender:</h4>
            <p>{selectedDefender.name} (Models: {selectedDefender.models.length})</p>
          </div>
        )}
      </div>

      {/* Attack Log */}
      {attackLog && (
        <div className={styles["attack-log"]}>
          <h4>Attack Breakdown</h4>
          <pre>{attackLog}</pre>
        </div>
      )}
    </div>
  );
};

export default BattleArea;
