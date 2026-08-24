"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, CheckCircle2 } from "lucide-react";
import type { OrderStatus } from "@/types/ecommerce";
import { updateOrderStatus } from "@/actions/admin";

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function OrderStatusUpdater({
  orderId,
  currentStatus,
}: OrderStatusUpdaterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (newStatus: OrderStatus) => {
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-text-muted">
        تحديث الحالة:
      </span>
      <select
        value={currentStatus}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
        className="h-10 px-3 rounded-xl border border-border-default bg-white text-xs font-bold text-brand-900 focus:outline-none focus:border-accent-600 disabled:opacity-50 cursor-pointer shadow-xs"
      >
        <option value="pending">قيد المراجعة (Pending)</option>
        <option value="confirmed">مؤكد (Confirmed)</option>
        <option value="processing">جاري التجهيز (Processing)</option>
        <option value="shipped">تم الشحن (Shipped)</option>
        <option value="delivered">تم التسليم (Delivered)</option>
        <option value="cancelled">ملغي (Cancelled)</option>
      </select>
    </div>
  );
}
