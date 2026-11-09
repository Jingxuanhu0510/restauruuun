"use client";

import { useRouter } from "next/navigation";

export default function Intro() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto bg-stone-100/50">
      <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <h1 className="font-flower text-6xl md:text-8xl text-stone-800 drop-shadow-sm">
          Restauruuun
        </h1>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <button
          onClick={() => router.push("/order")}
          className="group relative px-12 py-4 bg-stone-900 border-4 border-stone-900 text-white hover:bg-transparent hover:text-stone-900 transition-all duration-500 ease-in-out overflow-hidden mt-8 shadow-lg"
        >
          <div className="flex flex-col items-center relative z-10">
            <span className="font-flower text-4xl mb-1 transition-colors">
              Start Ordering
            </span>
            <span className="font-song-thin text-sm tracking-[0.3em] font-bold transition-colors">
              开始点单
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
