"use client";

import React, { useState } from "react";
import ArmyList from "./ArmyList";
import BattleArea from "./battleArea/BattleArea";
import { Unit } from "../shared"; // Adjust to your file location

const ParentComponent: React.FC = () => {
  // The parent is the source of truth for each side's units
  const [leftSideUnits, setLeftSideUnits] = useState<Unit[]>([]);
  const [rightSideUnits, setRightSideUnits] = useState<Unit[]>([]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#d43f3f" }}>
        Warhammer 40k Battle Simulator
      </h1>

      {/* Two ArmyList components, controlling each side's squads */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
        <ArmyList
          armyName="Left Army"
          units={leftSideUnits}
          onArmyUpdate={setLeftSideUnits}
        />
        <ArmyList
          armyName="Right Army"
          units={rightSideUnits}
          onArmyUpdate={setRightSideUnits}
        />
      </div>

      {/* Pass them into the BattleArea, plus callbacks to apply damage */}
      <BattleArea
        leftSideUnits={leftSideUnits}
        rightSideUnits={rightSideUnits}
        onLeftSideUpdate={setLeftSideUnits}   
        onRightSideUpdate={setRightSideUnits} 
      />
    </div>
  );
};

export default ParentComponent;
