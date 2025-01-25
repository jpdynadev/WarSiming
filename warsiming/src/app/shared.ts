// shared.ts or types.ts
import { v4 as uuidv4 } from "uuid";

export interface Attack {
  name: string; // e.g., "Boltgun", "Chainsword"
  type: "melee" | "ranged";
  range?: number; // For ranged attacks
  attacks: number; // Number of attacks per model
  skill: number; // WS (Weapon Skill) or BS (Ballistic Skill)
  strength: number;
  ap: number; // Armor Penetration
  damage: number; // Damage per attack
}

export interface UnitTemplate {
  name: string;
  models: Model[];
  toughness: number;
  save: number;
  invulnerableSave?: number;
  leadership: number;
  oc: number;
  attacks: Attack[];
  points?: number; // <--- new field for cost
}


/** The actual Unit in the user's army, each with a unique unitId. */
export interface Unit extends UnitTemplate {
  unitId: string; // Unique ID
  lastDamagedIndex?: number; // Track which model was last damaged
}


/** The Model for a single mini in a squad. */
export interface Model {
  id: string;         // e.g. a UUID
  name?: string;      // e.g. "Model #1"
  health: number;     // HP/Wounds
}


/** The actual Unit in the user's army, each with a unique unitId. */
export interface Unit extends UnitTemplate {
  unitId: string; // Unique ID for each unit instance
  lastDamagedIndex?: number; // Tracks which model was last damaged
}

/**
 * Helper function to create a new "Unit" from a "UnitTemplate",
 * automatically assigning a new unitId.
 */
export function instantiateUnit(template: UnitTemplate): Unit {
  return {
    ...template,
    unitId: uuidv4(),
  };
}


// --------------------
// Dice Sides Enum
// --------------------
export enum DiceSides {
  D4 = 4,
  D6 = 6,
  D8 = 8,
  D10 = 10,
  D12 = 12,
  D20 = 20,
}

// --------------------
// Simple “Resolve Attack” Example
// --------------------
// If you still want a helper to do a quick test of attacker vs. defender logic
// outside your React components, you can keep or expand the existing function:
export const resolveAttack = (
  attacker: Unit,
  defender: Unit,
  selectedAttack: Attack,
  isMelee: boolean
): string => {
  let results = "";

  const { name, attacks, skill, strength, damage, ap } = selectedAttack;

  // 1. Hit Rolls
  const rawHitRolls = Array.from({ length: attacks * attacker.models.length }, () =>
    Math.floor(Math.random() * 6) + 1
  );
  const hits = rawHitRolls.filter((roll) => roll >= skill);

  results += `Attack: ${name}\n`;
  results += `Hits: ${hits.length}/${attacks * attacker.models.length} (rolls: ${rawHitRolls.join(", ")})\n`;

  // 2. Wound Rolls
  let needed: number;
  if (strength >= 2 * defender.toughness) needed = 2;
  else if (strength > defender.toughness) needed = 3;
  else if (strength === defender.toughness) needed = 4;
  else if (strength <= defender.toughness / 2) needed = 6;
  else needed = 5;

  const rawWoundRolls = Array.from({ length: hits.length }, () =>
    Math.floor(Math.random() * 6) + 1
  );
  const wounds = rawWoundRolls.filter((roll) => roll >= needed);

  results += `Wounds: ${wounds.length}/${hits.length} (rolls: ${rawWoundRolls.join(", ")}, needed ${needed}+) \n`;

  // 3. Saves
  const saveTarget = defender.invulnerableSave ?? defender.save;
  const finalNeeded = saveTarget + (ap ?? 0);
  const rawSaveRolls = Array.from({ length: wounds.length }, () =>
    Math.floor(Math.random() * 6) + 1
  );
  const saves = rawSaveRolls.filter((roll) => roll >= finalNeeded);

  const failedSaves = wounds.length - saves.length;

  results += `Saves: ${saves.length}/${wounds.length} (rolls: ${rawSaveRolls.join(", ")}, needed ${finalNeeded}+) \n`;

  // 4. Damage
  const totalDamage = failedSaves * (damage ?? 1);
  results += `Damage Dealt: ${totalDamage}\n`;

  return results;
};

