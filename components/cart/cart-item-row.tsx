"use client";

import Link from "next/link";
import { Plus, Minus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/formatters";
import type { CartItem } from "@/types/ecommerce";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const unitPrice =
    item.variant?.price_override ??
    item.product?.discount_price ??
    item.product?.base_price ??
    0;
  const lineTotal = unitPrice * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-border-default hover:border-border-strong transition-all">
      {/* Product Information */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div
          className="w-16 h-16 rounded-xl border border-border-default shrink-0 flex items-center justify-center shadow-2xs"
          style={{
            backgroundColor: item.variant?.hex_color || "#F1F5F9",
          }}
        >
          <span className="text-xs font-mono font-bold opacity-80">
            {item.variant?.finish_code || "BL"}
          </span>
        </div>

        <div className="space-y-1 min-w-0">
          <Link
            href={`/product/${item.product?.slug}`}
            className="text-sm font-bold text-text-primary hover:text-accent-600 transition-colors line-clamp-1"
          >
            {item.product?.title_ar}
          </Link>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span>
              التشطيب:{" "}
              <strong className="text-text-secondary font-medium">
                {item.variant?.finish_name || "قياسي"}
              </strong>
            </span>
            <span>•</span>
            <span className="font-mono text-[11px]">{item.product?.sku}</span>
          </div>
          <p className="text-xs font-semibold text-brand-900 sm:hidden">
            {formatPrice(unitPrice)} للقطعة
          </p>
        </div>
      </div>

      {/* Controls & Pricing */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border-default">
        {/* Quantity control */}
        <div className="flex items-center border border-border-default rounded-xl bg-surface-50 overflow-hidden">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-surface-200 transition-colors"
            aria-label="تقليل الكمية"
          >
            <Minus size={13} />
          </button>
          <span className="w-9 text-center text-xs font-bold font-plus-jakarta">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-surface-200 transition-colors"
            aria-label="زيادة الكمية"
          >
            <Plus size={13} />
          </button>
        </div>

        {/* Unit & Line Total */}
        <div className="text-end min-w-24">
          <div className="text-sm font-extrabold text-brand-900">
            {formatPrice(lineTotal)}
          </div>
          <div className="text-[11px] text-text-muted hidden sm:block">
            {formatPrice(unitPrice)} × {item.quantity}
          </div>
        </div>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="text-text-muted hover:text-destructive p-2 rounded-lg hover:bg-destructive/10 transition-colors"
          aria-label="حذف من السلة"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
