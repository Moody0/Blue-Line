"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Eye } from "lucide-react";
import type { Order, OrderStatus } from "@/types/ecommerce";
import { formatPrice, formatDate } from "@/lib/formatters";
import { updateOrderStatus } from "@/actions/admin";
import { OrderStatusBadge } from "./order-status-badge";
import { OrderDetailsModal } from "./order-details-modal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecentOrdersTableProps {
  orders: Order[];
}

export function RecentOrdersTable({ orders: initialOrders }: RecentOrdersTableProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    });
  };

  return (
    <div className="rounded-3xl bg-white border border-border-default shadow-xs overflow-hidden">
      {/* Table Header */}
      <div className="p-6 border-b border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-brand-900">
            أحدث الطلبات الواردة
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            متابعة الطلبات وتحديث حالات الشحن والتنفيذ الفوري
          </p>
        </div>

        <Link
          href="/admin/orders"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start"
          )}
        >
          <span>عرض كافة الطلبات</span>
          <ArrowLeft size={13} />
        </Link>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="p-12 text-center text-text-muted space-y-2">
          <Clock size={32} className="mx-auto text-text-muted/40" />
          <p className="text-sm font-semibold">لا توجد طلبات مسجلة حالياً</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="bg-surface-50 border-b border-border-default text-text-muted font-bold">
                <th className="py-3.5 px-6 text-start">رقم الطلب</th>
                <th className="py-3.5 px-6 text-start">العميل</th>
                <th className="py-3.5 px-6 text-start">التاريخ</th>
                <th className="py-3.5 px-6 text-start">الإجمالي</th>
                <th className="py-3.5 px-6 text-start">الحالة</th>
                <th className="py-3.5 px-6 text-end">الإجراء السريع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {orders.slice(0, 6).map((order) => {
                const customerName =
                  order.guest_name || order.customer?.full_name || "عميل بلو لاين";

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-surface-50/70 transition-colors"
                  >
                    {/* Order Number */}
                    <td className="py-4 px-6 font-mono font-bold text-brand-900">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="hover:text-[#1E6091] hover:underline flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{order.order_number}</span>
                      </button>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-6 text-text-primary font-semibold">
                      {customerName}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-text-secondary whitespace-nowrap">
                      {formatDate(order.created_at)}
                    </td>

                    {/* Total */}
                    <td className="py-4 px-6 font-bold text-brand-900 whitespace-nowrap">
                      {formatPrice(order.total)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <OrderStatusBadge status={order.status} />
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-end whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 rounded-xl bg-surface-100 hover:bg-[#1E6091] hover:text-white text-brand-900 font-bold text-[11px] transition-colors flex items-center gap-1.5 ms-auto cursor-pointer"
                      >
                        <Eye size={13} />
                        <span>معاينة وتحديث</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Interactive Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        onStatusChange={handleStatusChange}
        isUpdating={isPending}
      />
    </div>
  );
}
