"use client";

import React from "react";

type UnitCardProps = {
  name: string;
  health: number;
  isSelected?: boolean; // Indicates if the unit is currently selected
  onClick?: () => void; // Callback when the unit is clicked
  disabled?: boolean; // Disables the card interaction
};

const UnitCard: React.FC<UnitCardProps> = ({
  name,
  health,
  isSelected = false,
  onClick,
  disabled = false,
}) => {
  return (
    <div
      className={`unit-card ${isSelected ? "selected" : ""} ${
        disabled ? "disabled" : ""
      }`}
      onClick={!disabled && onClick ? onClick : undefined}
      style={{
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        margin: "5px",
        cursor: disabled ? "not-allowed" : "pointer",
        backgroundColor: isSelected ? "#e0ffe0" : "#fff",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <h4>{name}</h4>
      <p>Health: {health}</p>
    </div>
  );
};

export default UnitCard;
