"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  Clock,
  ShoppingBag,
  Eye,
  Phone,
  FileSpreadsheet,
  FileText,
  Printer,
} from "lucide-react";
import type { Order, OrderStatus } from "@/types/ecommerce";
import { formatPrice, formatDate } from "@/lib/formatters";
import { updateOrderStatus } from "@/actions/admin";
import { OrderStatusBadge } from "./order-status-badge";
import { OrderDetailsModal } from "./order-details-modal";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface OrdersDataTableProps {
  orders: Order[];
}

const TABS: { id: OrderStatus | "all"; labelAr: string }[] = [
  { id: "all", labelAr: "كافة الطلبات" },
  { id: "pending", labelAr: "قيد المراجعة" },
  { id: "confirmed", labelAr: "مؤكد" },
  { id: "processing", labelAr: "جاري التجهيز" },
  { id: "shipped", labelAr: "تم الشحن" },
  { id: "delivered", labelAr: "تم التسليم" },
  { id: "cancelled", labelAr: "ملغي" },
];

export function OrdersDataTable({ orders: initialOrders }: OrdersDataTableProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "all" || order.status === activeTab;
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.guest_name && order.guest_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.guest_phone && order.guest_phone.includes(searchQuery)) ||
      (order.shipping_address && order.shipping_address.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

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

  // Export to Excel/CSV with UTF-8 BOM for flawless Arabic character encoding in Microsoft Excel
  const handleExportCsv = () => {
    const headers = [
      "رقم الطلب",
      "اسم العميل",
      "رقم الهاتف",
      "البريد الإلكتروني",
      "عنوان الشحن والتوصيل",
      "حالة الطلب",
      "طريقة الدفع",
      "المجموع الفرعي",
      "كوبون الخصم",
      "قيمة الخصم",
      "مصاريف الشحن",
      "الإجمالي النهائي (ج.م)",
      "تاريخ الطلب",
    ];

    const rows = filteredOrders.map((o) => {
      const name = o.guest_name || o.customer?.full_name || "عميل بلو لاين";
      const phone = o.guest_phone || o.customer?.phone || "";
      const email = o.guest_email || o.customer?.email || "";
      const date = new Date(o.created_at).toLocaleDateString("ar-EG");

      return [
        `"${o.order_number}"`,
        `"${name.replace(/"/g, '""')}"`,
        `"${phone}"`,
        `"${email}"`,
        `"${o.shipping_address.replace(/"/g, '""')}"`,
        `"${o.status}"`,
        `"${o.payment_method === "cod" ? "الدفع عند الاستلام" : "تحويل إلكتروني"}"`,
        o.subtotal,
        `"${o.coupon_code || "-"}"`,
        o.discount_amount || 0,
        o.shipping_cost,
        o.total,
        `"${date}"`,
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `BlueLine_Orders_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-900">
            إدارة ومتابعة الطلبات
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            متابعة دورة حياة الطلبات، طباعة الفواتير وبوالص الشحن، وتصدير التقارير
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer shrink-0"
        >
          <FileSpreadsheet size={15} className="text-emerald-600" />
          <span>تصدير الطلبات (Excel / CSV)</span>
        </button>
      </div>

      {/* Tabs & Search Toolbar */}
      <div className="space-y-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {TABS.map((tab) => {
            const count =
              tab.id === "all"
                ? orders.length
                : orders.filter((o) => o.status === tab.id).length;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border cursor-pointer",
                  activeTab === tab.id
                    ? "bg-brand-900 text-white border-brand-900 shadow-xs"
                    : "bg-white text-text-secondary border-border-default hover:bg-surface-50"
                )}
              >
                <span>{tab.labelAr}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-surface-100 text-text-muted"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="p-4 rounded-2xl bg-white border border-border-default flex items-center justify-between shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search
              size={16}
              className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <Input
              placeholder="بحث برقم الطلب أو اسم العميل أو الهاتف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-9 h-10 text-xs bg-surface-50 border-border-default rounded-xl"
            />
          </div>

          <span className="text-xs text-text-muted font-medium">
            عرض {filteredOrders.length} طلب
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-white border border-border-default overflow-hidden shadow-xs">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-text-muted space-y-3">
            <ShoppingBag size={36} className="mx-auto text-text-muted/40" />
            <p className="text-sm font-semibold">لا توجد طلبات في هذا القسم</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="bg-surface-50 border-b border-border-default text-text-muted font-bold">
                  <th className="py-3.5 px-6 text-start">رقم الطلب</th>
                  <th className="py-3.5 px-6 text-start">العميل والهاتف</th>
                  <th className="py-3.5 px-6 text-start">التاريخ</th>
                  <th className="py-3.5 px-6 text-start">عدد القطع</th>
                  <th className="py-3.5 px-6 text-start">الإجمالي</th>
                  <th className="py-3.5 px-6 text-start">الحالة</th>
                  <th className="py-3.5 px-6 text-end">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {filteredOrders.map((order) => {
                  const itemsCount =
                    order.items?.reduce((sum, item) => sum + item.quantity, 0) ||
                    1;
                  const customerName =
                    order.guest_name || order.customer?.full_name || "عميل بلو لاين";
                  const phoneNum =
                    order.guest_phone || order.customer?.phone || "";

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
                      <td className="py-4 px-6 text-text-primary">
                        <div className="font-semibold">{customerName}</div>
                        {phoneNum && (
                          <div dir="ltr" className="text-[11px] font-mono text-text-muted">
                            {phoneNum}
                          </div>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-text-secondary whitespace-nowrap">
                        {formatDate(order.created_at)}
                      </td>

                      {/* Items Count */}
                      <td className="py-4 px-6 font-semibold text-brand-900 whitespace-nowrap">
                        {itemsCount} قطع
                      </td>

                      {/* Total */}
                      <td className="py-4 px-6 font-bold text-brand-900 whitespace-nowrap">
                        {formatPrice(order.total)}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <OrderStatusBadge status={order.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-end whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/orders/${order.id}/invoice`}
                            className="p-2 rounded-xl bg-surface-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                            title="طباعة الفاتورة وبوليصة الشحن"
                          >
                            <Printer size={14} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="px-3 py-1.5 rounded-xl bg-surface-100 hover:bg-[#1E6091] hover:text-white text-brand-900 font-bold text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Eye size={13} />
                            <span>معاينة</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
