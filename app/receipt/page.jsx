"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";

export default function ReceiptPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const receiptRef = useRef(null);


  const orderId = searchParams.get("id") || "UNKNOWN";

  // Creation time is generated solely on the client side to prevent discrepancies between server-side rendering and client-side time.
  const [createdAt, setCreatedAt] = useState("");
  useEffect(() => {
    setCreatedAt(new Date().toLocaleString());
  }, []);

  // Fake data (to be replaced with genuine orders later)
  const order = {
    items: [
      { name: "Truffle Arancini", qty: 1 },
      { name: "Caviar Blini", qty: 1 },
    ],
    subtotal: 20,
  };

  const serviceFee = order.subtotal * 0.1; // 10%
  const tax = order.subtotal * 0.08; // 8%
  const total = order.subtotal + serviceFee + tax;

  const [email, setEmail] = useState("");

  // Download PNG (capture only the receipt, exclude the functional area)
  const handleDownloadPng = async () => {
    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 2 });
      const link = document.createElement("a");
      link.download = `receipt-${orderId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Failed to download PNG:", e);
    }
  };

  // Save email address (pretend it worked for now)
  const handleSaveEmail = () => {
    if (!email) {
      alert("请先输入邮箱～");
      return;
    }
    alert(`邮箱 ${email} 已保存（之后可以接 Supabase API）`);
  };

  const handleRestart = () => {
    router.push("/order");
  };

  return (
    <div className="min-h-screen w-full bg-stone-100 flex flex-col items-center pt-4 relative">
      {/* Printer bay */}
      <div className="w-full flex justify-center mb-0 select-none">
        <div
          className="
            h-[5px]
            bg-gradient-to-b from-stone-600 to-stone-900
            rounded-full
            shadow-inner
            shadow-[inset_0_-1px_3px_rgba(0,0,0,0.65)]
            relative
          "
          style={{ width: "360px" }}
        >
          <div
            className="
              absolute top-0 left-0 w-full h-[1px]
              bg-gradient-to-r from-stone-200/50 via-white/50 to-stone-300/50
              opacity-70
            "
          ></div>
        </div>
      </div>

      {/* Outer clipping frame: Receipt + functional area to create a printing animation together */}
      <div className="w-80 overflow-hidden pb-4">
        <div className="print-animation">
          {/* Body of the receipt */}
          <div
            ref={receiptRef}
            className="receipt-paper bg-white w-80 border border-dashed border-stone-300 shadow-sm rounded-sm p-6 font-mono text-sm"
          >
            <div className="text-center mb-6">
              <h1 className="font-flower text-4xl text-stone-800">
                Restauruuun
              </h1>
              <p className="text-xs text-stone-500 tracking-wide mt-1">
                Fine Dining Receipt
              </p>
            </div>

            <p className="text-xs mb-1">Order ID: {orderId}</p>
            <p className="text-xs mb-4">
              Created At: {createdAt || "Loading..."}
            </p>

            <hr className="border-dashed border-stone-300 mb-4" />

            {/* Dish list */}
            <div className="mb-4 space-y-1">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>x{item.qty}</span>
                </div>
              ))}
            </div>

            {/* Price area */}
            <div className="text-xs mb-1 flex justify-between">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>

            <div className="text-xs mb-1 flex justify-between">
              <span>Service Fee (10%)</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>

            <div className="text-xs mb-4 flex justify-between">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="font-bold mb-4 flex justify-between">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <hr className="border-dashed border-stone-300 mb-4" />

            {/* QR area */}
            <p className="text-center text-xs text-stone-500 mb-2">
              Scan to view receipt
            </p>

            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                `http://localhost:3000/receipt?id=${orderId}`
              )}`}
              alt="QR Code"
              className="mx-auto rounded-md shadow-sm mb-4"
            />

            {/* Thank you */}
            <p className="text-center text-xs text-stone-600">
              Thank you for dining with us! ❤️
            </p>
          </div>

          {/* Functional area: Slide down with the receipt */}
          <div className="flex flex-col items-center gap-4 mt-4 mb-10">
            {/* Enter email address + Save */}
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="输入邮箱以保存小票（可选）"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 border border-stone-400 rounded-md w-60 text-sm"
              />
              <button
                onClick={handleSaveEmail}
                className="px-4 py-2 bg-black text-white rounded-md text-sm"
              >
                保存
              </button>
            </div>

            {/* Download & Order Again */}
            <div className="flex gap-4">
              <button
                onClick={handleDownloadPng}
                className="px-8 py-3 bg-black text-white rounded-md text-sm"
              >
                下载 PNG
              </button>

              <button
                onClick={handleRestart}
                className="px-8 py-3 bg-black text-white rounded-md text-sm"
              >
                再来一单
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
