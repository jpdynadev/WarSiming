import { v4 as uuidv4 } from "uuid";

// --------------------
// MODEL & UNIT TYPES
// --------------------
export type Model = {
  /** Internal unique identifier (UUID, etc.) */
  id: string;
  /** Name used in the UI (e.g. "Model #1") */
  name?: string;
  /** Wounds (HP) for that model */
  health: number;
};

export type Unit = {
  /* Basic Identity */
  name: string; // e.g. "Plague Marine Squad"

  /* Models in this unit */
  models: Model[];

  /**
   * Track which model index was last damaged.
   * This helps continue allocating wounds to the
   * same model if it’s still alive.
   */
  lastDamagedIndex?: number;

  /* Core 10th Edition Stats (simplified) */
  movement?: number;          // M
  toughness: number;          // T
  save: number;               // Sv
  invulnerableSave?: number;  // e.g. 4 or 5
  leadership?: number;        // Ld
  oc?: number;                // Objective Control

  /* Offensive Stats (abstracted) */
  ballisticSkill: number;     // e.g. 3 (for 3+)
  weaponSkill: number;        // e.g. 3 (for 3+)
  strength: number;           // S
  attacks: number;            // A (number of attacks per model)
  damage?: number;            // D (default to 1 if absent)
  ap?: number;                // AP (default to 0 if absent)

  /* Additional fields if needed:
     - specialRules?: string[];
     - movementAbilities?: string[];
     etc.
   */
};

// --------------------
// Example Army Options
// --------------------
//
// Below is an illustrative approach. We keep “generic” stats for each unit
// so that your roll-to-attack logic can handle them (like your `handleAttack`).
//
// For big Warhammer 40k rosters, you would realistically store each weapon
// or special ability individually. This is a *simplified* approach for demonstration.
//
export const armyOptions: Record<string, Unit[]> = {
  /** You can still keep a “Generic” or test army here if desired */
  Generic: [],

  // ------------------
  // DEATH GUARD
  // ------------------
  "Death Guard": [
    {
      name: "Plague Marine",
      models: Array(5) // 5 models, each 2 wounds, but let's keep it simple at 10 "HP"
        .fill(null)
        .map(() => ({ id: uuidv4(), health: 10 })),
      // Key stats
      movement: 5,
      toughness: 4,
      save: 3,
      invulnerableSave: 5, // Example if you allow “icon-laden squads”
      leadership: 6,
      oc: 2,
      ballisticSkill: 3,
      weaponSkill: 3,
      strength: 4,
      // For simplicity, treat them as if they do 1 damage each, AP 0
      attacks: 2,
      damage: 1,
      ap: 0,
    },
    {
      name: "Blightlord Terminator",
      models: Array(3).fill(null).map(() => ({
        id: uuidv4(),
        health: 15,
      })),
      movement: 4,
      toughness: 5,
      save: 2,
      invulnerableSave: 4,
      leadership: 6,
      oc: 1,
      ballisticSkill: 3,
      weaponSkill: 2,
      strength: 5,
      attacks: 3,
      damage: 1,
      ap: 0, // example: we keep it at 0 for easy math
    },
    {
      name: "Foetid Bloat-Drone",
      models: Array(1).fill(null).map(() => ({
        id: uuidv4(),
        health: 20,
      })),
      movement: 10,
      toughness: 7,
      save: 3,
      invulnerableSave: 4,
      leadership: 6,
      oc: 3,
      // Has both ballisticSkill & weaponSkill (4+ in the lore)
      ballisticSkill: 4,
      weaponSkill: 4,
      strength: 6,
      attacks: 2,
      damage: 2, // say each “fleshmower” attack does 2 damage
      ap: 1,     // just a sample
    },
    {
      name: "Poxwalkers",
      models: Array(10).fill(null).map(() => ({
        id: uuidv4(),
        health: 1, // each poxwalker basically 1 wound
      })),
      movement: 4,
      toughness: 4,
      save: 7, // effectively no armor
      invulnerableSave: undefined, // none
      leadership: 8,
      oc: 1,
      ballisticSkill: 6, // ironically they can’t shoot well at all
      weaponSkill: 5,
      strength: 3,
      attacks: 2, // each poxwalker has 2 attacks
      damage: 1,
      ap: 0,
    },
    // ...and so on: you could add your Daemon Prince, Deathshroud, etc.
  ],

  // ------------------
  // SPACE MARINES
  // ------------------
  "Space Marines": [
    {
      name: "Tactical Marine",
      models: Array(5).fill(null).map(() => ({
        id: uuidv4(),
        health: 8,
      })),
      movement: 6,
      toughness: 4,
      save: 3,
      invulnerableSave: undefined,
      leadership: 6,
      oc: 2,
      ballisticSkill: 3,
      weaponSkill: 3,
      strength: 4,
      attacks: 1,
      damage: 1,
      ap: 0,
    },
    {
      name: "Assault Terminator",
      models: Array(2).fill(null).map(() => ({
        id: uuidv4(),
        health: 12,
      })),
      movement: 5,
      toughness: 4,
      save: 2,
      invulnerableSave: 4,
      leadership: 6,
      oc: 1,
      ballisticSkill: 3,
      weaponSkill: 2,
      strength: 5,
      attacks: 2,
      damage: 2, // e.g. thunder hammer or power fist
      ap: 2,
    },
    {
      name: "Dreadnought",
      models: Array(1).fill(null).map(() => ({
        id: uuidv4(),
        health: 25,
      })),
      movement: 6,
      toughness: 7,
      save: 3,
      invulnerableSave: 5,
      leadership: 6,
      oc: 3,
      ballisticSkill: 3,
      weaponSkill: 3,
      strength: 6,
      attacks: 3,
      damage: 3, // dreadnought CCWs often do 3 or more
      ap: 2,
    },
  ],
};

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
