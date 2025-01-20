"use client";

import React, { useState } from "react";
import styles from "../../styles/battleArea.module.css";
import { Unit, Attack, resolveAttack } from "../../shared";
import ArmySection from "./ArmySection";
import AttackOptions from "./AttackOptions";
import AttackLog from "./AttackLog";

type BattleAreaProps = {
  leftSideUnits: Unit[];
  rightSideUnits: Unit[];
  onLeftSideUpdate?: (updated: Unit[]) => void;
  onRightSideUpdate?: (updated: Unit[]) => void;
};

const BattleArea: React.FC<BattleAreaProps> = ({
  leftSideUnits,
  rightSideUnits,
  onLeftSideUpdate,
  onRightSideUpdate,
}) => {
  const [selectedAttacker, setSelectedAttacker] = useState<Unit | null>(null);
  const [selectedAttack, setSelectedAttack] = useState<Attack | null>(null);
  const [selectedDefender, setSelectedDefender] = useState<Unit | null>(null);
  const [attackLog, setAttackLog] = useState<string>("");
  const [showDiceAnimation, setShowDiceAnimation] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);

  /**
   * Unit selection logic:
   * - When no attacker is selected, the clicked unit becomes the attacker.
   * - If the clicked unit is on the same side as the attacker, we change the attacker.
   * - If the clicked unit is on the opposite side, it is selected as the defender.
   */
  const handleSelectUnit = (unit: Unit) => {
    const isUnitOnLeft = leftSideUnits.some((u) => u.unitId === unit.unitId);
    const isAttackerOnLeft = selectedAttacker
      ? leftSideUnits.some((u) => u.unitId === selectedAttacker.unitId)
      : false;

    if (!selectedAttacker) {
      setSelectedAttacker(unit);
      setSelectedAttack(null);
      setSelectedDefender(null);
      return;
    }

    if (isAttackerOnLeft === isUnitOnLeft) {
      setSelectedAttacker(unit);
      setSelectedAttack(null);
      setSelectedDefender(null);
      return;
    }

    setSelectedDefender(unit);
  };

  /**
   * Applies damage to the chosen defender after a delay for visual effect.
   */
  const applyDamage = (
    units: Unit[],
    defenderId: string,
    attack: Attack
  ): Unit[] => {
    const updatedUnits = [...units];
    const defender = updatedUnits.find((u) => u.unitId === defenderId);

    if (!defender) return units;

    let remainingDamage = attack.damage;

    // Apply damage sequentially through the models
    defender.models.forEach((model) => {
      if (remainingDamage > 0) {
        const newHealth = model.health - remainingDamage;
        remainingDamage = newHealth < 0 ? Math.abs(newHealth) : 0;
        model.health = Math.max(newHealth, 0);
      }
    });

    // Remove any dead models
    defender.models = defender.models.filter((m) => m.health > 0);

    // Remove entire units if no models remain.
    return updatedUnits.filter((u) => u.models.length > 0);
  };

  /**
   * Executes the attack:
   * 1. Shows the dice animation.
   * 2. After the animation delay, resolves the attack and updates the Attack Log.
   * 3. Then, after a further slight delay, applies the damage.
   */
  const handleAttack = () => {
    if (!selectedAttacker || !selectedDefender || !selectedAttack) return;

    setIsAttacking(true);
    setShowDiceAnimation(true);
    setAttackLog(""); // Clear previous log

    // Delay to simulate dice rolling before calculating the attack result.
    setTimeout(() => {
      const isMelee = selectedAttack.type === "melee";
      const result = resolveAttack(
        selectedAttacker,
        selectedDefender,
        selectedAttack,
        isMelee
      );
      setAttackLog(result);
      // Hide dice animation once the roll is finished.
      setShowDiceAnimation(false);

      // Delay damage application slightly after dice animation to heighten the impact.
      setTimeout(() => {
        const defenderOnLeft = leftSideUnits.some(
          (u) => u.unitId === selectedDefender.unitId
        );

        if (defenderOnLeft && onLeftSideUpdate) {
          const updatedLeft = applyDamage(
            leftSideUnits,
            selectedDefender.unitId,
            selectedAttack
          );
          onLeftSideUpdate(updatedLeft);
        } else if (!defenderOnLeft && onRightSideUpdate) {
          const updatedRight = applyDamage(
            rightSideUnits,
            selectedDefender.unitId,
            selectedAttack
          );
          onRightSideUpdate(updatedRight);
        }

        // Reset selections and attacking state after damage is applied.
        setSelectedAttacker(null);
        setSelectedDefender(null);
        setSelectedAttack(null);
        setIsAttacking(false);
      }, 500);
    }, 1500);
  };

  return (
    <div
      className={styles["battle-area"]}
      style={{
        background: "url('/battlefield.jpg') no-repeat center center",
        backgroundSize: "cover",
        padding: "20px",
        border: "3px solid #333",
        borderRadius: "10px",
        position: "relative",
      }}
    >
      {/* Battle Area Header */}
      <h2 className={styles["battle-header"]}>BATTLE AREA</h2>

      {/* Dice Animation Container (uses a dice emoji with CSS animation) */}
      {showDiceAnimation && (
        <div className={styles["dice-animation"]}>
          <span className={styles["dice-icon"]}>🎲</span>
        </div>
      )}

      <div className={styles["armies-container"]}>
        {/* Left Side Army */}
        <ArmySection
          title="Left-Side Army"
          units={leftSideUnits}
          onSelectUnit={handleSelectUnit}
          attackerId={selectedAttacker?.unitId}
          defenderId={selectedDefender?.unitId}
        />

        {/* Right Side Army */}
        <ArmySection
          title="Right-Side Army"
          units={rightSideUnits}
          onSelectUnit={handleSelectUnit}
          attackerId={selectedAttacker?.unitId}
          defenderId={selectedDefender?.unitId}
        />
      </div>

      {/* Attack Options for the selected Attacker */}
      {selectedAttacker && (
        <AttackOptions
          attacker={selectedAttacker}
          selectedAttack={selectedAttack}
          onSelectAttack={setSelectedAttack}
        />
      )}

      {/* Roll Attack Button */}
      <button
        onClick={handleAttack}
        disabled={
          !selectedAttacker ||
          !selectedDefender ||
          !selectedAttack ||
          isAttacking
        }
        className={`${styles["roll-attack-button"]} ${
          selectedAttacker &&
          selectedDefender &&
          selectedAttack &&
          !isAttacking
            ? styles["enabled"]
            : styles["disabled"]
        }`}
      >
        {isAttacking ? "Attacking..." : "Roll Attack"}
      </button>

      {/* Attack Log */}
      <AttackLog log={attackLog} />
    </div>
  );
};

export default BattleArea;
