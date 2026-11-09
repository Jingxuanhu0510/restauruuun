"use client";

import { useState } from "react";
import getDishImageUrl from "../utils/getDishImageUrl";

export default function DishCard({ dish, quantity = 0, onAdd, onDecrease }) {
  const { primary } = getDishImageUrl(dish) || {};
  const [broken, setBroken] = useState("");

  /* Tag: AI dish display Chef's Special */
  const cuisineLabel =
    dish.type === "ai" ? "CHEF’S SPECIAL" : dish.cuisine || "SPECIAL";

  const showNewBadge = dish.isNew;

  return (
    <div
      className="
        relative group overflow-hidden border rounded-xl shadow-md 
        transition-all duration-300 flex flex-col h-full 
        hover:shadow-2xl hover:-translate-y-2 active:translate-y-0 
        cursor-pointer bg-white border-stone-200 text-stone-900
      "
    >
      {/* cuisine badge */}
      <div
        className="
          absolute top-3 left-3 z-10 text-[10px] px-3 py-1 rounded-full
          border backdrop-blur-sm shadow-md uppercase tracking-wide font-bold
          border-stone-400 text-stone-800 bg-white/90 font-serif
        "
      >
        {cuisineLabel}
      </div>

      {/* NEW badge */}
      {showNewBadge && (
        <div
          className="
            absolute top-3 right-3 z-10 text-[10px] px-2 py-1 rounded-full
            bg-amber-500 text-white font-bold shadow
          "
        >
          NEW
        </div>
      )}

      <div className="h-40 relative overflow-hidden flex items-center justify-center bg-[#363636]">
        <span className="text-sm tracking-widest text-stone-200">{dish.imageFailed ? (dish.retryAt ? "今日出图额度已用完" : "图片暂时无法生成") : broken === primary ? "图片暂时无法显示" : "等待美味出炉"}</span>
        {!dish.imagePending && !dish.imageFailed && (
          <img src={primary} decoding="async" alt={dish.name}
            onLoad={() => setBroken("")} onError={() => setBroken(primary)}
            className="absolute inset-0 h-full w-full object-cover transition-opacity"
            style={{opacity: broken === primary ? 0 : 1}} />
        )}
      </div>

      {/* Text area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-md leading-tight font-serif-en text-stone-900">
              {dish.name}
            </h3>
          </div>

          {/* En material description */}
          <p
            className="
              text-xs mb-3 leading-relaxed whitespace-pre-line 
              text-stone-600 font-song-thin
            "
          >
            {dish.desc_en || "No description available."}
          </p>
        </div>

        {/* Bottom: Count + Controller */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-auto">
          <div className="text-[10px] opacity-70 flex items-center gap-1">
            <span className="text-stone-500 font-mono">
              Ordered: {dish.orderCount ?? 0}
            </span>
          </div>

          {quantity === 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd?.(dish);
              }}
              className="
                px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider 
                rounded-full shadow-sm transition-colors 
                bg-stone-800 text-white hover:bg-stone-600
              "
            >
              ORDER ➕
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDecrease?.(dish);
                }}
                className="
                  w-7 h-7 flex items-center justify-center 
                  rounded-full border border-stone-300 
                  text-xs font-bold hover:bg-stone-100
                "
              >
                −
              </button>

              <span className="w-5 text-center text-xs font-mono">
                {quantity}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd?.(dish);
                }}
                className="
                  w-7 h-7 flex items-center justify-center 
                  rounded-full border border-stone-900 
                  bg-stone-900 text-white text-xs font-bold 
                  hover:bg-stone-700
                "
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

