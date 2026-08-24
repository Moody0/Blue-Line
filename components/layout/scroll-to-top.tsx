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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="العودة لأعلى الصفحة"
      title="العودة لأعلى الصفحة"
      className={cn(
        "fixed z-40 flex items-center justify-center rounded-full bg-[#1E6091] hover:bg-[#15486E] text-white border-2 border-white shadow-lg shadow-black/15 transition-all duration-300 ease-out cursor-pointer hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#1E6091] focus:ring-offset-2",
        // Sizing matching reference screenshot
        "w-11 h-11 sm:w-12 sm:h-12",
        // Positioned safely above MobileBottomBar on mobile and at bottom corner on desktop
        "bottom-20 md:bottom-8 left-5 sm:left-8",
        isVisible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-4 scale-75 pointer-events-none"
      )}
    >
      <ArrowUp size={20} strokeWidth={2.5} className="text-white shrink-0" />
    </button>
  );
}
