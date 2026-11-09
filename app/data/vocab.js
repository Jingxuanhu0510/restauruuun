// app/components/data/vocab.js

export const VOCAB = {
  preparations: [
    "Deconstructed",
    "Essence of",
    "Fermented",
    "Spherical",
    "Foraged",
    "Aged",
    "Compressed",
    "Molecular",
    "Slow-cooked",
    "Smoked",
    "Sous-vide",
    "Liquid Nitrogen",
  ],
  accompaniments: [
    "Foam",
    "Soil",
    "Dust",
    "Gel",
    "Air",
    "Emulsion",
    "Reduction",
    "Tuile",
    "Ash",
    "Caviar",
    "Pearls",
    "Cloud",
    "Mist",
    "Crystals",
  ],
  adjectives: [
    "Ephemeral",
    "Quantum",
    "Forgotten",
    "Wild",
    "Heirloom",
    "Invisible",
    "Liquid",
    "Reimagined",
    "Velvet",
    "Crystal",
    "Ancestral",
    "Void",
  ],
};

export const generateEvolution = (sourceDish) => {
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const engDesc = sourceDish.desc.split("(")[0];
  const ingredients = engDesc.split(",").map((s) => s.trim());
  const baseIngredient = ingredients[0] || sourceDish.name;
  const secondIngredient = ingredients[1] || "Essence";

  const styles = [
    () =>
      `Deconstructed ${baseIngredient} with ${pick(VOCAB.adjectives)} ${pick(
        VOCAB.accompaniments
      )}`,
    () =>
      `Essence of ${baseIngredient} & ${pick(VOCAB.preparations)} ${secondIngredient}`,
    () =>
      `Study in ${baseIngredient}: ${pick(
        VOCAB.preparations
      )} & ${pick(VOCAB.preparations)}`,
    () => `The ${pick(VOCAB.adjectives)} ${baseIngredient}`,
    () =>
      `${baseIngredient} ${pick(VOCAB.accompaniments)} with ${pick(
        VOCAB.preparations
      )} ${secondIngredient}`,
  ];

  const newName = pick(styles)();
  const newDesc = `${pick(VOCAB.preparations)} ${baseIngredient}, ${
    pick(VOCAB.adjectives)
  } ${pick(VOCAB.accompaniments)}, ${secondIngredient} (${baseIngredient} 变奏, ${secondIngredient} 萃取, ${pick(
    VOCAB.accompaniments
  )} 质地)`;

  return {
    id: `evolved-${Math.random().toString(36).substr(2, 9)}`,
    name: newName,
    desc: newDesc,
    category: sourceDish.category,
    cuisine: "Algorithmic",
    type: "generated",
    orderCount: 0,
    lastOrderTime: Date.now(),
  };
};
