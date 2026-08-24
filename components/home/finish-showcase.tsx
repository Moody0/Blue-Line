"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, ShieldCheck, Layers, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinishItem {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  subtitle: string;
  description: string;
  gradient: string;
  bgHex: string;
  features: string[];
}

const ARCHITECTURAL_FINISHES: FinishItem[] = [
  {
    id: "chrome",
    code: "CHR",
    nameAr: "كروم لامع ستارشاين",
    nameEn: "StarLight Chrome",
    subtitle: "البريق الكلاسيكي اللامع",
    description:
      "طلاء كروم متطور عاكس للضوء مع طبقة حماية StarLight تمنع التصاق التكلسات والبقع وتضمن لمعاناً يدوم لسنوات طويلة.",
    gradient: "from-[#F8FAFC] via-[#CBD5E1] to-[#94A3B8]",
    bgHex: "#CBD5E1",
    features: ["مقاومة عالية للتكلسات", "سطح عاكس كالمرآة", "سهل التنظيف والمسح"],
  },
  {
    id: "matte-black",
    code: "MBK",
    nameAr: "أسود مطفي مخملي",
    nameEn: "Velvet Matte Black",
    subtitle: "الفخامة المعمارية الجريئة",
    description:
      "لمسة معمارية عصرية بطلاء مخملي غير لامع. يقاوم بصمات الأصابع ويمنح الحمام طابعاً درامياً راقياً يتناغم مع الرخام والإضاءة الحديثة.",
    gradient: "from-[#3F3F46] via-[#18181B] to-[#09090B]",
    bgHex: "#18181B",
    features: ["مقاوم لبصمات الأصابع", "ملمس ناعم مخملي", "مظهر مودرن فندقي"],
  },
  {
    id: "hard-graphite",
    code: "BHG",
    nameAr: "جرافيت مصقول PVD",
    nameEn: "Brushed Hard Graphite",
    subtitle: "الرمادي الدخاني العصري",
    description:
      "مزيج فريد من الرمادي الفحمي وخطوط الصقل الدقيقة المصنعة بتقنية PVD. يعطي صلابة تفوق الكروم العادي بـ 3 أضعاف ومقاومة للخدش 10 أضعاف.",
    gradient: "from-[#71717A] via-[#3F3F46] to-[#27272A]",
    bgHex: "#3F3F46",
    features: ["صلابة أعلى بـ 3 أضعاف", "تقنية PVD فائقة التحمل", "مظهر صناعي معماري"],
  },
  {
    id: "warm-sunset",
    code: "WST",
    nameAr: "ذهب برونزي دافئ PVD",
    nameEn: "Warm Sunset Gold",
    subtitle: "البريق الفندقي الملكي",
    description:
      "بريق ذهبي دافئ ومترف بلمسة برونزية راقية. مثالي للمساحات الفاخرة التي تبحث عن أجواء حميمية أنيقة دون مبالغة في اللمعان.",
    gradient: "from-[#FDE68A] via-[#D97706] to-[#78350F]",
    bgHex: "#D97706",
    features: ["ثبات اللون مدى الحياة", "مقاوم للصدأ وتغير النقاء", "فخامة فندقية راقية"],
  },
  {
    id: "brushed-nickel",
    code: "BNK",
    nameAr: "نيكل مصقول PVD",
    nameEn: "Brushed Nickel",
    subtitle: "الفضي الهادئ الدافئ",
    description:
      "درجة فضية هادئة تميل إلى دفء الشمبانيا مع خطوط صقل يدوية دقيقة. يتناغم بامتياز مع الأخشاب الطبيعية والأحجار المعمارية.",
    gradient: "from-[#E2E8F0] via-[#A1A1AA] to-[#52525B]",
    bgHex: "#A1A1AA",
    features: ["تناغم مع المواد الطبيعية", "خطوط صقل ميكروية", "مقاوم للخدوش اليومية"],
  },
];

