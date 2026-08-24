import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  TrendingUp,
  Package,
  PlusCircle,
  Layers,
  ArrowUpRight,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { getAdminMetrics, getAdminOrders } from "@/actions/admin";
import { RecentOrdersTable } from "@/components/admin/recent-orders-table";
import { formatPrice } from "@/lib/formatters";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [metrics, orders] = await Promise.all([
    getAdminMetrics(),
    getAdminOrders(),
  ]);

  // Compute order pipeline distribution
  const totalOrders = orders.length || 1;
  const pendingCount = orders.filter((o) => o.status === "pending" || o.status === "confirmed").length;
  const processingCount = orders.filter((o) => o.status === "processing").length;
  const shippedCount = orders.filter((o) => o.status === "shipped").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;

  const avgOrderValue = orders.length > 0 ? Math.round(metrics.totalRevenue / orders.length) : 0;

  return (
    <div className="space-y-6 text-start font-alexandria">
      {/* ── 1. Page Title & Action Bar (Clean, No AI-Slop Hero Banner) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            لوحة أداء ومؤشرات المتجر
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إليك ملخص مؤشرات المبيعات، ومسار تنفيذ وتجهيز الطلبيات اليومية.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/products/new"
            className="px-4 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <PlusCircle size={15} />
            <span>إضافة منتج</span>
          </Link>

          <Link
            href="/admin/orders"
            className="px-4 h-10 rounded-xl bg-[#0B192C] hover:bg-[#1E6091] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <ShoppingBag size={14} />
            <span>الطلبات</span>
          </Link>

          <Link
            href="/admin/categories"
            className="px-4 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-2xs transition-colors"
          >
            <Layers size={14} />
            <span>الفئات</span>
          </Link>
        </div>
      </div>

      {/* ── 2. Low Stock Alert Strip ── */}
      {metrics.lowStockCount > 0 && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-50 border border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-rose-900 font-bold">
            <AlertTriangle size={16} className="text-rose-600 shrink-0" />
            <span>تنبيه: {metrics.lowStockCount} تشطيبات ومنتجات قاربت على نفاد المخزون.</span>
          </div>

          <Link
            href="/admin/products"
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs self-start sm:self-auto transition-colors shadow-2xs"
          >
            فحص المخزون
          </Link>
        </div>
      )}

      {/* ── 3. 4 Clean KPI Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              إجمالي الإيرادات
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {formatPrice(metrics.totalRevenue)}
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
            <span className="text-slate-400 font-medium">كافة المبيعات</span>
            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
              <ArrowUpRight size={13} />
              <span>+{metrics.revenueTrend}%</span>
            </span>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              إجمالي الطلبات
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {orders.length} <span className="text-xs font-bold text-slate-400">طلب</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
            <span className="text-slate-400 font-medium">معدل التنفيذ</span>
            <span className="text-slate-700 font-bold">
              {Math.round((deliveredCount / totalOrders) * 100)}%
            </span>
          </div>
        </div>

        {/* Card 3: Avg Order Value */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              متوسط قيمة الطلب
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {formatPrice(avgOrderValue)}
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
            <span className="text-slate-400 font-medium">لكل عملية شراء</span>
            <span className="text-amber-600 font-bold">نشط</span>
          </div>
        </div>

        {/* Card 4: Inventory Health */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              الكتالوج والمخزون
            </span>
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Package size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {metrics.activeProductsCount} <span className="text-xs font-bold text-slate-400">موديل</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
            <span className="text-rose-600 font-bold">⚠️ {metrics.lowStockCount} نواقص</span>
            <span className="text-slate-500 font-medium">6 أقسام</span>
          </div>
        </div>
      </div>

      {/* ── 4. 2-Column Operational Grid (Zad Land Pattern) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Sales Velocity & Activity */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                وتيرة المبيعات والنشاط اليومي
              </h3>
              <p className="text-[11px] text-slate-400">
                حجم المبيعات والطلبات الواردة خلال الفترة الأخيرة
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
              آخر ١٤ يوماً
            </span>
          </div>

          {/* Clean Activity Feed Rows */}
          <div className="space-y-3">
            {orders.slice(0, 4).map((o, idx) => (
              <div
                key={o.id}
                className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 flex items-center justify-between text-xs hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-mono font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block font-mono">
                      {o.order_number}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {o.guest_name || "عميل بلو لاين"}
                    </span>
                  </div>
                </div>

                <div className="text-end">
                  <span className="font-extrabold text-slate-900 block">
                    {formatPrice(o.total)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {o.items?.length || 1} منتجات
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 cols): Order Fulfillment Pipeline */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                مسار تنفيذ وتجهيز الطلبات
              </h3>
              <p className="text-[11px] text-slate-400">
                توزيع حالات الطلبات الحالية
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              عرض الكل
            </Link>
          </div>

          <div className="space-y-4 text-xs">
            {/* Pending */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-bold text-amber-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>قيد المراجعة والتأكيد (Pending)</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{pendingCount}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${Math.max(5, (pendingCount / totalOrders) * 100)}%` }}
                />
              </div>
            </div>

            {/* Processing */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-bold text-blue-700">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>جاري التجهيز والتغليف (Processing)</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{processingCount}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${Math.max(5, (processingCount / totalOrders) * 100)}%` }}
                />
              </div>
            </div>

            {/* Shipped */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-bold text-indigo-700">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>تم الشحن مع المندوب (Shipped)</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{shippedCount}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${Math.max(5, (shippedCount / totalOrders) * 100)}%` }}
                />
              </div>
            </div>

            {/* Delivered */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-bold text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>تم التوصيل بنجاح (Delivered)</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{deliveredCount}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${Math.max(5, (deliveredCount / totalOrders) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Recent Orders Table (with Instant Modal) ── */}
      <RecentOrdersTable orders={orders} />
    </div>
  );
}
