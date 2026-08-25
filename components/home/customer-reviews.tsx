"use client";

import { Star, CheckCircle2, Quote, Award } from "lucide-react";

interface Review {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  verifiedProduct: string;
  avatarInitials: string;
}

const REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "م. طارق النجار",
    role: "مهندس ديكور",
    location: "القاهرة الجديدة",
    rating: 5,
    date: "منذ ٤ أيام",
    comment:
      "الخلاطات أصلية ١٠٠٪ والتغليف هندسي ممتاز لحماية الطلاء. تم تركيب نظام الشاور المخفي وضغط المياه فائق، وشهادة الضمان وصلت مختومة رسمياً مع الفاتورة.",
    verifiedProduct: "شراء موثق • نظام دش مطري وثرموستات جروهي",
    avatarInitials: "طن",
  },
  {
    id: "rev-2",
    name: "د. سارة عبد الرحمن",
    role: "عميلة موثقة",
    location: "الشيخ زايد",
    rating: 5,
    date: "منذ أسبوع",
    comment:
      "خدمة عملاء محترفة وسرعة في التوصيل لزايد خلال ٢٤ ساعة. عاينت الخلاطات بالكامل قبل الدفع عند الاستلام، والخامة والتشطيب الذهبي PVD تحفة معمارية حقيقية.",
    verifiedProduct: "شراء موثق • طقم خلاطات أحواض وبانيو PVD",
    avatarInitials: "سع",
  },
  {
    id: "rev-3",
    name: "م. حسام الدين سليم",
    role: "مهندس استشاري",
    location: "الإسكندرية",
    rating: 5,
    date: "منذ أسبوعين",
    comment:
      "فريق الدعم الفني ساعدني في اختيار محابس الدفن وشاسيه الحمام المعلق المناسب لضغط المياه في شقتي. مصداقية عالية ومنتجات ألمانية لا غبار عليها.",
    verifiedProduct: "شراء موثق • شاسيه دفن وخلاط حوض يوروكوب",
    avatarInitials: "حس",
  },
];

export function CustomerReviews() {
  return (
    <section className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 font-alexandria" dir="rtl">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-border-default/60 text-center sm:text-start">
        <div className="space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-bold text-[#1E6091] tracking-wider uppercase">
              ثقة عملائنا • VERIFIED REVIEWS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-900 tracking-tight">
            تجارب عملائنا مع بلو لاين
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-text-muted">
            تقييم 4.9 من 5 بناءً على أكثر من 1,200 طلب موثق في جميع محافظات مصر
          </p>
        </div>

        {/* Rating Summary Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-surface-50 border border-border-default shadow-2xs">
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="fill-current text-amber-400" />
            ))}
          </div>
          <span className="text-xs font-black text-brand-900">4.9 / 5.0</span>
          <span className="text-[11px] font-semibold text-text-muted border-s border-border-default pe-1 ps-2">
            ١,٢٠٠+ تقييم معتمد
          </span>
        </div>
      </div>

      {/* 3 Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((review) => (
          <div
            key={review.id}
            className="relative bg-white rounded-2xl border border-border-default/80 p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xs hover:shadow-md transition-shadow duration-300"
          >
            {/* Top Row: Stars + Date + Quote Icon */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={15} className="fill-current text-amber-400" />
                ))}
              </div>
              <span className="text-[11px] font-medium text-text-muted">
                {review.date}
              </span>
            </div>

            {/* Comment Text */}
            <p className="text-xs sm:text-sm text-brand-900 leading-relaxed font-normal text-start">
              &ldquo;{review.comment}&rdquo;
            </p>

            {/* Verified Product Badge */}
            <div className="pt-2 border-t border-border-default/50">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1E6091] bg-sky-50/80 px-2.5 py-1 rounded-lg w-full text-start">
                <CheckCircle2 size={13} className="shrink-0 text-[#1E6091]" />
                <span className="truncate">{review.verifiedProduct}</span>
              </div>
            </div>

            {/* User Meta Row */}
            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-full bg-[#1E6091]/10 text-[#1E6091] font-bold text-xs flex items-center justify-center shrink-0 border border-[#1E6091]/20">
                {review.avatarInitials}
              </div>
              <div className="text-start space-y-0.5 min-w-0">
                <h4 className="text-xs sm:text-sm font-extrabold text-brand-900 truncate">
                  {review.name}
                </h4>
                <p className="text-[11px] text-text-muted font-medium">
                  {review.role} • {review.location}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
