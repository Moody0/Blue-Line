import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  Clock,
  PackageCheck,
  Truck,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/actions/auth";
import { formatPrice, formatDate } from "@/lib/formatters";
import { CONTACT } from "@/lib/constants";
import type { Order, Customer, OrderStatus } from "@/types/ecommerce";

function getStatusBadge(status: OrderStatus) {
  const map: Record<
    OrderStatus,
    { label: string; bg: string; text: string }
  > = {
    pending: {
      label: "قيد المراجعة",
      bg: "bg-amber-50 border-amber-200/80",
      text: "text-amber-800",
    },
    confirmed: {
      label: "تم التأكيد",
      bg: "bg-blue-50 border-blue-200/80",
      text: "text-blue-800",
    },
    processing: {
      label: "جاري التجهيز",
      bg: "bg-sky-50 border-sky-200/80",
      text: "text-sky-800",
    },
    shipped: {
      label: "تم الشحن",
      bg: "bg-purple-50 border-purple-200/80",
      text: "text-purple-800",
    },
    delivered: {
      label: "تم التوصيل",
      bg: "bg-emerald-50 border-emerald-200/80",
      text: "text-emerald-800",
    },
    cancelled: {
      label: "ملغي",
      bg: "bg-rose-50 border-rose-200/80",
      text: "text-rose-800",
    },
  };

  const current = map[status] || map.pending;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${current.bg} ${current.text}`}
    >
      {current.label}
    </span>
  );
}

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/account");
  }

  // Fetch Customer Profile
  const { data: customerData } = await supabase
    .from("customers")
    .select("*")
    .eq("id", user.id)
    .single();

  const customer: Customer = customerData || {
    id: user.id,
    email: user.email || "",
    full_name: user.user_metadata?.full_name || "عميل بلو لاين",
    phone: user.user_metadata?.phone || null,
    address_line_1: null,
    address_line_2: null,
    city: null,
    governorate: null,
    postal_code: null,
    created_at: user.created_at,
  };

  // Fetch Customer Orders with item details
  const { data: ordersData } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  const orders: Order[] = (ordersData as Order[]) || [];

  return (
    <div className="min-h-[70vh] py-8 sm:py-14 font-alexandria" dir="rtl">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-8 text-start">
        {/* ── Breadcrumb Navigation ── */}
        <nav aria-label="مسار التصفح" className="flex items-center gap-2 text-xs text-text-muted">
          <Link href="/" className="hover:text-brand-900 transition-colors">
            الرئيسية
          </Link>
          <span>/</span>
          <span className="text-brand-900 font-bold">حسابي</span>
        </nav>

        {/* ── Clean Account Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-default">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-900 tracking-tight">
              مرحباً، {customer.full_name}
            </h1>
            <p className="text-xs text-text-muted font-mono">{customer.email}</p>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-text-secondary hover:text-destructive hover:bg-destructive/5 rounded-xl border border-border-default transition-colors cursor-pointer"
            >
              <LogOut size={13} />
              <span>تسجيل الخروج</span>
            </button>
          </form>
        </div>

        {/* ── 2-Column Grid: Orders History (7 cols) & Profile Info (5 cols) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ── Left Column: Orders History (7 cols) ── */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-base font-bold text-brand-900">
                سجل الطلبات ({orders.length})
              </h2>
            </div>

            {orders.length === 0 ? (
              <div className="border border-border-default rounded-2xl p-8 sm:p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-surface-100 flex items-center justify-center mx-auto text-text-muted">
                  <ShoppingBag size={22} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-brand-900">
                    لا توجد طلبات سابقة حتى الآن
                  </h3>
                  <p className="text-xs text-text-muted">
                    تصفح تشكيلات ومستلزمات السباكة وابدأ طلبك الأول.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-900 hover:bg-[#1E6091] text-white text-xs font-bold transition-colors"
                  >
                    <span>تصفح المنتجات</span>
                    <ArrowLeft size={14} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const whatsappMessage = encodeURIComponent(
                    `مرحباً بلو لاين، أستفسر عن حالة طلبي رقم: ${order.order_number}`
                  );
                  const whatsappUrl = `${CONTACT.whatsappUrl}?text=${whatsappMessage}`;

                  return (
                    <div
                      key={order.id}
                      className="border border-border-default rounded-2xl p-5 space-y-4 bg-white"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border-default/60">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-brand-900">طلب رقم:</span>
                            <span className="font-mono font-bold text-[#1E6091]">
                              {order.order_number}
                            </span>
                          </div>
                          <span className="text-[11px] text-text-muted block">
                            {formatDate(order.created_at)}
                          </span>
                        </div>

                        {getStatusBadge(order.status as OrderStatus)}
                      </div>

                      {/* Items */}
                      {order.items && order.items.length > 0 && (
                        <div className="space-y-2 text-xs">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between py-0.5"
                            >
                              <div className="text-start">
                                <span className="font-medium text-brand-900">
                                  {item.product_title}
                                </span>
                                {item.variant_name && (
                                  <span className="text-text-muted text-[11px] ms-1.5">
                                    ({item.variant_name})
                                  </span>
                                )}
                                <span className="text-text-muted font-mono font-semibold ms-1.5">
                                  × {item.quantity}
                                </span>
                              </div>
                              <span className="font-semibold font-mono text-brand-900">
                                {formatPrice(item.unit_price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Order Total & Contact */}
                      <div className="pt-3 border-t border-border-default/60 flex items-center justify-between text-xs">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-text-muted">الإجمالي:</span>
                          <span className="text-sm font-bold text-brand-900 font-mono">
                            {formatPrice(order.total)}
                          </span>
                        </div>

                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-semibold transition-colors"
                        >
                          <MessageCircle size={13} />
                          <span>استفسار عبر واتساب</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Right Column: Account & Shipping Info (5 cols) ── */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-border-default rounded-2xl p-6 space-y-4 bg-white">
              <h2 className="text-base font-bold text-brand-900">
                بيانات الحساب والتوصيل
              </h2>

              <div className="space-y-3.5 text-xs text-start">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-semibold text-text-muted block">
                    الاسم
                  </span>
                  <span className="font-medium text-brand-900">
                    {customer.full_name}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[11px] font-semibold text-text-muted block">
                    البريد الإلكتروني
                  </span>
                  <span className="font-mono text-brand-900 break-all">
                    {customer.email}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[11px] font-semibold text-text-muted block">
                    رقم الهاتف
                  </span>
                  <span className="font-mono text-brand-900 inline-block" dir="ltr">
                    {customer.phone || "لم يتم تسجيل رقم بعد"}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[11px] font-semibold text-text-muted block">
                    عنوان التوصيل الافتراضي
                  </span>
                  <span className="text-text-secondary leading-relaxed block">
                    {customer.address_line_1
                      ? `${customer.governorate ? customer.governorate + " - " : ""}${customer.city ? customer.city + " - " : ""}${customer.address_line_1}`
                      : "يتم تحديد العنوان وحفظه تلقائياً عند أول طلب شراء."}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Support Box */}
            <div className="border border-border-default rounded-2xl p-6 space-y-3 bg-surface-50">
              <h3 className="text-xs font-bold text-brand-900">
                خدمة العملاء والدعم
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                هل تحتاج لمساعدة بخصوص مقاسات ومواصفات المنتجات أو الاستفسار عن تفاصيل شحنتك؟
              </p>
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                <MessageCircle size={15} />
                <span className="inline-flex items-center gap-1">
                  <span>تواصل معنا عبر واتساب</span>
                  <span dir="ltr" className="font-mono">({CONTACT.phoneDisplay})</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
