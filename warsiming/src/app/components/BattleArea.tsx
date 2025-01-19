"use client";

import React, { useState } from "react";
import styles from "../styles/battleArea.module.css";
import { Unit, Model } from "../shared";

type BattleAreaProps = {
  leftSideUnits: Unit[];
  rightSideUnits: Unit[];

  // Callbacks for applying damage (optional, but needed if you want HP changes)
  onLeftSideUpdate?: (updated: Unit[]) => void;
  onRightSideUpdate?: (updated: Unit[]) => void;
};

const BattleArea: React.FC<BattleAreaProps> = ({
  leftSideUnits,
  rightSideUnits,
  onLeftSideUpdate,
  onRightSideUpdate,
}) => {
  // Attacker/Defender selection
  const [selectedAttacker, setSelectedAttacker] = useState<Unit | null>(null);
  const [selectedDefender, setSelectedDefender] = useState<Unit | null>(null);

  // Dice arrays for display
  const [hitDice, setHitDice] = useState<number[]>([]);
  const [woundDice, setWoundDice] = useState<number[]>([]);
  const [saveDice, setSaveDice] = useState<number[]>([]);
  // Attack log
  const [attackLog, setAttackLog] = useState<string>("");

  /** 
   * handleSelectUnit: 
   * If no attacker/defender => setAttacker
   * If attacker is set but no defender => setDefender (only if other side)
   * else do nothing
   */
  const handleSelectUnit = (unit: Unit, side: "LEFT" | "RIGHT") => {
    if (!selectedAttacker && !selectedDefender) {
      setSelectedAttacker(unit);
      return;
    }
    if (selectedAttacker && !selectedDefender) {
      // Must be from other side
      const attackerOnLeft = leftSideUnits.some((u) => u.unitId === selectedAttacker.unitId);
      const thisUnitOnLeft = leftSideUnits.some((u) => u.unitId === unit.unitId);

      if (attackerOnLeft !== thisUnitOnLeft) {
        setSelectedDefender(unit);
      }
      return;
    }
    // If attacker and defender are set, do nothing or reselect logic
  };

  /** 
   * handleAttack:
   * Rolls dice, logs results, applies damage by calling parent's update 
   */
  const handleAttack = () => {
    if (!selectedAttacker || !selectedDefender) return;

    // Clear old dice/log
    setHitDice([]);
    setWoundDice([]);
    setSaveDice([]);
    setAttackLog("");

    // 1) totalAttacks
    const attackerModelsCount = selectedAttacker.models.length;
    const totalAttacks = selectedAttacker.attacks * attackerModelsCount;

    // 2) Hit Rolls
    const rawHitRolls = Array.from({ length: totalAttacks }, () =>
      Math.floor(Math.random() * 6) + 1
    );
    setHitDice(rawHitRolls);

    // Basic logic: 1=fail, 6=auto success, else compare ballisticSkill
    const hits = rawHitRolls.filter((roll) => {
      if (roll === 1) return false;
      if (roll === 6) return true;
      return roll >= selectedAttacker.ballisticSkill;
    });

    // 3) Wound Rolls
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

    const woundResults = rawWoundRolls.map((roll) => {
      if (roll === 1) return false;
      if (roll === 6) return true;
      return roll >= neededToWound;
    });
    const wounds = woundResults.filter(Boolean).length;

    // 4) Saves
    const baseSave = selectedDefender.save;
    const invuln = selectedDefender.invulnerableSave ?? 99;
    const attackerAP = selectedAttacker.ap ?? 0;
    const finalNeeded = Math.min(baseSave + attackerAP, invuln);

    const rawSaveRolls = Array.from({ length: wounds }, () =>
      Math.floor(Math.random() * 6) + 1
    );
    setSaveDice(rawSaveRolls);

    const saveResults = rawSaveRolls.map((roll) => {
      if (roll === 1) return false;
      return roll >= finalNeeded;
    });
    const successfulSaves = saveResults.filter(Boolean).length;
    const failedSaves = wounds - successfulSaves;

    // 5) Apply Damage (calls parent's update if provided)
    const attackerDamage = selectedAttacker.damage ?? 1;

    function applyDamageTo(arrayOfUnits: Unit[], defenderId: string, setFn: (updated: Unit[]) => void) {
      const newUnits = structuredClone(arrayOfUnits);
      let fails = failedSaves;

      // find the correct unit
      for (let i = 0; i < newUnits.length; i++) {
        if (newUnits[i].unitId === defenderId) {
          const updatedModels = [...newUnits[i].models];
          let idx = newUnits[i].lastDamagedIndex ?? 0;

          while (fails > 0 && idx < updatedModels.length) {
            const m = updatedModels[idx];
            const newHealth = m.health - attackerDamage;
            if (newHealth <= 0) {
              updatedModels.splice(idx, 1);
            } else {
              updatedModels[idx] = { ...m, health: newHealth };
            }
            fails--;
          }

          const newLast = idx >= updatedModels.length ? 0 : idx;
          newUnits[i] = {
            ...newUnits[i],
            models: updatedModels,
            lastDamagedIndex: newLast,
          };
          if (newUnits[i].models.length === 0) {
            newUnits.splice(i, 1);
          }
          break;
        }
      }
      setFn(newUnits);
    }

    if (failedSaves > 0) {
      // figure out if the defender is on left or right
      const defenderOnLeft = leftSideUnits.some((u) => u.unitId === selectedDefender.unitId);

      if (defenderOnLeft && onLeftSideUpdate) {
        applyDamageTo(leftSideUnits, selectedDefender.unitId, onLeftSideUpdate);
      } else if (!defenderOnLeft && onRightSideUpdate) {
        applyDamageTo(rightSideUnits, selectedDefender.unitId, onRightSideUpdate);
      }
    }

    // Build log
    const finalLog = `
      Attacker: ${selectedAttacker.name}
      Defender: ${selectedDefender.name}

      Hits: ${hits.length} of ${totalAttacks}
        (rolls: ${rawHitRolls.join(", ")})
      Wounds: ${wounds} of ${hits.length}
        (rolls: ${rawWoundRolls.join(", ")})
      Saves: ${successfulSaves} of ${wounds}
        (rolls: ${rawSaveRolls.join(", ")})
      Failed: ${failedSaves}, each dealing ${attackerDamage} damage
    `;
    setAttackLog(finalLog);

    // Unselect
    setSelectedAttacker(null);
    setSelectedDefender(null);
  };

  // ---------------------
  // RENDER
  // ---------------------
  return (
    <div className={styles["battle-area"]}>
      <h2 className={styles["battle-header"]}>Battle Area</h2>

      {/* Left side */}
      <div className={styles["unit-section"]}>
        <h3>Left-Side Army</h3>
        {leftSideUnits.length === 0 && <p>No units on left side</p>}
        {leftSideUnits.map((unit) => (
          <div key={unit.unitId} className={styles["unit-block"]}>
            <button
              onClick={() => handleSelectUnit(unit, "LEFT")}
              className={`${styles["unit-card"]} ${
                selectedAttacker?.unitId === unit.unitId ||
                selectedDefender?.unitId === unit.unitId
                  ? styles["selected"]
                  : ""
              }`}
            >
              {unit.name} (Models: {unit.models.length})
            </button>

            {/* Show each model's HP */}
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

      {/* Right side */}
      <div className={styles["unit-section"]}>
        <h3>Right-Side Army</h3>
        {rightSideUnits.length === 0 && <p>No units on right side</p>}
        {rightSideUnits.map((unit) => (
          <div key={unit.unitId} className={styles["unit-block"]}>
            <button
              onClick={() => handleSelectUnit(unit, "RIGHT")}
              className={`${styles["unit-card"]} ${
                selectedAttacker?.unitId === unit.unitId ||
                selectedDefender?.unitId === unit.unitId
                  ? styles["selected"]
                  : ""
              }`}
            >
              {unit.name} (Models: {unit.models.length})
            </button>

            {/* Show each model's HP */}
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

      {/* Roll Attack Button */}
      <button
        className={styles["attack-button"]}
        onClick={handleAttack}
        disabled={!selectedAttacker || !selectedDefender}
      >
        Roll Attack
      </button>

      {/* Dice */}
      {(hitDice.length > 0 || woundDice.length > 0 || saveDice.length > 0) && (
        <div className={styles.diceResultsSection}>
          <h4>Dice Rolls</h4>
          {/* Hits */}
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
          {/* Wounds */}
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
          {/* Saves */}
          {saveDice.length > 0 && (
            <div className={styles.diceRow}>
              <strong>Save Rolls:</strong>
              {saveDice.map((roll, i) => (
                <div
                  key={`save-${i}`}
                  className={`${styles.dice} ${roll === 1 ? styles.autoFail : ""}`}
                >
                  {roll}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
