// app/components/userArmy/HoverableUnitItem.tsx
"use client";

import React, { useState } from "react";
import { armyOptions } from "../../armyOptions";

import styles from "../../styles/HoverableUnitItem.module.css";

interface HoverableUnitItemProps {
  unitName: string;
  points: number;
  faction: string;
}

const HoverableUnitItem: React.FC<HoverableUnitItemProps> = ({
  unitName,
  points,
  faction,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Find the unit's template to get the attacks
  const factionTemplates = armyOptions[faction];
  const unitTemplate = factionTemplates
    ? factionTemplates.find((t) => t.name === unitName)
    : undefined;

  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);

  let attacksInfo = "No attacks found.";
  if (unitTemplate && unitTemplate.attacks.length > 0) {
    attacksInfo = unitTemplate.attacks
      .map(
        (a) =>
          `${a.name} (${a.type}, Str ${a.strength}, AP ${a.ap}, Dmg ${a.damage})`
      )
      .join("; ");
  }

  return (
    <div
      className={styles.itemContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* The text the user sees */}
      <span className={styles.unitLine}>
        • {unitName} ({points} pts)
      </span>

      {/* The tooltip with the unit's attacks */}
      {showTooltip && (
        <div className={styles.tooltip}>
          <p className={styles.tooltipText}>{attacksInfo}</p>
        </div>
      )}
    </div>
  );
};

export default HoverableUnitItem;
