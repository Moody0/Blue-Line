"use client";

import { useRef, useState, useEffect } from "react";
import {
  Droplets,
  Bath,
  Wrench,
  Truck,
  ShieldCheck,
  Sparkles,
  Clock,
} from "lucide-react";
import type { ServicePillar } from "@/types/ecommerce";

const ICON_MAP: Record<string, any> = {
  Droplets,
  Bath,
  Wrench,
  Truck,
  ShieldCheck,
  Sparkles,
  Clock,
};

const DEFAULT_PILLARS: ServicePillar[] = [
  {
    id: "engineering",
    titleAr: "تركيب واستشارات هندسية",
    descriptionAr: "دعم فني ومخططات سباكة دقيقة لكافة المشاريع والفيلات الخاصة.",
    iconName: "Droplets",
  },
  {
    id: "warranty",
    titleAr: "ضمان شامل معتمد",
    descriptionAr: "ضمان حقيقي يصل إلى ٢٠ عاماً ضد عيوب الصناعة وتغير الألوان.",
    iconName: "Bath",
  },
  {
    id: "parts",
    titleAr: "قطع غيار ومستلزمات أصلية",
    descriptionAr: "نوفر جميع القلوب والمحابس وقطع الغيار الأصلية المطابقة للمواصفات القياسية.",
    iconName: "Wrench",
  },
  {
    id: "shipping",
    titleAr: "شحن سريع وآمن",
    descriptionAr: "توصيل لكافة محافظات مصر مع إمكانية الفحص والمعاينة عند الاستلام.",
    iconName: "Truck",
  },
];

interface ServicePillarsProps {
  pillars?: ServicePillar[];
}

export function ServicePillars({ pillars }: ServicePillarsProps) {
  const currentPillars = pillars && pillars.length > 0 ? pillars : DEFAULT_PILLARS;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track horizontal scroll percentage on mobile
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(100);
      return;
    }
    const currentScroll = Math.abs(scrollLeft);
    const progress = Math.min(100, Math.max(0, (currentScroll / maxScroll) * 100));
    setScrollProgress(progress);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    handleScroll();
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 cv-auto font-alexandria" dir="rtl">
      {/* Section Title */}
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-900 tracking-tight">
          أعلى معايير الخدمة والجودة
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-text-muted">
          التزام مطلق بتقديم تجربة استثنائية من التوريد وحتى التركيب النهائي
        </p>
      </div>

      {/* 4 Round Pillars: Horizontal Swipeable Carousel on Mobile, Grid on Tablet/Desktop */}
      <div
        ref={scrollRef}
        className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scroll-smooth no-scrollbar pb-3 sm:pb-0 px-2 sm:px-0 items-start justify-start sm:justify-items-center"
      >
        {currentPillars.map((pillar, idx) => {
          const Icon = ICON_MAP[pillar.iconName] || Droplets;

          return (
            <div
              key={pillar.id || idx}
              className="shrink-0 snap-center min-w-[220px] sm:min-w-0 max-w-[260px] group flex flex-col items-center text-center space-y-4 cursor-pointer"
            >
              {/* Circular Badge with Instant Color Change */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#ECEFF2] group-hover:bg-[#1E6091] flex items-center justify-center shadow-2xs transition-colors duration-200">
                <Icon
                  size={38}
                  strokeWidth={1.4}
                  className="text-[#1E6091] group-hover:text-white transition-colors duration-200 sm:w-[46px] sm:h-[46px]"
                />
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5 px-2">
                <h3 className="text-xs sm:text-base font-bold text-brand-900 group-hover:text-[#1E6091] leading-snug">
                  {pillar.titleAr}
                </h3>
                <p className="text-[11px] sm:text-xs text-text-secondary leading-relaxed font-normal">
                  {pillar.descriptionAr}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Scroll Progress Indicator Bar */}
      <div className="flex sm:hidden justify-center items-center pt-1">
        <div className="w-28 h-1.5 rounded-full bg-slate-200/80 overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-[#1E6091] rounded-full transition-all duration-150 ease-out"
            style={{
              width: `${Math.max(25, scrollProgress)}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
