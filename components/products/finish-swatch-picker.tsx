"use client";

import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/types/ecommerce";

interface FinishSwatchPickerProps {
  variants: ProductVariant[];
  selectedVariantId: string;
  onSelect: (variantId: string) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabels?: boolean;
}

export function FinishSwatchPicker({
  variants,
  selectedVariantId,
  onSelect,
  size = "sm",
  className,
  showLabels = false,
}: FinishSwatchPickerProps) {
  if (!variants || variants.length === 0) return null;

  const sizeStyles = {
    sm: "w-4.5 h-4.5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {variants.map((variant) => {
        const isSelected = variant.id === selectedVariantId;

        return (
          <button
            key={variant.id}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(variant.id);
            }}
            title={variant.finish_name}
            aria-label={`اختر تشطيب ${variant.finish_name}`}
            className={cn(
              sizeStyles[size],
              "relative rounded-full transition-all duration-200 shrink-0 shadow-2xs",
              "border border-black/15 dark:border-white/20",
              isSelected
                ? "ring-2 ring-accent-600 ring-offset-2 ring-offset-white scale-110"
                : "hover:scale-110 hover:border-black/30 opacity-85 hover:opacity-100"
            )}
            style={{ backgroundColor: variant.hex_color }}
          >
            {showLabels && (
              <span className="sr-only">{variant.finish_name}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
