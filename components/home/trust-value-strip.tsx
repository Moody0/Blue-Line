"use client";

import { ShieldCheck, Truck, Banknote, RotateCcw } from "lucide-react";

const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    title: "ضمان معتمد ٥ سنوات",
    description: "منتجات أصلية ١٠٠٪ معتمدة ضد عيوب الصناعة",
    accentColor: "text-brand-900",
    bgColor: "bg-blue-50/70",
  },
  {
    icon: Truck,
    title: "شحن سريع لكافة المحافظات",
    description: "توصيل آمن وتغليف هندسي لكافة مدن الجمهورية",
    accentColor: "text-[#1E6091]",
    bgColor: "bg-sky-50/70",
  },
  {
    icon: Banknote,
    title: "الدفع عند الاستلام",
    description: "معاينة وفحص الشحنة بالكامل قبل السداد",
    accentColor: "text-emerald-700",
    bgColor: "bg-emerald-50/70",
  },
  {
    icon: RotateCcw,
    title: "استبدال واسترجاع ١٤ يوماً",
    description: "إرجاع سهل وسريع لضمان راحة بالك التامة",
    accentColor: "text-slate-800",
    bgColor: "bg-slate-50",
  },
];

export function TrustValueStrip() {
  return (
    <section className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20 font-alexandria" dir="rtl">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-border-default shadow-md shadow-black/5 p-4 sm:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-border-default/60">
          {TRUST_PILLARS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:px-3 first:pt-0 text-start"
              >
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${item.bgColor} flex items-center justify-center shrink-0 shadow-2xs`}>
                  <Icon size={22} className={item.accentColor} strokeWidth={2} />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-brand-900 leading-tight truncate">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-text-muted leading-snug line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
