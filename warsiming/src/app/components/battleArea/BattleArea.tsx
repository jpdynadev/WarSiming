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

  /**
   * When a user clicks on a unit in either ArmySection, figure out whether
   * to assign it as the Attacker or the Defender. We also allow re‐selecting
   * Attacker if we pick another unit on the same side.
   */
  const handleSelectUnit = (unit: Unit) => {
    const isUnitOnLeft = leftSideUnits.some((u) => u.unitId === unit.unitId);
    const isAttackerOnLeft = selectedAttacker
      ? leftSideUnits.some((u) => u.unitId === selectedAttacker.unitId)
      : false;

    // 1. If no Attacker yet, set this unit as Attacker.
    if (!selectedAttacker) {
      setSelectedAttacker(unit);
      setSelectedAttack(null);
      setSelectedDefender(null);
      return;
    }

    // 2. If there IS an Attacker already...
    //    a) If the new unit is on the same side as current Attacker,
    //       switch Attacker to this new unit (and clear old Defender/Attack).
    if (isAttackerOnLeft === isUnitOnLeft) {
      setSelectedAttacker(unit);
      setSelectedAttack(null);
      setSelectedDefender(null);
      return;
    }

    //    b) Otherwise, the new unit is on the opposite side. Assign as Defender.
    //       We allow re-picking the Defender if one is already set.
    setSelectedDefender(unit);
  };

  /**
   * Roll the dice for the chosen Attack, apply damage, and then show results in the Attack Log.
   */
  const handleAttack = () => {
    if (!selectedAttacker || !selectedDefender || !selectedAttack) return;

    const isMelee = selectedAttack.type === "melee";
    const result = resolveAttack(selectedAttacker, selectedDefender, selectedAttack, isMelee);
    setAttackLog(result);

    // Example "applyDamage" logic (simple, picks first model, etc.). 
    // You may want more sophisticated damage distribution in the future.
    const applyDamage = (
      units: Unit[],
      defenderId: string,
      attack: Attack
    ): Unit[] => {
      const updatedUnits = [...units];
      const defender = updatedUnits.find((u) => u.unitId === defenderId);

      if (!defender) return units;

      let remainingDamage = attack.damage;

      // For demo, we just subtract from each model in order until no damage left
      defender.models.forEach((model) => {
        if (remainingDamage > 0) {
          const newHealth = model.health - remainingDamage;
          remainingDamage = newHealth < 0 ? Math.abs(newHealth) : 0;
          model.health = Math.max(newHealth, 0);
        }
      });

      // Remove dead models
      defender.models = defender.models.filter((m) => m.health > 0);

      // Filter out entire squads that have no models left
      return updatedUnits.filter((u) => u.models.length > 0);
    };

    // Check which side the Defender was on, apply damage to that side
    const defenderOnLeft = leftSideUnits.some((u) => u.unitId === selectedDefender.unitId);

    if (defenderOnLeft && onLeftSideUpdate) {
      const updatedLeft = applyDamage(leftSideUnits, selectedDefender.unitId, selectedAttack);
      onLeftSideUpdate(updatedLeft);
    } else if (!defenderOnLeft && onRightSideUpdate) {
      const updatedRight = applyDamage(rightSideUnits, selectedDefender.unitId, selectedAttack);
      onRightSideUpdate(updatedRight);
    }

    setSelectedAttacker(null);
    setSelectedDefender(null);
    setSelectedAttack(null);
  };

  return (
    <div className={styles["battle-area"]}>
      <h2 className={styles["battle-header"]}>Battle Area</h2>

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
        disabled={!selectedAttacker || !selectedDefender || !selectedAttack}
        className={`${styles["roll-attack-button"]} ${
          selectedAttacker && selectedDefender && selectedAttack
            ? styles["enabled"]
            : styles["disabled"]
        }`}
      >
        Roll Attack
      </button>

      {/* Attack Log */}
      <AttackLog log={attackLog} />
    </div>
  );
};

export default BattleArea;