export function FinishShowcase() {
  const [activeFinishId, setActiveFinishId] = useState<string>("chrome");

  const selectedFinish =
    ARCHITECTURAL_FINISHES.find((f) => f.id === activeFinishId) ||
    ARCHITECTURAL_FINISHES[0];

  return (
    <section className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-alexandria" dir="rtl">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-border-default/60 text-center sm:text-start">
        <div className="space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="p-1 rounded-md bg-[#1E6091]/10 text-[#1E6091]">
              <Layers size={16} />
            </span>
            <span className="text-xs font-bold text-[#1E6091] tracking-wider uppercase">
              تقنية الطلاء الفيزيائي • PVD Finishes
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-900 tracking-tight">
            ألوان وتشطيبات معمارية متناسقة
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-text-muted">
            طلاء ألماني فائق الصلابة ومقاوم للخدش وتغير الألوان لتناغم حمامك بالكامل
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#1E6091] hover:text-brand-900 bg-surface-50 hover:bg-surface-100 border border-border-default px-4 py-2 rounded-xl transition-all shadow-2xs group cursor-pointer"
        >
          <span>تصفح حسب التشطيب</span>
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-1 text-[#1E6091]"
          />
        </Link>
      </div>

      {/* Main Architectural Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side (Featured Detail Card - 7 cols on lg) */}
        <div className="lg:col-span-7 bg-surface-50 rounded-2xl border border-border-default/80 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs">
          <div className="space-y-5">
            {/* Top Badge & Finish Code */}
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border-default shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedFinish.bgHex }} />
                <span className="text-xs font-extrabold text-brand-900">{selectedFinish.nameAr}</span>
              </div>
              <span className="text-xs font-mono font-bold text-text-muted px-2.5 py-0.5 rounded-md bg-white border border-border-default">
                CODE: {selectedFinish.code}
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-2 text-start">
              <div className="flex items-baseline gap-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-brand-900">
                  {selectedFinish.nameAr}
                </h3>
                <span className="text-xs font-bold text-text-muted">
                  ({selectedFinish.nameEn})
                </span>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-normal">
                {selectedFinish.description}
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              {selectedFinish.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-border-default/60 text-xs font-bold text-brand-900 shadow-2xs text-start"
                >
                  <ShieldCheck size={15} className="text-[#1E6091] shrink-0" />
                  <span className="text-[11px] leading-tight">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-3 border-t border-border-default/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
              <Sparkles size={14} className="text-amber-600" />
              <span>متوفر في كافة أطقم ومجموعات الدش والخلاطات</span>
            </div>

            <Link
              href={`/products?q=${encodeURIComponent(selectedFinish.nameAr.split(" ")[0])}`}
              className="inline-flex items-center justify-center gap-2 bg-[#1E6091] hover:bg-brand-900 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow-2xs cursor-pointer"
            >
              <span>استكشف منتجات {selectedFinish.nameAr.split(" ")[0]}</span>
              <ArrowLeft size={14} />
            </Link>
          </div>
        </div>

        {/* Right Side (Interactive 5 Finish Swatches Selector - 5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          {ARCHITECTURAL_FINISHES.map((finish) => {
            const isSelected = finish.id === activeFinishId;

            return (
              <button
                key={finish.id}
                type="button"
                onClick={() => setActiveFinishId(finish.id)}
                className={cn(
                  "w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all text-start cursor-pointer group shadow-2xs",
                  isSelected
                    ? "bg-white border-[#1E6091] ring-2 ring-[#1E6091]/20 shadow-xs"
                    : "bg-surface-50 hover:bg-white border-border-default/70 hover:border-border-default"
                )}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Tactile Metallic Swatch Disc */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl bg-gradient-to-br shrink-0 shadow-sm border border-black/10 transition-transform",
                      finish.gradient,
                      isSelected ? "ring-2 ring-[#1E6091] ring-offset-2" : ""
                    )}
                  />

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-extrabold text-brand-900 truncate">
                        {finish.nameAr}
                      </h4>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1E6091]" />
                      )}
                    </div>
                    <p className="text-[11px] text-text-muted font-medium truncate">
                      {finish.subtitle}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-bold text-text-muted shrink-0 ms-2 px-2 py-0.5 rounded bg-surface-100">
                  {finish.code}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
