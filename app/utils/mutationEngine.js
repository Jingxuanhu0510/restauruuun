// app/utils/mutationEngine.js
import { normalizeDescription } from "./normalizeDescription";

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* -------------------------------------------------------------
 * Uniform: Generate Fine Dining-style dish names (excluding technical terms)
 * ------------------------------------------------------------- */
const culinaryNouns = [
  "Composition",
  "Arrangement",
  "Ensemble",
  "Pressing",
  "Reduction",
  "Creation",
  "Terrine",
  "Roulade",
  "Crisp",
  "Velouté",
];

const culinaryAdjectives = [
  "Citrus",
  "Caramel",
  "Golden",
  "Herb",
  "Spiced",
  "Seasonal",
  "Orchard",
  "Smoked",
  "Silky",
  "Warm",
];

const culinaryCores = [
  "Root",
  "Fruit",
  "Grain",
  "Butter",
  "Garden",
  "Harvest",
  "Floral",
  "Autumn",
];

/* Combined into： “Adjective + Core + Noun” */
function generateSoftDishName() {
  return `${pickRandom(culinaryAdjectives)} ${pickRandom(
    culinaryCores
  )} ${pickRandom(culinaryNouns)}`;
}

/* -------------------------------------------------------------
 * Real dishes: Derived from the original recipe, without AI stylisation
 * ------------------------------------------------------------- */
export function createRealVariant(baseDish) {
  const parsed = normalizeDescription(baseDish.desc || "");

  return {
    ...baseDish,
    id: "",
    name: generateSoftDishName(), // Replace with a consistent style
    cuisine: "CHEF’S SPECIAL",
    type: "real",
    isNew: true,
    orderCount: 0,
    desc_en: parsed.en
      ? `${parsed.en} Finished with a seasonal touch.`
      : "A refined seasonal interpretation crafted in-house.",
    desc_zh: "", // Chinese no longer displayed
  };
}

/* -------------------------------------------------------------
 * AI dishes: also disguised as regular dishes, without any AI/tech terminology
 * ------------------------------------------------------------- */
export function createAiVariant(hotDishes) {
  return {
    id: "",
    name: generateSoftDishName(), // Similarly real style
    cuisine: "CHEF’S SPECIAL",
    type: "ai",
    isNew: true,
    orderCount: 0,
    category: "special",
    desc_en: pickRandom([
      "Crafted with a balanced blend of textures and warm flavours.",
      "A delicate composition highlighting natural ingredients.",
      "Developed with attention to aroma, depth and subtle sweetness.",
      "A harmonious dish designed around gentle seasonal notes.",
    ]),
    desc_zh: "",
  };
}

/* -------------------------------------------------------------
 * The sorting logic remains unchanged
 * ------------------------------------------------------------- */
export function sortMenuForDisplay(list) {
  return [...list].sort((a, b) => {
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;

    const oa = a.orderCount || 0;
    const ob = b.orderCount || 0;
    if (oa !== ob) return ob - oa;

    return (a.name || "").localeCompare(b.name || "");
  });
}

/* -------------------------------------------------------------
 * The primary evolutionary logic remains unchanged, with only the generative component being replaced.
 * ------------------------------------------------------------- */
export function evolveMenu({ menu, cart, evolutionStep }) {
  if (!cart || cart.length === 0) {
    return { nextMenu: menu, newDishes: [] };
  }

  let updated = menu.map((dish) => {
    const item = cart.find((c) => c.dish.id === dish.id);
    if (!item) return dish;
    return {
      ...dish,
      orderCount: (dish.orderCount || 0) + item.qty,
      isNew: false,
    };
  });

  const sortedByHot = [...updated].sort(
    (a, b) => (b.orderCount || 0) - (a.orderCount || 0)
  );
  const hotDishes = sortedByHot.slice(0, 5).filter(Boolean);

  const sortedByCold = [...updated].sort(
    (a, b) => (a.orderCount || 0) - (b.orderCount || 0)
  );
  const replacedDish = sortedByCold[0];
  const variant = evolutionStep % 2 === 0
    ? createRealVariant(hotDishes[0])
    : createAiVariant(hotDishes);
  variant.id = `evo-${variant.type}-${evolutionStep + 1}-${Date.now()}`;
  const newDishes = [variant];
  const survivors = updated.filter(dish => dish.id !== replacedDish.id);
  const survivorsSorted = sortMenuForDisplay(survivors);

  return { nextMenu: [...newDishes, ...survivorsSorted], newDishes };
}
