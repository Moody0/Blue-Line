import React from "react";

interface ProductVisualProps {
  sku?: string;
  finishColor?: string;
  productType?: string;
  className?: string;
}

export function ProductVisual({
  sku = "",
  finishColor = "#D4D4D8",
  className = "w-full h-full",
}: ProductVisualProps) {
  const isGold = finishColor === "#EAB308" || finishColor === "#F59E0B";
  const isMatteBlack = finishColor === "#18181B" || finishColor === "#1e293b";
  const isBronze = finishColor === "#B45309" || finishColor === "#9A3412";

  // Unique Gradient ID prefixes
  const gradId = `metal-grad-${sku || "def"}`;

  return (
    <div className={`relative flex items-center justify-center w-full h-full p-2 ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full max-w-full max-h-full transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Metallic / Chrome Linear Gradient */}
          <linearGradient id={`${gradId}-chrome`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isGold ? "#FEF08A" : isMatteBlack ? "#334155" : isBronze ? "#FDBA74" : "#FFFFFF"} />
            <stop offset="25%" stopColor={isGold ? "#EAB308" : isMatteBlack ? "#1E293B" : isBronze ? "#EA580C" : "#E2E8F0"} />
            <stop offset="50%" stopColor={isGold ? "#CA8A04" : isMatteBlack ? "#0F172A" : isBronze ? "#C2410C" : "#94A3B8"} />
            <stop offset="75%" stopColor={isGold ? "#FACC15" : isMatteBlack ? "#1E293B" : isBronze ? "#EA580C" : "#CBD5E1"} />
            <stop offset="100%" stopColor={isGold ? "#A16207" : isMatteBlack ? "#020617" : isBronze ? "#9A3412" : "#64748B"} />
          </linearGradient>

          {/* Curved Spout Chrome Gradient */}
          <linearGradient id={`${gradId}-spout`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor={isGold ? "#EAB308" : isMatteBlack ? "#1E293B" : isBronze ? "#EA580C" : "#E2E8F0"} />
            <stop offset="70%" stopColor={isGold ? "#CA8A04" : isMatteBlack ? "#0F172A" : isBronze ? "#C2410C" : "#94A3B8"} />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>

          {/* Highlight Specular Gradient */}
          <linearGradient id={`${gradId}-highlight`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.7" />
          </linearGradient>

          {/* Escutcheon Circular Gradients */}
          <radialGradient id={`${gradId}-flange`} cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor={isGold ? "#CA8A04" : isMatteBlack ? "#1E293B" : isBronze ? "#C2410C" : "#CBD5E1"} />
            <stop offset="100%" stopColor={isGold ? "#A16207" : isMatteBlack ? "#020617" : isBronze ? "#9A3412" : "#64748B"} />
          </radialGradient>
        </defs>

        {sku.includes("104") ? (
          /* Handheld Shower Wand */
          <g>
            <path
              d="M90 85 L90 180 C90 185 110 185 110 180 L110 85 Z"
              fill={`url(#${gradId}-chrome)`}
              stroke="#000000"
              strokeWidth="0.5"
              strokeOpacity="0.2"
            />
            <rect
              x="70"
              y="20"
              width="60"
              height="75"
              rx="16"
              fill={`url(#${gradId}-chrome)`}
              stroke="#000000"
              strokeWidth="0.5"
              strokeOpacity="0.3"
            />
            <rect x="76" y="26" width="48" height="63" rx="12" fill="#F8FAFC" fillOpacity="0.95" />
            {[38, 48, 58, 68, 78].map((y) =>
              [84, 92, 100, 108, 116].map((x) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill={isMatteBlack ? "#334155" : "#64748B"} />
              ))
            )}
          </g>
        ) : (
          /* High-Precision Wall-Mounted & Deck Kitchen Mixer matching user reference screenshot */
          <g transform="translate(10, 5)">
            {/* 1. Left Wall Circular Flange / Escutcheon */}
            <ellipse
              cx="45"
              cy="115"
              rx="18"
              ry="24"
              fill={`url(#${gradId}-flange)`}
              stroke="#CBD5E1"
              strokeWidth="1"
            />
            <ellipse
              cx="41"
              cy="115"
              rx="15"
              ry="20"
              fill={`url(#${gradId}-chrome)`}
            />

            {/* Left Connecting Nut / Union */}
            <path
              d="M48 106 L62 108 L62 122 L48 124 Z"
              fill={`url(#${gradId}-chrome)`}
              stroke="#94A3B8"
              strokeWidth="0.5"
            />

            {/* 2. Right / Rear Wall Flange */}
            <ellipse
              cx="105"
              cy="90"
              rx="14"
              ry="18"
              fill={`url(#${gradId}-flange)`}
              stroke="#CBD5E1"
              strokeWidth="1"
            />
            <path
              d="M98 83 L110 85 L110 97 L98 95 Z"
              fill={`url(#${gradId}-chrome)`}
            />

            {/* 3. Horizontal Main Mixer Body Bar */}
            <path
              d="M55 110 C55 102 62 98 75 97 L125 93 C135 93 142 98 142 106 L142 110 C142 118 135 123 125 123 L75 127 C62 127 55 122 55 110 Z"
              fill={`url(#${gradId}-chrome)`}
              stroke="#94A3B8"
              strokeWidth="0.5"
            />
            {/* Top highlight bar */}
            <path
              d="M65 104 C75 100 120 96 135 97"
              stroke={`url(#${gradId}-highlight)`}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* 4. High-Arch Curved Swan Neck Spout */}
            {/* Base Spout Nut Collar */}
            <rect
              x="78"
              y="92"
              width="14"
              height="8"
              rx="2"
              fill={`url(#${gradId}-chrome)`}
              stroke="#94A3B8"
              strokeWidth="0.5"
            />

            {/* Spout Arch Tube */}
            <path
              d="M80 92 L80 48 C80 18 175 18 175 75 L175 112 L163 112 L163 75 C163 30 92 30 92 48 L92 92 Z"
              fill={`url(#${gradId}-spout)`}
              stroke="#CBD5E1"
              strokeWidth="0.5"
            />

            {/* Spout Specular Highlight Arc */}
            <path
              d="M83 52 C83 23 170 23 170 75 L170 108"
              stroke={`url(#${gradId}-highlight)`}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Aerator Tip Collar */}
            <rect
              x="162"
              y="110"
              width="14"
              height="12"
              rx="2.5"
              fill={`url(#${gradId}-chrome)`}
              stroke="#94A3B8"
              strokeWidth="0.5"
            />

            {/* 5. Central Lever Cartridge Cylinder */}
            <ellipse
              cx="106"
              cy="114"
              rx="18"
              ry="14"
              fill={`url(#${gradId}-chrome)`}
              stroke="#94A3B8"
              strokeWidth="0.5"
            />
            <path
              d="M92 114 L120 114 L126 136 L98 136 Z"
              fill={`url(#${gradId}-chrome)`}
            />

            {/* 6. Front Ergonomic Control Lever */}
            <path
              d="M102 126 C102 120 122 120 126 126 L124 175 C124 182 110 184 108 175 Z"
              fill={`url(#${gradId}-chrome)`}
              stroke="#CBD5E1"
              strokeWidth="0.5"
            />
            {/* Specular light beam down the lever */}
            <path
              d="M112 128 L114 178"
              stroke={`url(#${gradId}-highlight)`}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Hot / Cold Indicator Dots */}
            {/* Red (Hot) Dot */}
            <circle cx="107" cy="142" r="1.5" fill="#EF4444" />
            {/* Blue (Cold) Dot */}
            <circle cx="121" cy="140" r="1.5" fill="#3B82F6" />
          </g>
        )}
      </svg>
    </div>
  );
}
