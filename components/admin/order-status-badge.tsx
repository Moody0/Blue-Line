import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/ecommerce";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { labelAr: string; labelEn: string; bg: string; text: string; border: string }
> = {
  pending: {
    labelAr: "قيد المراجعة",
    labelEn: "Pending",
    bg: "bg-amber-500/10",
    text: "text-amber-700",
    border: "border-amber-500/20",
  },
  confirmed: {
    labelAr: "مؤكد",
    labelEn: "Confirmed",
    bg: "bg-blue-500/10",
    text: "text-blue-700",
    border: "border-blue-500/20",
  },
  processing: {
    labelAr: "جاري التجهيز",
    labelEn: "Processing",
    bg: "bg-indigo-500/10",
    text: "text-indigo-700",
    border: "border-indigo-500/20",
  },
  shipped: {
    labelAr: "تم الشحن",
    labelEn: "Shipped",
    bg: "bg-cyan-500/10",
    text: "text-cyan-700",
    border: "border-cyan-500/20",
  },
  delivered: {
    labelAr: "تم التوصيل",
    labelEn: "Delivered",
    bg: "bg-emerald-500/10",
    text: "text-emerald-700",
    border: "border-emerald-500/20",
  },
  cancelled: {
    labelAr: "ملغي",
    labelEn: "Cancelled",
    bg: "bg-rose-500/10",
    text: "text-rose-700",
    border: "border-rose-500/20",
  },
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      <span>{config.labelAr}</span>
    </span>
  );
}
