"use client";

import { useState } from "react";
import {
  Users,
  Search,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  TrendingUp,
  Crown,
  Copy,
  Check,
  Calendar,
  ExternalLink,
} from "lucide-react";
import type { CustomerListItem } from "@/types/ecommerce";
import { formatPrice } from "@/lib/formatters";
import { Input } from "@/components/ui/input";

interface CustomersDataTableProps {
  initialCustomers: CustomerListItem[];
}

export function CustomersDataTable({ initialCustomers }: CustomersDataTableProps) {
  const [customers] = useState<CustomerListItem[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "vip" | "repeat" | "cairo">("all");
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // KPIs
  const totalCustomers = customers.length;
  const vipCustomers = customers.filter((c) => c.lifetime_spent >= 25000).length;
  const repeatCustomers = customers.filter((c) => c.total_orders > 1).length;
  const totalLtv = customers.reduce((sum, c) => sum + c.lifetime_spent, 0);
  const avgLtv = totalCustomers > 0 ? Math.round(totalLtv / totalCustomers) : 0;

  // Filter logic
  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.full_name.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q)) ||
      c.email.toLowerCase().includes(q) ||
      (c.governorate && c.governorate.includes(q));

    if (!matchesSearch) return false;

    if (filterTab === "vip") return c.lifetime_spent >= 25000;
    if (filterTab === "repeat") return c.total_orders > 1;
    if (filterTab === "cairo") {
      return (
        c.governorate?.includes("القاهرة") ||
        c.governorate?.includes("الجيزة") ||
        c.governorate?.includes("القليوبية")
      );
    }
    return true;
  });

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const getWhatsAppUrl = (customer: CustomerListItem) => {
    if (!customer.phone) return "#";
    // Format Egyptian mobile: strip 0 and add 20
    let cleanPhone = customer.phone.replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "2" + cleanPhone;
    } else if (!cleanPhone.startsWith("20")) {
      cleanPhone = "20" + cleanPhone;
    }

    const greeting = encodeURIComponent(
      `مرحباً أستاذ ${customer.full_name}، معك فريق خدمة عملاء متجر بلو لاين للأدوات الصحية وخلاطات المياه. نسعد دائماً بخدمتكم!`
    );

    return `https://wa.me/${cleanPhone}?text=${greeting}`;
  };

  return (
    <div className="space-y-6 pb-20 text-start font-alexandria">
      {/* ── 1. Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            دليل العملاء وعلاقات المشترين (CRM)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            متابعة سجلات الشراء، القيمة الدائمة للعملاء (LTV)، وإرسال رسائل الواتساب بنقرة واحدة
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200/60 text-[#1E6091] text-xs font-bold flex items-center gap-2">
            <Users size={15} />
            <span>{totalCustomers} عميل مسجل</span>
          </div>
        </div>
      </div>

      {/* ── 2. KPI Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Customers */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E6091] flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">إجمالي العملاء</span>
            <span className="text-lg font-extrabold text-slate-900">{totalCustomers}</span>
          </div>
        </div>

        {/* VIP Buyers */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Crown size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">كبار العملاء (VIP)</span>
            <span className="text-lg font-extrabold text-slate-900">{vipCustomers} عميل</span>
          </div>
        </div>

        {/* Repeat Buyers */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShoppingBag size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">العملاء المتكررون</span>
            <span className="text-lg font-extrabold text-slate-900">{repeatCustomers} عميل</span>
          </div>
        </div>

        {/* Average LTV */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">متوسط قيمة العميل (Avg LTV)</span>
            <span className="text-lg font-extrabold text-slate-900 font-mono">
              {formatPrice(avgLtv)}
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. Search & Filter Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم، الهاتف، البريد، أو المحافظة..."
            className="ps-9 h-9 text-xs rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setFilterTab("all")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              filterTab === "all" ? "bg-[#0B192C] text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            الكل ({customers.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("vip")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterTab === "vip" ? "bg-[#0B192C] text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <Crown size={12} className="text-amber-400" />
            <span>VIP كبار العملاء ({vipCustomers})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("repeat")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              filterTab === "repeat" ? "bg-[#0B192C] text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            متكرر الشراء ({repeatCustomers})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("cairo")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              filterTab === "cairo" ? "bg-[#0B192C] text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            القاهرة الكبرى
          </button>
        </div>
      </div>

      {/* ── 4. Customers Data Table ── */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200/80">
              <tr>
                <th className="py-3.5 px-4 text-start">العميل</th>
                <th className="py-3.5 px-4 text-start">بيانات الاتصال</th>
                <th className="py-3.5 px-4 text-start">المحافظة / المدينة</th>
                <th className="py-3.5 px-4 text-center">الطلبات</th>
                <th className="py-3.5 px-4 text-start">إجمالي الإنفاق (LTV)</th>
                <th className="py-3.5 px-4 text-start">آخر طلب</th>
                <th className="py-3.5 px-4 text-end">التواصل المباشر</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    لا يوجد عملاء يطابقون معايير البحث
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const isVip = cust.lifetime_spent >= 25000;
                  const initialLetter = cust.full_name.charAt(0) || "ع";

                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                              isVip
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {initialLetter}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-900 block">
                                {cust.full_name}
                              </span>
                              {isVip && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-extrabold">
                                  <Crown size={10} />
                                  <span>VIP</span>
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ID: {cust.id.slice(0, 8)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Phone & Email */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {cust.phone ? (
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-slate-700 font-bold" dir="ltr">
                                {cust.phone}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyPhone(cust.phone!)}
                                className="w-5 h-5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                                title="نسخ الهاتف"
                              >
                                {copiedPhone === cust.phone ? (
                                  <Check size={11} className="text-emerald-600" />
                                ) : (
                                  <Copy size={11} />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[10px]">بدون هاتف</span>
                          )}

                          {cust.email && (
                            <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[140px]">
                              {cust.email}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-slate-700">
                          <MapPin size={12} className="text-slate-400 shrink-0" />
                          <span>{cust.governorate}</span>
                          {cust.city && <span className="text-slate-400">({cust.city})</span>}
                        </div>
                      </td>

                      {/* Order Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-lg font-bold text-xs ${
                            cust.total_orders > 1
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {cust.total_orders} {cust.total_orders === 1 ? "طلب" : "طلبات"}
                        </span>
                      </td>

                      {/* Lifetime Spent (LTV) */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-mono font-extrabold ${
                            isVip ? "text-emerald-600 text-sm" : "text-slate-900"
                          }`}
                        >
                          {formatPrice(cust.lifetime_spent)}
                        </span>
                      </td>

                      {/* Last Order Date */}
                      <td className="py-3.5 px-4 text-slate-500">
                        {cust.last_order_date ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-slate-400" />
                            <span>
                              {new Date(cust.last_order_date).toLocaleDateString("ar-EG")}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* 1-Click WhatsApp & Phone Actions */}
                      <td className="py-3.5 px-4 text-end">
                        <div className="flex items-center justify-end gap-1.5">
                          {cust.phone && (
                            <>
                              <a
                                href={getWhatsAppUrl(cust)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 h-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                                title="محادثة واتساب سريعة"
                              >
                                <MessageCircle size={13} />
                                <span>واتساب</span>
                              </a>

                              <a
                                href={`tel:${cust.phone}`}
                                className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                                title="اتصال هاتفي"
                              >
                                <Phone size={13} />
                              </a>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
