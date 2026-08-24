import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "light";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({
  className,
  variant = "default",
  size = "md",
  showText = true,
}: LogoProps) {
  const isLight = variant === "light";

  const sizeConfig = {
    sm: {
      imgBox: "w-9 h-9",
      imgSize: 36,
      title: "text-base sm:text-lg",
      sub: "text-[10px] sm:text-[11px]",
      gap: "gap-2.5",
    },
    md: {
      imgBox: "w-11 h-11 sm:w-12 sm:h-12",
      imgSize: 48,
      title: "text-lg sm:text-xl",
      sub: "text-[11px] sm:text-xs",
      gap: "gap-3",
    },
    lg: {
      imgBox: "w-14 h-14",
      imgSize: 56,
      title: "text-xl sm:text-2xl",
      sub: "text-xs sm:text-sm",
      gap: "gap-3.5",
    },
  }[size];

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center select-none font-alexandria",
        sizeConfig.gap,
        className
      )}
      aria-label="Blue Line | بلو لاين — لأدوات السباكة"
    >
      {/* 1. Official Blue Line Emblem Mark */}
      <div
        className={cn(
          "relative shrink-0 flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 overflow-hidden",
          sizeConfig.imgBox,
          isLight
            ? "bg-white p-1 shadow-sm border border-white/20"
            : "bg-transparent p-0.5"
        )}
      >
        <Image
          src="/logo.png"
          alt="Blue Line Logo"
          width={sizeConfig.imgSize}
          height={sizeConfig.imgSize}
          className="object-contain w-full h-full"
          priority
        />
      </div>

      {/* 2. Structured Brand Typography Lockup */}
      {showText && (
        <div className="flex flex-col justify-center text-start">
          {/* Main Brand Title */}
          <span
            className={cn(
              "font-extrabold tracking-tight leading-none",
              sizeConfig.title,
              isLight ? "text-white" : "text-brand-900"
            )}
          >
            بلو لاين
          </span>

          {/* Subtitle Tagline in Accent Color */}
          <span
            className={cn(
              "font-bold tracking-tight mt-1 leading-none",
              sizeConfig.sub,
              isLight ? "text-accent-300" : "text-[#1E6091]"
            )}
          >
            لأدوات السباكة
          </span>
        </div>
      )}
    </Link>
  );
}
