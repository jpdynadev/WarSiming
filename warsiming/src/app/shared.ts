// shared.ts or types.ts
import { v4 as uuidv4 } from "uuid";

/** The Model for a single mini in a squad. */
export interface Model {
  id: string;         // e.g. a UUID
  name?: string;      // e.g. "Model #1"
  health: number;     // HP/Wounds
}

/** A blueprint for a type of squad or character, lacking unitId. */
export interface UnitTemplate {
  name: string;
  models: Model[];

  toughness: number;
  save: number;
  invulnerableSave?: number;
  leadership?: number;
  oc?: number;

  ballisticSkill: number;
  weaponSkill: number;
  strength: number;
  attacks: number;
  damage?: number;
  ap?: number;
}

/** The actual Unit in the user's army, each with a unique unitId. */
export interface Unit extends UnitTemplate {
  /** Unique ID for this particular instance of the unit */
  unitId: string;

  /** Track which model was last damaged */
  lastDamagedIndex?: number;
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
  isMelee: boolean
): string => {
  let results = "";

  const skill = isMelee ? attacker.weaponSkill : attacker.ballisticSkill;
  const rawHitRolls = Array.from({ length: attacker.attacks }, () => Math.floor(Math.random() * 6) + 1);
  const hits = rawHitRolls.filter((roll) => roll >= skill);

  results += `Hits: ${hits.length}/${attacker.attacks} (rolls: ${rawHitRolls.join(", ")})\n`;

  // Wound Rolls
  let needed: number;
  if (attacker.strength >= 2 * defender.toughness) needed = 2;
  else if (attacker.strength > defender.toughness) needed = 3;
  else if (attacker.strength === defender.toughness) needed = 4;
  else if (attacker.strength <= defender.toughness / 2) needed = 6;
  else needed = 5;

  const rawWoundRolls = Array.from({ length: hits.length }, () => Math.floor(Math.random() * 6) + 1);
  const wounds = rawWoundRolls.filter((roll) => roll >= needed);

  results += `Wounds: ${wounds.length}/${hits.length} (rolls: ${rawWoundRolls.join(", ")}, needed ${needed}+) \n`;

  // Saves
  const saveTarget = defender.invulnerableSave ?? defender.save;
  // (We ignore AP or we do: let finalSave = saveTarget + (attacker.ap ?? 0), etc.)
  const finalNeeded = saveTarget + (attacker.ap ?? 0);
  const rawSaveRolls = Array.from({ length: wounds.length }, () => Math.floor(Math.random() * 6) + 1);
  const saves = rawSaveRolls.filter((roll) => roll >= finalNeeded);

  const failedSaves = wounds.length - saves.length;
  results += `Saves: ${saves.length}/${wounds.length} (rolls: ${rawSaveRolls.join(", ")}, needed ${finalNeeded}+) \n`;

  // Damage
  const eachAttackDmg = attacker.damage ?? 1;
  const totalDamage = failedSaves * eachAttackDmg;
  results += `Damage Dealt: ${totalDamage}\n`;

  return results;
};
