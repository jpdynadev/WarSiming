"use client";

import React, { useState, useEffect } from "react";
import { Unit, Model } from "../shared";
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

  // Arrays for raw dice rolls (for dice animation display)
  const [hitDice, setHitDice] = useState<number[]>([]);
  const [woundDice, setWoundDice] = useState<number[]>([]);
  const [saveDice, setSaveDice] = useState<number[]>([]);

  // Text log of final breakdown
  const [attackLog, setAttackLog] = useState<string>("");

  /**
   * On first render or whenever attackerUnits/defenderUnits update,
   * set local state. Also, ensure each model has a readable "Model #x" name
   * instead of a UUID or empty string.
   */
  useEffect(() => {
    const renameModels = (units: Unit[]) => {
      return units.map((unit) => {
        const newModels = unit.models.map((m, i) => {
          // If no explicit name, use "Model #1," "Model #2," etc.
          // or any custom naming you prefer (Marine #1, Terminator #1, etc.).
          const modelName = unit.name || `Model #${i + 1}`;
          return { ...m, name: modelName };
        });
        return { ...unit, models: newModels };
      });
    };

    setUpdatedAttackerUnits(renameModels(attackerUnits));
    setUpdatedDefenderUnits(renameModels(defenderUnits));
  }, [attackerUnits, defenderUnits]);

  // -----------------------------
  // Toggles for selecting units
  // -----------------------------
  const toggleAttackerSelection = (unit: Unit) => {
    if (selectedAttacker?.name === unit.name) {
      setSelectedAttacker(null);
    } else {
      setSelectedAttacker(unit);
    }
  };

  const toggleDefenderSelection = (unit: Unit) => {
    if (selectedDefender?.name === unit.name) {
      setSelectedDefender(null);
    } else {
      setSelectedDefender(unit);
    }
  };

  // -----------------------------
  // Swap Attackers / Defenders
  // -----------------------------
  const handleToggleSides = () => {
    const oldAttackers = [...updatedAttackerUnits];
    const oldDefenders = [...updatedDefenderUnits];
    setUpdatedAttackerUnits(oldDefenders);
    setUpdatedDefenderUnits(oldAttackers);

    // Swap the selected units as well
    const oldSelAtt = selectedAttacker;
    const oldSelDef = selectedDefender;
    setSelectedAttacker(oldSelDef);
    setSelectedDefender(oldSelAtt);

    // Clear dice/log
    setHitDice([]);
    setWoundDice([]);
    setSaveDice([]);
    setAttackLog("");
  };

  // -----------------------------
  // Attack Logic
  // -----------------------------
  const handleAttack = () => {
    if (!selectedAttacker || !selectedDefender) return;

    // Clear previous dice
    setHitDice([]);
    setWoundDice([]);
    setSaveDice([]);
    setAttackLog("");

    // 1) Total # of attacks = Attacker's A * # of models
    const attackerModelsCount = selectedAttacker.models.length;
    const totalAttacks = selectedAttacker.attacks * attackerModelsCount;

    // 2) Roll to Hit
    const rawHitRolls = Array.from({ length: totalAttacks }, () =>
      Math.floor(Math.random() * 6) + 1
    );
    setHitDice(rawHitRolls);

    // Basic logic: 1 = auto-fail, 6 = auto-success, else compare to ballisticSkill
    // (If it's melee, you'd compare to weaponSkill, but we'll assume BS for now.)
    const hits = rawHitRolls.filter((roll) => {
      if (roll === 1) return false;
      if (roll === 6) return true;
      return roll >= selectedAttacker.ballisticSkill;
    });

    // 3) Wound Roll
    // Determine needed to wound
    let neededToWound: number;
    if (selectedAttacker.strength >= 2 * selectedDefender.toughness) neededToWound = 2;
    else if (selectedAttacker.strength > selectedDefender.toughness) neededToWound = 3;
    else if (selectedAttacker.strength === selectedDefender.toughness) neededToWound = 4;
    else if (selectedAttacker.strength <= selectedDefender.toughness / 2) neededToWound = 6;
    else neededToWound = 5;

    const rawWoundRolls = Array.from({ length: hits.length }, () =>
      Math.floor(Math.random() * 6) + 1
    );
    setWoundDice(rawWoundRolls);

    const woundArray = rawWoundRolls.map((roll) => {
      if (roll === 1) return false; // auto-fail
      if (roll === 6) return true;  // auto-success
      return roll >= neededToWound;
    });
    const wounds = woundArray.filter(Boolean).length;

    // 4) Saving Throws
    const baseSave = selectedDefender.save;
    const invuln = selectedDefender.invulnerableSave ?? 99; // If no invuln, treat as 99
    const attackerAP = selectedAttacker.ap ?? 0;
    const normalSaveNeeded = baseSave + attackerAP;
    const finalSaveNeeded = Math.min(normalSaveNeeded, invuln);

    const rawSaveRolls = Array.from({ length: wounds }, () =>
      Math.floor(Math.random() * 6) + 1
    );
    setSaveDice(rawSaveRolls);

    // 1 always fails, 6 is not auto-save (in standard 40k),
    // so we just check if roll >= finalSaveNeeded
    const saveArray = rawSaveRolls.map((roll) => {
      if (roll === 1) return false;
      return roll >= finalSaveNeeded;
    });
    const successfulSaves = saveArray.filter(Boolean).length;
    const failedSaves = wounds - successfulSaves;

    // 5) Apply Damage
    // Each "failed save" => (attackerDamage) damage to a single model in the defender
    // We track the "lastDamagedIndex" on the defending unit, so that future attacks
    // start damaging the same model if it's still alive.
    let newDefenderUnits = structuredClone(updatedDefenderUnits);
    const attackerDamage = selectedAttacker.damage ?? 1;
    let totalFailed = failedSaves;

    newDefenderUnits = newDefenderUnits.map((unit) => {
      if (unit.name !== selectedDefender.name) {
        return unit; // unaffected
      }

      // In 10th Edition, the defender chooses which model to allocate. 
      // We'll do a "lastDamagedIndex" approach for simplicity.
      const updatedModels: Model[] = [...unit.models];
      let idx = unit.lastDamagedIndex ?? 0; // start from last wounded or 0

      // Apply each chunk of damage (one chunk per "failed save")
      while (totalFailed > 0 && idx < updatedModels.length) {
        const model = updatedModels[idx];
        const newHealth = model.health - attackerDamage;

        if (newHealth <= 0) {
          // Model dies
          updatedModels.splice(idx, 1);
          // Do NOT increment idx, because the next model will shift into this index
        } else {
          // Model survives
          updatedModels[idx] = { ...model, health: newHealth };
          // Keep damaging this same model until the next chunk 
          // So we do not increment idx if it’s still alive
          idx = idx; // effectively unchanged
        }

        totalFailed--;
      }

      // If we've run out of models, the rest of the damage is lost
      // or if totalFailed is 0, we've applied all damage.

      // Update the lastDamagedIndex
      // If idx >= updatedModels.length, that means all models died, so reset to 0
      const newLastIndex = idx >= updatedModels.length ? 0 : idx;

      setSelectedAttacker(null);
      setSelectedDefender(null);

      return {
        ...unit,
        models: updatedModels,
        lastDamagedIndex: newLastIndex,
      };
    });

    // Remove any units that have 0 models left
    newDefenderUnits = newDefenderUnits.filter((u) => u.models.length > 0);

    setUpdatedDefenderUnits(newDefenderUnits);

    // If the defender unit was entirely destroyed, unselect it
    const stillAlive = newDefenderUnits.find((u) => u.name === selectedDefender.name);
    if (!stillAlive) {
      setSelectedDefender(null);
    }

    // Build the Attack Log
    const finalLog = `
    Attacker: ${selectedAttacker.name}
    Defender: ${selectedDefender.name}

    Hits: ${hits.length} of ${totalAttacks} attacks
      (dice rolls: ${rawHitRolls.join(", ")})
    Wounds: ${wounds} of ${hits.length} hits
      (dice rolls: ${rawWoundRolls.join(", ")}; needed ${neededToWound}+)
    Successful Saves: ${successfulSaves} of ${wounds}
      (dice rolls: ${rawSaveRolls.join(", ")}; needed ${finalSaveNeeded}+)
    Failed Saves: ${failedSaves}, each dealing ${attackerDamage} damage.

    Total Damage Dealt: ${failedSaves * attackerDamage}
    (Damage continues on the same wounded model until it dies.)
    `;
    setAttackLog(finalLog);
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className={styles["battle-area"]}>
      <h2 className={styles["battle-header"]}>Battle Area</h2>
  
      {/* Button to swap Attackers/Defenders */}
      <button className={styles.toggleButton} onClick={handleToggleSides}>
        Swap Attackers / Defenders
      </button>
  
      {/* Two sections: Attacker Army and Defender Army */}
      <div className={styles["unit-section"]}>
  
        {/* Attacker Army */}
        <div className={styles["attacker-section"]}>
          <h3>Attacker Army</h3>
          {updatedAttackerUnits.length === 0 && <p>No units in the attacker army</p>}
          {updatedAttackerUnits.map((unit) => (
            <div key={unit.unitId} className={styles["unit-block"]}>
              <button
                onClick={() => toggleAttackerSelection(unit)}
                className={`${styles["unit-card"]} ${
                  selectedAttacker?.unitId === unit.unitId ? styles["selected"] : ""
                }`}
                disabled={unit.models.length === 0}
              >
                {unit.name} (Models: {unit.models.length})
              </button>
              <div className={styles["model-stats"]}>
                {unit.models.map((m) => (
                  <div key={m.id} className={styles["model-entry"]}>
                    {m.name || m.id.slice(0, 6)}: {m.health} HP
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
  
        {/* Defender Army */}
        <div className={styles["defender-section"]}>
          <h3>Defender Army</h3>
          {updatedDefenderUnits.length === 0 && <p>No units in the defender army</p>}
          {updatedDefenderUnits.map((unit) => (
            <div key={unit.unitId} className={styles["unit-block"]}>
              <button
                onClick={() => toggleDefenderSelection(unit)}
                className={`${styles["unit-card"]} ${
                  selectedDefender?.unitId === unit.unitId ? styles["selected"] : ""
                }`}
                disabled={unit.models.length === 0}
              >
                {unit.name} (Models: {unit.models.length})
              </button>
              <div className={styles["model-stats"]}>
                {unit.models.map((m) => (
                  <div key={m.id} className={styles["model-entry"]}>
                    {m.name || m.id.slice(0, 6)}: {m.health} HP
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
  
      {/* Attack Button */}
      <button
        className={styles["attack-button"]}
        onClick={handleAttack}
        disabled={!selectedAttacker || !selectedDefender}
      >
        Roll Attack
      </button>
  
      {/* Dice Results - displayed only if there are dice to show */}
      {(hitDice.length > 0 || woundDice.length > 0 || saveDice.length > 0) && (
        <div className={styles.diceResultsSection}>
          <h4>Dice Rolls</h4>
          {/* Hit Rolls */}
          {hitDice.length > 0 && (
            <div className={styles.diceRow}>
              <strong>Hit Rolls:</strong>
              {hitDice.map((roll, i) => (
                <div
                  key={`hit-${i}`}
                  className={`${styles.dice} ${
                    roll === 1 ? styles.autoFail : roll === 6 ? styles.autoSuccess : ""
                  }`}
                >
                  {roll}
                </div>
              ))}
            </div>
          )}
          {/* Wound Rolls */}
          {woundDice.length > 0 && (
            <div className={styles.diceRow}>
              <strong>Wound Rolls:</strong>
              {woundDice.map((roll, i) => (
                <div
                  key={`wound-${i}`}
                  className={`${styles.dice} ${
                    roll === 1 ? styles.autoFail : roll === 6 ? styles.autoSuccess : ""
                  }`}
                >
                  {roll}
                </div>
              ))}
            </div>
          )}
          {/* Save Rolls */}
          {saveDice.length > 0 && (
            <div className={styles.diceRow}>
              <strong>Save Rolls:</strong>
              {saveDice.map((roll, i) => (
                <div
                  key={`save-${i}`}
                  className={`${styles.dice} ${
                    roll === 1 ? styles.autoFail : ""
                  }`}
                >
                  {roll}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
  
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
