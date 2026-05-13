"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()} 
      className="inline-flex items-center gap-3 text-sm font-semibold text-black hover:text-[#e40037] transition-colors group z-10"
      aria-label="Go back"
    >
      <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center group-hover:border-[#e40037] transition-colors">
        <ChevronLeft className="w-6 h-6" />
      </div>
      <span className="uppercase tracking-wider font-sans">Back page</span>
    </button>
  );
}
