"use client";

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

  return (
    <section className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 cv-auto">
      {/* Section Title */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-900 tracking-tight">
          أعلى معايير الخدمة والجودة
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-text-muted">
          التزام مطلق بتقديم تجربة استثنائية من التوريد وحتى التركيب النهائي
        </p>
      </div>

      {/* 4 Round Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 items-start justify-items-center">
        {currentPillars.map((pillar, idx) => {
          const Icon = ICON_MAP[pillar.iconName] || Droplets;

          return (
            <div
              key={pillar.id || idx}
              className="group flex flex-col items-center text-center space-y-4 max-w-[260px] cursor-pointer"
            >
              {/* Circular Badge */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#ECEFF2] group-hover:bg-[#1E6091] group-hover:scale-105 flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:shadow-md">
                <Icon
                  size={46}
                  strokeWidth={1.4}
                  className="text-[#1E6091] group-hover:text-white transition-colors duration-300"
                />
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-brand-900 group-hover:text-[#1E6091] transition-colors leading-snug">
                  {pillar.titleAr}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed font-normal">
                  {pillar.descriptionAr}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
