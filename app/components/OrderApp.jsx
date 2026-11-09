"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import DishCard from "./DishCard";
import CartSidebar from "./CartSidebar";
import Dashboard from "./Dashboard";



import { CATEGORIES } from "../data/categories";
import { REAL_DISHES_SOURCE } from "../data/dishes";
import { sortMenuForDisplay } from "../utils/mutationEngine";

import { normalizeDescription } from "../utils/normalizeDescription";



export default function OrderApp() {
  const [activeCat, setActiveCat] = useState("all");

  // cart: [{ dish, qty }]
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const [evolutionStep, setEvolutionStep] = useState(0);

  const [menu, setMenu] = useState(() =>
    

    REAL_DISHES_SOURCE.map((d, i) => {
    const parsed = normalizeDescription(d.desc || "");

    return {
      ...d,
      id: d.id || `real-${i}`,
      type: d.type || "real",
      orderCount: d.orderCount || 0,
      isNew: d.isNew || false,

      // Field names using normaliseDescription：en / zh
      desc_en: parsed.en,
      desc_zh: parsed.zh,
    };

    })

  );


  // Data for the dashboard：{ items, evolutionStep, newDishes }
  const [dashboardOrder, setDashboardOrder] = useState(null);

  /* ---------- Toast ---------- */

  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  };

  /* ---------- Shopping Cart Related ---------- */

  const addToCart = (dish) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.dish.id === dish.id);
      if (existing) {
        return prev.map((i) =>
          i.dish.id === dish.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { dish, qty: 1 }];
    });

    showToast(`Added to tray: ${dish.name}`);
  };

  const decreaseInCart = (dish) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.dish.id === dish.id);
      if (!existing) return prev;
      if (existing.qty <= 1) {
        return prev.filter((i) => i.dish.id !== dish.id);
      }
      return prev.map((i) =>
        i.dish.id === dish.id ? { ...i, qty: i.qty - 1 } : i
      );
    });
  };

  // Display the current quantity for DishCard
  const quantityMap = useMemo(() => {
    const m = new Map();
    cart.forEach((item) => {
      m.set(item.dish.id, item.qty);
    });
    return m;
  }, [cart]);

  /* ---------- Settlement & Evolution ---------- */

  const busy = useRef(false);
  const retry = useRef({});
  useEffect(() => {
    let live = true;
    let timer;
    async function refresh() {
      try {
        const response = await fetch("/api/menu", {cache:"no-store"});
        if (response.ok && live && !busy.current) {
          const state = await response.json();
          if (live && !busy.current) { setMenu(state.menu); setEvolutionStep(state.evolutionStep); }
        }
      } finally { if (live) timer = setTimeout(refresh, 3500); }
    }
    refresh();
    return () => {live=false; clearTimeout(timer);};
  }, []);
  const handleCheckout = async () => {
    if (!cart.length || busy.current) return;
    busy.current = true;
    const items = cart.map(({dish,qty})=>({id:dish.id,qty}));
    const signature = JSON.stringify(items);
    if (retry.current.signature !== signature) retry.current={signature,key:crypto.randomUUID()};
    try {
      const response=await fetch("/api/menu",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({key:retry.current.key,items})});
      if (!response.ok) { showToast(response.status===409?"菜单已更新，请重新选择菜品":"订单未能确认，请重试"); if(response.status===409)setCart([]); return; }
      const state=await response.json();
      setMenu(state.menu); setEvolutionStep(state.evolutionStep); setDashboardOrder(state.order);
      setCart([]); setIsCartOpen(false); retry.current={};
    } catch { showToast("订单未能确认，请重试"); }
    finally {busy.current=false;}
  };

  /* ---------- Classification & Display ---------- */

  const sortedDishes = useMemo(() => {
    const list =
      activeCat === "all"
        ? menu
        : menu.filter((d) => d.category === activeCat);

    // Reapply the sorting rules to ensure stability even in non-evolutionary scenarios.
    return sortMenuForDisplay(list);
  }, [activeCat, menu]);

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      {/* Toast */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-stone-800 text-white text-sm px-6 py-3 rounded-full shadow-xl animate-slide-down flex items-center gap-2">
          <span>✅</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Cart Sidebar */}
      <CartSidebar
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onIncrease={addToCart}
        onDecrease={decreaseInCart}
        onCheckout={handleCheckout}
      />

      {/* Dashboard（Settlement Report + Which are real / Which are AI） */}
      {dashboardOrder && (
        <Dashboard
          order={dashboardOrder}
          onClose={() => setDashboardOrder(null)}
        />
      )}

      {/* Header */}
      {/* ──────────────────────────────── */}
      {/*  Sticky Header + Category Nav   */}
      {/* ──────────────────────────────── */}

      <header className="sticky top-0 z-50 bg-stone-50/90 backdrop-blur-md shadow-sm border-b border-stone-200">

        {/* Top Logo Row */}
        <div className="px-6 py-3 flex justify-between items-center">
          <h1 className="font-flower text-3xl text-stone-800">
            Restauruuun{" "}
            <span className="ml-2 text-[10px] font-mono text-stone-400">
              EVOLUTION: {evolutionStep}
            </span>
          </h1>

          {/* Cart */}
          <button
            onClick={() => setIsCartOpen((v) => !v)}
            className="relative p-2 bg-stone-200 rounded-full hover:bg-stone-300 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-stone-700"
            >
              <path d="M6 6h15l-1.5 9h-12z" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
              <path d="M6 6L5 2H2" />
            </svg>

            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {/* Category navigation (Category navigation (non-sticky but fixed at the top)) */}
        <nav className="border-t border-stone-200 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center flex-wrap gap-2 py-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={`
                    px-4 py-2 rounded-full text-xs font-bold border transition-all
                    ${
                      activeCat === cat.id
                        ? "bg-stone-800 text-white border-stone-800 shadow-md scale-105"
                        : "bg-white border-stone-200 text-stone-500 hover:bg-stone-100"
                    }
                  `}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

      </header>





      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-stone-200">
          <div>
            <h2 className="text-3xl font-serif-en italic text-stone-800">
              {CATEGORIES.find((c) => c.id === activeCat)?.name}
            </h2>
            <p className="mt-1 text-xs text-stone-400">
              Our dishes will run away, run away~ 菜品会悄悄进化，请留意 NEW 标记。
            </p>
          </div>
          <span className="text-xs text-stone-400">
            {sortedDishes.length} Items
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {sortedDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              quantity={quantityMap.get(dish.id) || 0}
              onAdd={addToCart}
              onDecrease={decreaseInCart}
            />
          ))}
        </div>
      </main>

    </div>
  );
}

