"use client";

import { useRef } from "react";
import html2canvas from "html2canvas";

export default function Dashboard({ order, onClose }) {
  if (!order) return null;

  const { items, evolutionStep } = order;
  const receiptRef = useRef(null);

  // How many portions have been ordered (displayed as x1 / x2 etc.)
  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  /* --- Authentic dishes / AI dishes Quantity (per serving) --- */
  const realCount = items
    .filter((i) => i.dish.type === "real")
    .reduce((s, i) => s + i.qty, 0);

  const aiCount = items
    .filter((i) => i.dish.type === "ai")
    .reduce((s, i) => s + i.qty, 0);

  const totalQty = realCount + aiCount;
  const aiRatio = totalQty ? (aiCount / totalQty) * 100 : 0;
  const realPct = totalQty ? (realCount / totalQty) * 100 : 0;
  const aiPct = totalQty ? (aiCount / totalQty) * 100 : 0;

  /* --- Flavour Analysis --- */
  const flavorKeywords = {
    sweet: ["caramel", "honey", "fruit", "apple"],
    citrus: ["lemon", "orange", "citrus", "spritz"],
    savory: ["beef", "pork", "umami", "roulade", "velouté"],
    spicy: ["pepper", "chili", "spice"],
  };

  let flavorScore = { sweet: 0, citrus: 0, savory: 0, spicy: 0 };

  items.forEach((item) => {
    const name = item.dish.name.toLowerCase();
    for (let key in flavorKeywords) {
      if (flavorKeywords[key].some((k) => name.includes(k))) {
        flavorScore[key] += item.qty;
      }
    }
  });

  const favoriteFlavor =
    Object.entries(flavorScore).sort((a, b) => b[1] - a[1])[0][0];

  /* --- AI Taste Interpretation (English version) --- */

  const flavorMapEn = {
    sweet: "soft sweetness",
    citrus: "bright citrus notes",
    savory: "rich umami flavors",
    spicy: "spicy, stimulating aromas",
  };

  const flavorInsight =
    flavorScore[favoriteFlavor] > 0
      ? `Your order indicates a preference for ${flavorMapEn[favoriteFlavor]}.`
      : "No clear flavor preference was detected in this order.";

  let aiInsight = "";
  if (aiRatio >= 60) {
    aiInsight =
      "You show a strong openness toward AI-generated cuisine. The next evolution will introduce bolder, more experimental variations.";
  } else if (aiRatio >= 30) {
    aiInsight =
      "You maintain a balanced interest between authentic dishes and algorithmic creations. The next evolution will adjust subtly and steadily.";
  } else {
    aiInsight =
      "You prefer traditional, kitchen-crafted dishes. The system will introduce AI influence more gently in the next evolution.";
  }

  const evolutionInsight = `Based on your selections, Evolution ${
    evolutionStep + 1
  } is expected to shift slightly in sweetness, richness, and visual intensity.`;


  /* --- Download receipt PNG --- */
  const handleDownloadPng = async () => {
    if (!receiptRef.current) return;
    const canvas = await html2canvas(receiptRef.current, { scale: 2 });
    const link = document.createElement("a");
    link.download = `receipt-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div
      className="
      fixed inset-0 z-[9999]
      bg-black/60 backdrop-blur-sm
      flex flex-col items-center
      pt-10
      overflow-y-auto
      pointer-events-auto
      max-h-screen
    "
    >
      {/* Printer tray */}
      <div className="w-full flex justify-center select-none">
        <div
          className="h-[6px] bg-gradient-to-b from-stone-600 to-stone-900 rounded-full shadow-inner shadow-[inset_0_-1px_4px_rgba(0,0,0,0.65)] relative"
          style={{ width: "360px" }}
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-stone-200/50 via-white/50 to-stone-300/50"></div>
        </div>
      </div>

      {/* Body of the receipt */}
      <div className="w-80 overflow-visible mt-0 pb-6">
        <div className="print-animation">
          <div
            ref={receiptRef}
            className="receipt-paper bg-white w-80 border border-dashed border-stone-300 shadow-sm rounded-sm p-6 font-mono text-sm"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="font-flower text-4xl text-stone-800">
                Restauruuun
              </h1>
              <p className="text-xs text-stone-500 tracking-wide mt-1">
                Taste Analysis Report • Evolution {evolutionStep}
              </p>
            </div>

            {/* 分组 Dishes */}
            <p className="text-xs font-semibold mb-2">Your Dishes</p>

            {/* Kitchen Crafted */}
            {realCount > 0 && (
              <div className="mb-3">
                <p className="text-[10px] font-semibold tracking-wide text-stone-600 mb-1">
                  Kitchen Crafted
                </p>

                {items
                  .filter((i) => i.dish.type === "real")
                  .map((item) => (
                    <div
                      key={item.dish.id}
                      className="flex justify-between mb-1"
                    >
                      <span>{item.dish.name}</span>
                      <span className="font-mono text-xs">x{item.qty}</span>
                    </div>
                  ))}
              </div>
            )}

            {/* AI Synthetic */}
            {aiCount > 0 && (
              <div className="mb-3">
                <p className="text-[10px] font-semibold tracking-wide text-stone-600 mb-1">
                  AI • Synthetic Gastronomy
                </p>

                {items
                  .filter((i) => i.dish.type === "ai")
                  .map((item) => (
                    <div
                      key={item.dish.id}
                      className="flex justify-between mb-1"
                    >
                      <span>{item.dish.name}</span>
                      <span className="font-mono text-xs">x{item.qty}</span>
                    </div>
                  ))}
              </div>
            )}

            <hr className="border-dashed border-stone-300 my-4" />

            {/* --- Dish Reality Breakdown --- */}
            <p className="text-xs font-semibold mb-2">
              Dish Reality Breakdown
            </p>

            <div className="flex justify-between text-[10px] mb-1">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-stone-700 rounded-full"></span>
                Real
              </span>

              <span className="flex items-center gap-1">
                AI
                <span
                  className="w-2 h-2 rounded-full overflow-hidden border border-stone-500"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(
                        45deg,
                        rgba(0,0,0,0.35) 0px,
                        rgba(0,0,0,0.35) 1px,
                        transparent 1px,
                        transparent 1.8px
                      )
                    `,
                    opacity: 0.7,
                  }}
                ></span>
              </span>
            </div>

            <div className="relative w-full h-3 mb-4 rounded-full overflow-hidden border border-stone-400">
              {/* AI——Fill area */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(
                      45deg,
                      rgba(0,0,0,0.33) 0px,
                      rgba(0,0,0,0.33) 1px,
                      transparent 1px,
                      transparent 1.8px
                    )
                  `,
                  opacity: 0.45,
                }}
              ></div>

              {/* Real——Fill area */}
              <div
                className="
                  absolute left-0 top-0 h-full bg-stone-700
                  rounded-l-full rounded-r-none
                "
                style={{ width: `${realPct}%` }}
              ></div>
            </div>

            {/* --- Flavor Profile --- */}
            <p className="text-xs font-semibold mb-2">Flavor Profile</p>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] mb-4">
              {["sweet", "citrus", "savory", "spicy"].map((key) => (
                <div key={key}>
                  <span className="capitalize">{key}</span>
                  <div className="h-1 bg-stone-200 rounded mt-1 overflow-hidden">
                    <div
                      className="h-full bg-stone-700"
                      style={{
                        width:
                          flavorScore[key] > 0
                            ? `${Math.min(flavorScore[key] * 40, 100)}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <hr className="border-dashed border-stone-300 my-4" />

            {/* --- Insights --- */}
            <div className="space-y-3 text-xs leading-relaxed">
              <p className="font-semibold text-stone-700">
                AI Taste Interpretation
              </p>
              <p className="text-stone-600">{aiInsight}</p>
              <p className="text-stone-600">{evolutionInsight}</p>
            </div>

            <p className="text-center text-xs text-stone-600 mt-4">
              Your preferences will guide the next transformation. ❤️
            </p>
          </div>

          <div className="flex flex-row justify-center gap-4 mt-4 pb-20">
            <button
              onClick={handleDownloadPng}
              className="px-6 py-2 bg-black text-white rounded-full text-sm"
            >
              Download PNG
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2 bg-stone-200 text-stone-800 rounded-full text-sm hover:bg-stone-300"
            >
              Back to menu
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
