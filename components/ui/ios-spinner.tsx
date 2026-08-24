import React from "react";
import { cn } from "@/lib/utils";

interface IosSpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: string;
}

const sizeMap = {
  sm: "w-5 h-5",
  md: "w-7 h-7",
  lg: "w-9 h-9",
  xl: "w-12 h-12",
};

// 8 spokes with authentic iOS graduated opacities matching the reference
const SPOKES = [
  { angle: 0, opacity: 1.0 },
  { angle: 45, opacity: 0.875 },
  { angle: 90, opacity: 0.75 },
  { angle: 135, opacity: 0.625 },
  { angle: 180, opacity: 0.5 },
  { angle: 225, opacity: 0.375 },
  { angle: 270, opacity: 0.25 },
  { angle: 315, opacity: 0.125 },
];

export function IosSpinner({
  size = "lg",
  className,
  color = "#262626",
  ...props
}: IosSpinnerProps) {
  return (
    <div className="inline-flex items-center justify-center">
      <style>{`
        @keyframes iosDaisySpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .ios-daisy-spinner {
          animation: iosDaisySpin 0.8s steps(8) infinite;
          transform-origin: center;
        }
      `}</style>
      <svg
        viewBox="0 0 36 36"
        fill={color}
        className={cn(
          "ios-daisy-spinner shrink-0",
          sizeMap[size],
          className
        )}
        role="status"
        aria-label="جار التحميل..."
        {...props}
      >
        {SPOKES.map(({ angle, opacity }) => (
          <rect
            key={angle}
            x="16.4"
            y="4"
            width="3.2"
            height="8.5"
            rx="1.6"
            opacity={opacity}
            transform={`rotate(${angle} 18 18)`}
          />
        ))}
      </svg>
    </div>
  );
}
