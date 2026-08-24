"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    setIsVisible(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    try {
      document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="العودة لأعلى الصفحة"
      title="العودة لأعلى الصفحة"
      className={cn(
        "fixed z-40 flex items-center justify-center rounded-full bg-[#1E6091] hover:bg-[#15486E] text-white border-2 border-white shadow-xl shadow-black/20 transition-all duration-300 ease-out cursor-pointer hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6091] focus-visible:ring-offset-2",
        // Sizing matching reference screenshot
        "w-11 h-11 sm:w-12 sm:h-12",
        // Positioned on the RIGHT side to avoid overlapping Next.js dev overlay, safely above MobileBottomBar
        "bottom-20 md:bottom-8 right-5 sm:right-8",
        isVisible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-4 scale-75 pointer-events-none"
      )}
    >
      <ArrowUp size={20} strokeWidth={2.5} className="text-white shrink-0" />
    </button>
  );
}
