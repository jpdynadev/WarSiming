"use client";

import React, { useState } from "react";
import ArmyList from "./ArmyList";
import BattleArea from "./BattleArea";
import { Unit } from "../shared";

const ParentComponent: React.FC = () => {
    console.log("Rendering ParentComponent");

  const [attackerArmy, setAttackerArmy] = useState<Unit[]>([]);
  const [defenderArmy, setDefenderArmy] = useState<Unit[]>([]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#d43f3f" }}>Warhammer 40k Battle Simulator</h1>

      <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
        <ArmyList
          armyName="Attacker Army"
          units={attackerArmy}
          onArmyUpdate={setAttackerArmy}
        />
        <ArmyList
          armyName="Defender Army"
          units={defenderArmy}
          onArmyUpdate={setDefenderArmy}
        />
      </div>

      <BattleArea attackerUnits={attackerArmy} defenderUnits={defenderArmy} />
    </div>
  );
};

export default ParentComponent;
