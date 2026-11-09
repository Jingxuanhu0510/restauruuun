"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-stone-100 flex flex-col items-center justify-center select-none">

      {/* LOGO*/}
      <h1
        className="
          font-flower text-7xl 
          text-stone-800 tracking-wide
          fade-in-soft
        "
        style={{ animationDelay: "0.05s" }}
      >
        Restauruuun
      </h1>

      {/* Subtitle*/}
      <p
        className="
          font-serif-en text-stone-500 
          text-[0.7rem] tracking-[0.28em]
          mt-3 mb-12
          fade-in-soft
        "
        style={{ animationDelay: "0.18s" }}
      >
        THE FINEST RESTAURANT IN THE WORLD.
      </p>

      {/* Main button */}
      <button
        onClick={() => router.push("/order")}
        className="
          px-12 py-3
          bg-black text-white
          border border-black
          rounded-md
          text-sm tracking-[0.25em]
          transition-all duration-300
          hover:bg-[#c9b68b] hover:border-[#c9b68b]
          active:scale-95
          shadow-sm hover:shadow-[0_6px_25px_rgba(180,150,90,0.35)]
          fade-in-soft
        "



        style={{ animationDelay: "0.32s" }}
      >
        START ORDERING ・ 开始点单
      </button>

      {/* Divider */}
      <div
        className="
          w-[320px] h-[1.3px]
          bg-gradient-to-r from-transparent via-[#c9b68b] to-transparent
          opacity-90
          mt-14 mb-3
          fade-in-soft
        "
        style={{ animationDelay: "0.55s" }}
      ></div>

      {/* Copywriting */}
      <p
        className="
          text-[0.72rem] text-stone-500 
          tracking-wide text-center 
          max-w-sm leading-relaxed
          fade-in-soft
        "
        style={{ animationDelay: "0.75s" }}
      >
        Dedicated to delivering the finest culinary experience.
      </p>

    </div>
  );
}
