"use client";

export default function CartSidebar({
  cart,
  isOpen,
  onClose,
  onIncrease,
  onDecrease,
  onCheckout,
}) {
  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 0), 0);

  const isEmpty = cart.length === 0;

  return (
      <aside
        className={`
          fixed top-0 right-0 h-full w-80 
          bg-white/90 backdrop-blur-xl 
          shadow-2xl border-l border-stone-200 
          z-[200] transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >

      {/* Header */}
      <div className="
        flex items-center justify-between
        px-4 py-4 
        border-b border-white/20
        backdrop-blur-md bg-white/50
      ">
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-semibold tracking-[0.18em] text-stone-700">
            YOUR TRAY
          </span>
          <span className="text-[11px] text-stone-400 mt-0.5">
            {isEmpty ? "Tap ORDER to add dishes." : `${totalItems} item(s)`}
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center 
            rounded-full border border-stone-300 
            text-stone-500 hover:bg-stone-100 text-xs"
        >
          ✕
        </button>
      </div>

      <div className="border-b border-stone-200/60"></div>


      {/* Items */}
      <div className="h-[calc(100%-120px)] overflow-y-auto px-4 py-3 space-y-3">
        {isEmpty && (
          <p className="text-xs text-stone-400 mt-4">
            Your tray is empty. Tap <span className="font-semibold">ORDER</span>{" "}
            on any dish to add it here.
          </p>
        )}

        {cart.map((item) => (
        <div
          key={item.dish.id}
          className="
            flex items-center justify-between 
            py-3 
            border-b border-stone-200/50 
          "
        >
          {/* Left-hand name + cuisine */}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">
              {item.dish.name}
            </div>
            <div className="text-[10px] text-stone-400 tracking-wide mt-0.5">
              {item.dish.cuisine || "CHEF'S SPECIAL"}
            </div>
          </div>

          {/* Right hand: Quantity control */}
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => onDecrease(item.dish)}
              className="w-7 h-7 flex items-center justify-center 
                rounded-full border border-stone-300 text-xs 
                hover:bg-stone-100"
            >
              −
            </button>

            <span className="w-6 text-center text-xs font-mono">
              {item.qty}
            </span>

            <button
              onClick={() => onIncrease(item.dish)}
              className="w-7 h-7 flex items-center justify-center 
                rounded-full bg-black text-white text-xs 
                hover:bg-stone-800"
            >
              +
            </button>
          </div>
        </div>

        ))}
      </div>

      {/* Footer */}
      <div className="h-[30px] border-t border-stone-200 px-4 py-2 flex items-center">

        <button
          onClick={onCheckout}
          disabled={isEmpty}
          className={`w-full py-3 text-sm font-bold rounded-full transition-colors ${
            isEmpty
              ? "bg-stone-200 text-stone-400 cursor-not-allowed"
              : "bg-stone-900 text-white hover:bg-stone-700"
          }`}
        >
          Checkout
        </button>
      </div>
    </aside>
  );
}
