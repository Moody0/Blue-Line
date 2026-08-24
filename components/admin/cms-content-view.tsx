"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  Save,
  Plus,
  Trash2,
  Sliders,
  ShieldCheck,
  FileText,
  Megaphone,
  Phone,
  Check,
  AlertCircle,
  Eye,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Droplets,
  Bath,
  Wrench,
  Truck,
  Clock,
  ExternalLink,
  Layers,
  LayoutTemplate,
  Link as LinkIcon,
  ListTree,
} from "lucide-react";
import type {
  SiteSettings,
  HeroSlide,
  ServicePillar,
  WarrantyContent,
  PoliciesContent,
  AnnouncementBarContent,
  StoreContactContent,
  FooterContent,
  FooterLink,
  FooterColumn,
} from "@/types/ecommerce";
import { updateSiteSettings } from "@/actions/settings";
import { Input } from "@/components/ui/input";

interface CmsContentViewProps {
  initialSettings: SiteSettings;
}

const AVAILABLE_ICONS: Record<string, any> = {
  Droplets,
  Bath,
  Wrench,
  Truck,
  ShieldCheck,
  Sparkles,
  Clock,
};

const DEFAULT_CATEGORIES_COLUMN: FooterColumn = {
  title: "أقسام المنتجات",
  links: [
    { label: "خلاطات أحواض الحمام", href: "/category/mixers-basins" },
    { label: "أنظمة دش مطري وشاور دفن", href: "/category/shower-bury" },
    { label: "خلاطات بانيو وشطافات", href: "/category/bathtub-mixers" },
    { label: "أطقم ومحابس إيطالية", href: "/category/valves-supplies" },
    { label: "جميع المنتجات والكتالوج", href: "/products" },
  ],
};

const DEFAULT_SERVICES_COLUMN: FooterColumn = {
  title: "خدمات وضمانات",
  links: [
    { label: "شهادة الضمان المعتمد والصيانة", href: "/warranty" },
    { label: "سياسة الشحن والتوصيل للمحافظات", href: "/shipping" },
    { label: "سياسة الاسترجاع والاستبدال (١٤ يوماً)", href: "/returns" },
    { label: "تتبع حالة الشحنة والطلب", href: "/track-order" },
    { label: "حسابي وسجل المشتريات", href: "/account" },
  ],
};

export function CmsContentView({ initialSettings }: CmsContentViewProps) {
  const [activeTab, setActiveTab] = useState<"hero" | "pillars" | "policies" | "announcement" | "footer">("hero");
  const [policySubTab, setPolicySubTab] = useState<"warranty" | "returns" | "shipping" | "privacy" | "terms">("warranty");

  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(initialSettings.hero_slides || []);
  const [servicePillars, setServicePillars] = useState<ServicePillar[]>(initialSettings.service_pillars || []);
  const [warrantyContent, setWarrantyContent] = useState<WarrantyContent>(
    initialSettings.warranty_content || {
      titleAr: "الضمان وخدمات ما بعد البيع",
      subtitleAr: "كافة خلاطات المياه والأدوات الصحية ومستلزمات السباكة المعتمدة لدى بلو لاين أصلية ومشمولة بضمان رسمي معتمد ضد عيوب الصناعة والتسريب.",
      durationAr: "من سنتين وحتى ٥ سنوات ضمان معتمد",
      sections: [],
    }
  );
  const [policiesContent, setPoliciesContent] = useState<PoliciesContent>(
    initialSettings.policies_content || {
      returns: { title: "سياسة الاستبدال والاسترجاع", content: "" },
      shipping: { title: "سياسة الشحن والتوصيل", content: "" },
      privacy: { title: "سياسة الخصوصية وأمان البيانات", content: "" },
      terms: { title: "الشروط والأحكام", content: "" },
    }
  );
  const [announcementBar, setAnnouncementBar] = useState<AnnouncementBarContent>(
    initialSettings.announcement_bar || {
      text: "شحن وتوصيل لكافة أنحاء الجمهورية. سياسة استبدال واسترجاع ١٤ يوماً. شحن مجاني للطلبات فوق ٥,٠٠٠ ج.م.",
      is_active: true,
      badge_text: "",
      link_url: "",
      free_shipping_threshold: 5000,
    }
  );
  const [storeContact, setStoreContact] = useState<StoreContactContent>(
    initialSettings.store_contact || {
      phone: "01000000000",
      phoneDisplay: "+20 100 000 0000",
      whatsapp: "201000000000",
      email: "support@blueline-eg.com",
      address: "القاهرة الجديدة، التجمع الخامس، جمهورية مصر العربية",
      workingHours: "السبت - الخميس: ٩:٠٠ ص - ٩:٠٠ م",
    }
  );
  const [footerContent, setFooterContent] = useState<FooterContent>(
    initialSettings.footer_content || {
      about_text: "الموزع المعتمد لحلول وخلاطات GROHE الألمانية وأنظمة الدش المعمارية في مصر.",
      phone_label: "هاتف ومبيعات:",
      phone_display: "+20 100 000 0000",
      phone_international: "+201000000000",
      whatsapp_number: "201000000000",
      facebook_url: "https://facebook.com",
      copyright_text: "بلو لاين (Blue Line). جميع الحقوق محفوظة.",
      column_categories: DEFAULT_CATEGORIES_COLUMN,
      column_services: DEFAULT_SERVICES_COLUMN,
    }
  );

  // Ensure columns are always defined
  const categoriesColumn = footerContent.column_categories || DEFAULT_CATEGORIES_COLUMN;
  const servicesColumn = footerContent.column_services || DEFAULT_SERVICES_COLUMN;

  const showNotification = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  // ── Save Handlers ──
  const handleSaveHero = () => {
    startTransition(async () => {
      const res = await updateSiteSettings("hero_slides", heroSlides);
      if (res.success) showNotification("تم حفظ لافتات الصفحة الرئيسية بنجاح!");
      else setErrorMessage(res.error || "حدث خطأ أثناء الحفظ");
    });
  };

  const handleSavePillars = () => {
    startTransition(async () => {
      const res = await updateSiteSettings("service_pillars", servicePillars);
      if (res.success) showNotification("تم حفظ ركائز الخدمة والثقة بنجاح!");
      else setErrorMessage(res.error || "حدث خطأ أثناء الحفظ");
    });
  };

  const handleSavePolicies = () => {
    startTransition(async () => {
      const [res1, res2] = await Promise.all([
        updateSiteSettings("warranty_content", warrantyContent),
        updateSiteSettings("policies_content", policiesContent),
      ]);
      if (res1.success && res2.success) showNotification("تم حفظ الضمان وسياسات المتجر بنجاح!");
      else setErrorMessage("حدث خطأ أثناء حفظ السياسات");
    });
  };

  const handleSaveAnnouncementAndContact = () => {
    startTransition(async () => {
      const [res1, res2] = await Promise.all([
        updateSiteSettings("announcement_bar", announcementBar),
        updateSiteSettings("store_contact", storeContact),
      ]);
      if (res1.success && res2.success) {
        showNotification("تم حفظ شريط الإعلانات وبيانات التواصل بنجاح!");
      } else {
        setErrorMessage("حدث خطأ أثناء حفظ الإعدادات");
      }
    });
  };

  const handleSaveFooter = () => {
    startTransition(async () => {
      const res = await updateSiteSettings("footer_content", footerContent);
      if (res.success) {
        showNotification("تم حفظ بيانات وأقسام وروابط الفوتر بنجاح!");
      } else {
        setErrorMessage("حدث خطأ أثناء حفظ الفوتر");
      }
    });
  };

  // ── Slide Actions ──
  const addSlide = () => {
    const newSlide: HeroSlide = {
      id: Date.now(),
      tagline: "هندسة معمارية فاخرة",
      title: "عنوان لافتة جديدة بالصفحة الرئيسية",
      ctaText: "تسوق الآن",
      ctaHref: "/category/mixers-basins",
      imageSrc: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=2000&q=85",
    };
    setHeroSlides([...heroSlides, newSlide]);
  };

  const removeSlide = (idx: number) => {
    if (heroSlides.length <= 1) {
      alert("يجب الإبقاء على لافتة واحدة على الأقل بالرئيسية.");
      return;
    }
    setHeroSlides(heroSlides.filter((_, i) => i !== idx));
  };

  const moveSlide = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= heroSlides.length) return;
    const reordered = [...heroSlides];
    const temp = reordered[idx];
    reordered[idx] = reordered[targetIdx];
    reordered[targetIdx] = temp;
    setHeroSlides(reordered);
  };

  // ── Warranty Sections Actions ──
  const addWarrantySection = () => {
    setWarrantyContent({
      ...warrantyContent,
      sections: [
        ...warrantyContent.sections,
        {
          title: `بند جديد رقم ${warrantyContent.sections.length + 1}`,
          content: "اكتب تفاصيل وشروط هذا البند هنا...",
        },
      ],
    });
  };

  const removeWarrantySection = (idx: number) => {
    setWarrantyContent({
      ...warrantyContent,
      sections: warrantyContent.sections.filter((_, i) => i !== idx),
    });
  };

  // ── Footer Column Links Actions ──
  const addCategoryLink = () => {
    const current = footerContent.column_categories || DEFAULT_CATEGORIES_COLUMN;
    setFooterContent({
      ...footerContent,
      column_categories: {
        ...current,
        links: [
          ...current.links,
          { label: "قسم جديد", href: "/category/mixers-basins" },
        ],
      },
    });
  };

  const removeCategoryLink = (index: number) => {
    const current = footerContent.column_categories || DEFAULT_CATEGORIES_COLUMN;
    setFooterContent({
      ...footerContent,
      column_categories: {
        ...current,
        links: current.links.filter((_, i) => i !== index),
      },
    });
  };

  const addServiceLink = () => {
    const current = footerContent.column_services || DEFAULT_SERVICES_COLUMN;
    setFooterContent({
      ...footerContent,
      column_services: {
        ...current,
        links: [
          ...current.links,
          { label: "صفحة خدمة جديدة", href: "/warranty" },
        ],
      },
    });
  };

  const removeServiceLink = (index: number) => {
    const current = footerContent.column_services || DEFAULT_SERVICES_COLUMN;
    setFooterContent({
      ...footerContent,
      column_services: {
        ...current,
        links: current.links.filter((_, i) => i !== index),
      },
    });
  };

  return (
    <div className="space-y-6 pb-20 text-start font-alexandria">
      {/* ── 1. Page Header & Actions Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            إدارة المحتوى والصفحات (CMS)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            التحكم الكامل في لافتات الرئيسية، ركائز الثقة، نصوص الضمان، شريط الإعلانات، وصفحات السياسات وفوتر المتجر.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <Check size={14} className="text-emerald-600" />
              <span>{saveSuccess}</span>
            </div>
          )}
          {errorMessage && (
            <div className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={14} className="text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── 2. Top Main Tabs Navigation ── */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab("hero")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "hero"
              ? "border-[#1E6091] text-[#1E6091] bg-slate-50/50"
              : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
          }`}
        >
          <Sliders size={15} />
          <span>لافتات الرئيسية (Hero Slides)</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
            {heroSlides.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("pillars")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "pillars"
              ? "border-[#1E6091] text-[#1E6091] bg-slate-50/50"
              : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
          }`}
        >
          <ShieldCheck size={15} />
          <span>ركائز الخدمة والجودة (Trust Pillars)</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
            {servicePillars.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("policies")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "policies"
              ? "border-[#1E6091] text-[#1E6091] bg-slate-50/50"
              : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
          }`}
        >
          <FileText size={15} />
          <span>الضمان والسياسات (Policies & Warranty)</span>
        </button>

        <button
          onClick={() => setActiveTab("announcement")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "announcement"
              ? "border-[#1E6091] text-[#1E6091] bg-slate-50/50"
              : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
          }`}
        >
          <Megaphone size={15} />
          <span>شريط الإعلانات وبيانات التواصل</span>
        </button>

        <button
          onClick={() => setActiveTab("footer")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "footer"
              ? "border-[#1E6091] text-[#1E6091] bg-slate-50/50"
              : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
          }`}
        >
          <LayoutTemplate size={15} />
          <span>فوتر المتجر (Footer CMS)</span>
        </button>
      </div>

      {/* ── 3. Tab 1: Hero Slides Manager ── */}
      {activeTab === "hero" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                لافتات العرض الترويجي بالصفحة الرئيسية
              </h2>
              <p className="text-[11px] text-slate-400">
                تظهر اللافتات في سلايدر تفاعلي بقمة الصفحة الرئيسية وتتحرك تلقائياً كل ٧ ثوانٍ
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={addSlide}
                className="px-3.5 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>إضافة شريحة جديدة</span>
              </button>

              <button
                type="button"
                onClick={handleSaveHero}
                disabled={isPending}
                className="px-5 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Save size={14} />
                <span>{isPending ? "جاري الحفظ..." : "حفظ اللافتات"}</span>
              </button>
            </div>
          </div>

          {/* Slides List */}
          <div className="space-y-5">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id || idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-extrabold text-slate-800">
                      شريحة العرض #{idx + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveSlide(idx, "up")}
                      disabled={idx === 0}
                      className="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer"
                      title="تحريك لأعلى"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSlide(idx, "down")}
                      disabled={idx === heroSlides.length - 1}
                      className="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer"
                      title="تحريك لأسفل"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSlide(idx)}
                      className="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                      title="حذف الشريحة"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* Left: Inputs (Span 8) */}
                  <div className="lg:col-span-8 space-y-3.5 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">
                        الشعار الترويجي الصغير (Tagline)
                      </label>
                      <Input
                        value={slide.tagline}
                        onChange={(e) => {
                          const updated = [...heroSlides];
                          updated[idx].tagline = e.target.value;
                          setHeroSlides(updated);
                        }}
                        placeholder="مثال: هندسة ألمانية فائقة • جودة متكاملة"
                        className="h-10 text-xs bg-slate-50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">
                        العنوان الرئيسي البارز (Hero Title)
                      </label>
                      <Input
                        value={slide.title}
                        onChange={(e) => {
                          const updated = [...heroSlides];
                          updated[idx].title = e.target.value;
                          setHeroSlides(updated);
                        }}
                        placeholder="مثال: حمامات عصرية متكاملة بتصميم وتجهيزات ألمانية فاخرة"
                        className="h-10 text-xs font-bold bg-slate-50"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 block">
                          نص زر التوجيه (CTA Text)
                        </label>
                        <Input
                          value={slide.ctaText}
                          onChange={(e) => {
                            const updated = [...heroSlides];
                            updated[idx].ctaText = e.target.value;
                            setHeroSlides(updated);
                          }}
                          placeholder="تسوق الآن"
                          className="h-10 text-xs bg-slate-50"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 block">
                          رابط التوجيه (CTA Link)
                        </label>
                        <Input
                          value={slide.ctaHref}
                          onChange={(e) => {
                            const updated = [...heroSlides];
                            updated[idx].ctaHref = e.target.value;
                            setHeroSlides(updated);
                          }}
                          placeholder="/category/mixers-basins"
                          className="h-10 text-xs font-mono bg-slate-50"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">
                        رابط صورة الخلفية عالية الجودة (Image URL)
                      </label>
                      <Input
                        value={slide.imageSrc}
                        onChange={(e) => {
                          const updated = [...heroSlides];
                          updated[idx].imageSrc = e.target.value;
                          setHeroSlides(updated);
                        }}
                        placeholder="https://images.unsplash.com/..."
                        className="h-10 text-xs font-mono bg-slate-50"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Right: Live Visual Preview Card (Span 4) */}
                  <div className="lg:col-span-4 rounded-xl border border-slate-200 overflow-hidden relative h-48 bg-slate-900 text-white flex flex-col justify-end p-4 shadow-inner">
                    {slide.imageSrc && (
                      <Image
                        src={slide.imageSrc}
                        alt="Hero Preview"
                        fill
                        className="object-cover opacity-60"
                      />
                    )}
                    <div className="relative z-10 space-y-1">
                      <span className="text-[10px] font-bold text-amber-300 uppercase block tracking-wider">
                        {slide.tagline || "Tagline"}
                      </span>
                      <h4 className="text-xs font-extrabold line-clamp-2 leading-snug">
                        {slide.title || "العنوان سيظهر هنا"}
                      </h4>
                      <span className="inline-block px-2.5 py-1 rounded bg-[#1E6091] text-white text-[10px] font-bold mt-1 shadow-xs">
                        {slide.ctaText || "زر الإجراء"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 4. Tab 2: Service Pillars / Trust Badges ── */}
      {activeTab === "pillars" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                ركائز الخدمة والجودة (Trust Pillars)
              </h2>
              <p className="text-[11px] text-slate-400">
                البطاقات الدائرية الأربعة التي تعكس الثقة والضمان والدعم الهندسي في واجهة الموقع
              </p>
            </div>

            <button
              type="button"
              onClick={handleSavePillars}
              disabled={isPending}
              className="px-5 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Save size={14} />
              <span>{isPending ? "جاري الحفظ..." : "حفظ الركائز"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {servicePillars.map((pillar, idx) => {
              const IconComp = AVAILABLE_ICONS[pillar.iconName] || Droplets;

              return (
                <div
                  key={pillar.id || idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#1E6091] flex items-center justify-center">
                        <IconComp size={18} />
                      </div>
                      <div>
                        <h3 className="text-xs font-extrabold text-slate-900">
                          {pillar.titleAr || `ركيزة #${idx + 1}`}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {pillar.id}
                        </span>
                      </div>
                    </div>

                    {/* Icon Picker Select */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <label className="font-bold text-slate-500">الأيقونة:</label>
                      <select
                        value={pillar.iconName}
                        onChange={(e) => {
                          const updated = [...servicePillars];
                          updated[idx].iconName = e.target.value;
                          setServicePillars(updated);
                        }}
                        className="h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 outline-none cursor-pointer"
                      >
                        <option value="Droplets">قطرات ماء (Droplets)</option>
                        <option value="Bath">بانيو / دش (Bath)</option>
                        <option value="Wrench">مفتاح صيانة (Wrench)</option>
                        <option value="Truck">شاحنة توصيل (Truck)</option>
                        <option value="ShieldCheck">درع ضمان (ShieldCheck)</option>
                        <option value="Sparkles">جودة ولمعان (Sparkles)</option>
                        <option value="Clock">سرعة واستجابة (Clock)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">
                        عنوان الركيزة *
                      </label>
                      <Input
                        value={pillar.titleAr}
                        onChange={(e) => {
                          const updated = [...servicePillars];
                          updated[idx].titleAr = e.target.value;
                          setServicePillars(updated);
                        }}
                        placeholder="مثال: تركيب واستشارات هندسية"
                        className="h-10 text-xs font-bold bg-slate-50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">
                        الوصف المختصر *
                      </label>
                      <textarea
                        rows={2}
                        value={pillar.descriptionAr}
                        onChange={(e) => {
                          const updated = [...servicePillars];
                          updated[idx].descriptionAr = e.target.value;
                          setServicePillars(updated);
                        }}
                        placeholder="اكتب وصفاً موجزاً وواضحاً..."
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs leading-relaxed outline-none focus:border-[#1E6091] transition-all"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 5. Tab 3: Policies & Warranty CMS ── */}
      {activeTab === "policies" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                إدارة نصوص الضمان وسياسات المتجر
              </h2>
              <p className="text-[11px] text-slate-400">
                تحديث بنود وشروط الضمان، الاسترجاع، الشحن، الخصوصية، والشروط العامة المعروضة للعملاء
              </p>
            </div>

            <button
              type="button"
              onClick={handleSavePolicies}
              disabled={isPending}
              className="px-5 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Save size={14} />
              <span>{isPending ? "جاري الحفظ..." : "حفظ السياسات والضمان"}</span>
            </button>
          </div>

          {/* Sub-Tabs for each policy */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl w-fit flex-wrap">
            <button
              type="button"
              onClick={() => setPolicySubTab("warranty")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                policySubTab === "warranty"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              🛡️ الضمان والصيانة
            </button>
            <button
              type="button"
              onClick={() => setPolicySubTab("returns")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                policySubTab === "returns"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              🔄 الاستبدال والاسترجاع
            </button>
            <button
              type="button"
              onClick={() => setPolicySubTab("shipping")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                policySubTab === "shipping"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              🚚 الشحن والتوصيل
            </button>
            <button
              type="button"
              onClick={() => setPolicySubTab("privacy")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                policySubTab === "privacy"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              🔒 الخصوصية والبيانات
            </button>
            <button
              type="button"
              onClick={() => setPolicySubTab("terms")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                policySubTab === "terms"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              📋 الشروط والأحكام
            </button>
          </div>

          {/* Sub-Tab 1: Warranty Editor */}
          {policySubTab === "warranty" && (
            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-5 shadow-2xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">عنوان الصفحة الرئيسي</label>
                  <Input
                    value={warrantyContent.titleAr}
                    onChange={(e) => setWarrantyContent({ ...warrantyContent, titleAr: e.target.value })}
                    className="h-10 text-xs font-bold bg-slate-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">شارة مدة الضمان البارزة</label>
                  <Input
                    value={warrantyContent.durationAr}
                    onChange={(e) => setWarrantyContent({ ...warrantyContent, durationAr: e.target.value })}
                    className="h-10 text-xs bg-slate-50"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700 block">المقدمة والوصف التمهيدي</label>
                <textarea
                  rows={2}
                  value={warrantyContent.subtitleAr}
                  onChange={(e) => setWarrantyContent({ ...warrantyContent, subtitleAr: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs leading-relaxed outline-none focus:border-[#1E6091]"
                />
              </div>

              {/* Repeatable Warranty Sections */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700">بنود وتفاصيل الضمان:</span>
                  <button
                    type="button"
                    onClick={addWarrantySection}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>إضافة بند</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {warrantyContent.sections.map((sec, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <Input
                          value={sec.title}
                          onChange={(e) => {
                            const updated = [...warrantyContent.sections];
                            updated[idx].title = e.target.value;
                            setWarrantyContent({ ...warrantyContent, sections: updated });
                          }}
                          placeholder="عنوان البند (مثال: ١. مدة وتغطية الضمان)"
                          className="h-9 text-xs font-bold bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => removeWarrantySection(idx)}
                          className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 flex items-center justify-center shrink-0 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <textarea
                        rows={3}
                        value={sec.content}
                        onChange={(e) => {
                          const updated = [...warrantyContent.sections];
                          updated[idx].content = e.target.value;
                          setWarrantyContent({ ...warrantyContent, sections: updated });
                        }}
                        placeholder="اكتب تفاصيل البند... يمكنك استخدام النقاط • في أسطر منفصلة"
                        className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-xs leading-relaxed outline-none focus:border-[#1E6091]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tabs 2-5: Returns, Shipping, Privacy, Terms */}
          {policySubTab !== "warranty" && (
            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-4 shadow-2xs text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">عنوان الصفحة الرئيسي</label>
                <Input
                  value={policiesContent[policySubTab]?.title || ""}
                  onChange={(e) =>
                    setPoliciesContent({
                      ...policiesContent,
                      [policySubTab]: {
                        ...policiesContent[policySubTab],
                        title: e.target.value,
                      },
                    })
                  }
                  className="h-10 text-xs font-bold bg-slate-50"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">الوصف التمهيدي المختصر</label>
                <Input
                  value={policiesContent[policySubTab]?.subtitle || ""}
                  onChange={(e) =>
                    setPoliciesContent({
                      ...policiesContent,
                      [policySubTab]: {
                        ...policiesContent[policySubTab],
                        subtitle: e.target.value,
                      },
                    })
                  }
                  className="h-10 text-xs bg-slate-50"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">محتوى وبنود السياسة</label>
                <textarea
                  rows={8}
                  value={policiesContent[policySubTab]?.content || ""}
                  onChange={(e) =>
                    setPoliciesContent({
                      ...policiesContent,
                      [policySubTab]: {
                        ...policiesContent[policySubTab],
                        content: e.target.value,
                      },
                    })
                  }
                  placeholder="اكتب بنود السياسة كاملة... استخدم • لكل نقطة في سطر مستقل"
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs leading-relaxed outline-none focus:border-[#1E6091] transition-all font-mono"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 6. Tab 4: Announcement Bar & Store Contact Info ── */}
      {activeTab === "announcement" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                شريط الإعلانات وبيانات التواصل
              </h2>
              <p className="text-[11px] text-slate-400">
                التحكم في الشريط الترويجي العلوي وأرقام هواتف خدمة العملاء والواتساب
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveAnnouncementAndContact}
              disabled={isPending}
              className="px-5 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Save size={14} />
              <span>{isPending ? "جاري الحفظ..." : "حفظ الإعدادات"}</span>
            </button>
          </div>

          {/* Card 1: Announcement Bar */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-4 shadow-2xs text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Megaphone size={16} className="text-[#1E6091]" />
                <h3 className="font-extrabold text-slate-900">شريط الإعلانات العلوي (Announcement Bar)</h3>
              </div>

              {/* Toggle Switch */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="font-bold text-slate-700">تفعيل الشريط:</span>
                <div
                  onClick={() =>
                    setAnnouncementBar({
                      ...announcementBar,
                      is_active: !announcementBar.is_active,
                    })
                  }
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    announcementBar.is_active ? "bg-emerald-600" : "bg-slate-200"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      announcementBar.is_active ? "-translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </label>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">نص الإعلان المعروض في الشريط العلوي *</label>
              <Input
                value={announcementBar.text}
                onChange={(e) =>
                  setAnnouncementBar({ ...announcementBar, text: e.target.value })
                }
                placeholder="شحن وتوصيل لكافة أنحاء الجمهورية. سياسة استبدال واسترجاع ١٤ يوماً. شحن مجاني للطلبات فوق ٥,٠٠٠ ج.م."
                className="h-10 text-xs bg-slate-50 font-bold"
              />
            </div>

            {/* Quick Link Selector & Custom URL */}
            <div className="space-y-2">
              <label className="font-bold text-slate-700 block flex items-center justify-between">
                <span>رابط التوجيه عند النقر على الشريط (اختياري)</span>
                <span className="text-[10px] text-slate-400">اتركه فارغاً إذا كنت تريده نصاً ثابتاً بدون رابط</span>
              </label>

              <div className="flex flex-wrap gap-1.5 pb-1">
                <button
                  type="button"
                  onClick={() => setAnnouncementBar({ ...announcementBar, link_url: "" })}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer ${
                    announcementBar.link_url === ""
                      ? "bg-[#0B192C] text-white border-[#0B192C]"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  🚫 بدون رابط (نص فقط)
                </button>
                <button
                  type="button"
                  onClick={() => setAnnouncementBar({ ...announcementBar, link_url: "/products" })}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer ${
                    announcementBar.link_url === "/products"
                      ? "bg-[#0B192C] text-white border-[#0B192C]"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  📦 كل المنتجات (/products)
                </button>
                <button
                  type="button"
                  onClick={() => setAnnouncementBar({ ...announcementBar, link_url: "/category/mixers-basins" })}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer ${
                    announcementBar.link_url === "/category/mixers-basins"
                      ? "bg-[#0B192C] text-white border-[#0B192C]"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  🚿 خلاطات الأحواض
                </button>
                <button
                  type="button"
                  onClick={() => setAnnouncementBar({ ...announcementBar, link_url: "/category/shower-bury" })}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer ${
                    announcementBar.link_url === "/category/shower-bury"
                      ? "bg-[#0B192C] text-white border-[#0B192C]"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  🌧️ شاور دفن
                </button>
              </div>

              <Input
                value={announcementBar.link_url}
                onChange={(e) =>
                  setAnnouncementBar({ ...announcementBar, link_url: e.target.value })
                }
                placeholder="أدخل رابطاً مخصصاً (مثال: /products أو /category/faucets)"
                className="h-10 text-xs font-mono bg-slate-50"
                dir="ltr"
              />
            </div>
          </div>

          {/* Card 2: Store Contact Info */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-4 shadow-2xs text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Phone size={16} className="text-[#1E6091]" />
              <h3 className="font-extrabold text-slate-900">بيانات التواصل ودعم العملاء</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">رقم الهاتف المعروض</label>
                <Input
                  value={storeContact.phoneDisplay}
                  onChange={(e) => setStoreContact({ ...storeContact, phoneDisplay: e.target.value })}
                  placeholder="+20 100 000 0000"
                  className="h-10 text-xs bg-slate-50"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">رقم الواتساب الدولي (بدون +)</label>
                <Input
                  value={storeContact.whatsapp}
                  onChange={(e) => setStoreContact({ ...storeContact, whatsapp: e.target.value })}
                  placeholder="201000000000"
                  className="h-10 text-xs font-mono bg-slate-50"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">البريد الإلكتروني الرسمي</label>
                <Input
                  value={storeContact.email}
                  onChange={(e) => setStoreContact({ ...storeContact, email: e.target.value })}
                  placeholder="support@blueline-eg.com"
                  className="h-10 text-xs font-mono bg-slate-50"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">مواعيد وساعات العمل</label>
                <Input
                  value={storeContact.workingHours}
                  onChange={(e) => setStoreContact({ ...storeContact, workingHours: e.target.value })}
                  placeholder="السبت - الخميس: ٩:٠٠ ص - ٩:٠٠ م"
                  className="h-10 text-xs bg-slate-50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">عنوان المقر أو صالة العرض</label>
              <Input
                value={storeContact.address}
                onChange={(e) => setStoreContact({ ...storeContact, address: e.target.value })}
                placeholder="القاهرة الجديدة، التجمع الخامس، جمهورية مصر العربية"
                className="h-10 text-xs bg-slate-50"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 7. Tab 5: Footer Content CMS ── */}
      {activeTab === "footer" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                فوتر المتجر ومعلومات الحقوق والأقسام والروابط (Footer CMS)
              </h2>
              <p className="text-[11px] text-slate-400">
                التحكم الكامل في نبذة المتجر، أرقام المبيعات، أعمدة الأقسام، روابط الخدمات والضمانات، وسطر حقوق الملكية
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveFooter}
              disabled={isPending}
              className="px-5 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Save size={14} />
              <span>{isPending ? "جاري الحفظ..." : "حفظ الفوتر"}</span>
            </button>
          </div>

          {/* Card 1: Brand & Contact Info */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-5 shadow-2xs text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <LayoutTemplate size={16} className="text-[#1E6091]" />
              <h3 className="font-extrabold text-slate-900">الهوية ونصوص الفوتر ومعلومات التواصل</h3>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">نبذة المتجر في الفوتر (About Text) *</label>
              <textarea
                rows={2}
                value={footerContent.about_text}
                onChange={(e) => setFooterContent({ ...footerContent, about_text: e.target.value })}
                placeholder="الموزع المعتمد لحلول وخلاطات GROHE الألمانية وأنظمة الدش المعمارية في مصر."
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs leading-relaxed outline-none focus:border-[#1E6091]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">عنوان وسطر الهاتف بالفوتر</label>
                <Input
                  value={footerContent.phone_label}
                  onChange={(e) => setFooterContent({ ...footerContent, phone_label: e.target.value })}
                  placeholder="هاتف ومبيعات:"
                  className="h-10 text-xs bg-slate-50"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">رقم الهاتف المعروض بالفوتر</label>
                <Input
                  value={footerContent.phone_display}
                  onChange={(e) => setFooterContent({ ...footerContent, phone_display: e.target.value })}
                  placeholder="+20 100 000 0000"
                  className="h-10 text-xs bg-slate-50"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">رقم الواتساب بالفوتر (بدون +)</label>
                <Input
                  value={footerContent.whatsapp_number}
                  onChange={(e) => setFooterContent({ ...footerContent, whatsapp_number: e.target.value })}
                  placeholder="201000000000"
                  className="h-10 text-xs font-mono bg-slate-50"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">رابط صفحة الفيسبوك (Facebook URL)</label>
                <Input
                  value={footerContent.facebook_url}
                  onChange={(e) => setFooterContent({ ...footerContent, facebook_url: e.target.value })}
                  placeholder="https://facebook.com/blueline"
                  className="h-10 text-xs font-mono bg-slate-50"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">نص حقوق الملكية والنشر (Copyright Text) *</label>
              <Input
                value={footerContent.copyright_text}
                onChange={(e) => setFooterContent({ ...footerContent, copyright_text: e.target.value })}
                placeholder="بلو لاين (Blue Line). جميع الحقوق محفوظة."
                className="h-10 text-xs bg-slate-50 font-bold"
              />
            </div>
          </div>

          {/* Card 2: Column 2 (Categories Column Links) */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-4 shadow-2xs text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ListTree size={16} className="text-[#1E6091]" />
                <div>
                  <h3 className="font-extrabold text-slate-900">العمود الأول بالفوتر: أقسام المنتجات والكتالوج</h3>
                  <span className="text-[11px] text-slate-400">إدارة عنوان العمود وقائمة الروابط المعروضة تحته</span>
                </div>
              </div>

              <button
                type="button"
                onClick={addCategoryLink}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
              >
                <Plus size={13} />
                <span>إضافة رابط قسم</span>
              </button>
            </div>

            <div className="space-y-1 max-w-sm">
              <label className="font-bold text-slate-700 block">عنوان العمود</label>
              <Input
                value={categoriesColumn.title}
                onChange={(e) =>
                  setFooterContent({
                    ...footerContent,
                    column_categories: {
                      ...categoriesColumn,
                      title: e.target.value,
                    },
                  })
                }
                placeholder="أقسام المنتجات"
                className="h-9 text-xs font-bold bg-slate-50"
              />
            </div>

            {/* Links List */}
            <div className="space-y-2.5 pt-2">
              <span className="font-extrabold text-slate-700 block">قائمة الروابط ({categoriesColumn.links.length}):</span>
              {categoriesColumn.links.map((link, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-200">
                  <Input
                    value={link.label}
                    onChange={(e) => {
                      const updated = [...categoriesColumn.links];
                      updated[idx].label = e.target.value;
                      setFooterContent({
                        ...footerContent,
                        column_categories: {
                          ...categoriesColumn,
                          links: updated,
                        },
                      });
                    }}
                    placeholder="اسم الرابط (مثال: خلاطات أحواض الحمام)"
                    className="h-9 text-xs bg-white flex-1"
                  />

                  <Input
                    value={link.href}
                    onChange={(e) => {
                      const updated = [...categoriesColumn.links];
                      updated[idx].href = e.target.value;
                      setFooterContent({
                        ...footerContent,
                        column_categories: {
                          ...categoriesColumn,
                          links: updated,
                        },
                      });
                    }}
                    placeholder="/category/mixers-basins"
                    className="h-9 text-xs font-mono bg-white flex-1"
                    dir="ltr"
                  />

                  <button
                    type="button"
                    onClick={() => removeCategoryLink(idx)}
                    className="w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 flex items-center justify-center shrink-0 cursor-pointer hover:bg-rose-50 transition-colors"
                    title="حذف هذا الرابط"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Column 3 (Services & Guarantees Column Links) */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-4 shadow-2xs text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#1E6091]" />
                <div>
                  <h3 className="font-extrabold text-slate-900">العمود الثاني بالفوتر: خدمات وضمانات وصفحات المتجر</h3>
                  <span className="text-[11px] text-slate-400">إدارة عنوان العمود وروابط صفحات السياسات والضمان والتتبع</span>
                </div>
              </div>

              <button
                type="button"
                onClick={addServiceLink}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
              >
                <Plus size={13} />
                <span>إضافة رابط خدمة</span>
              </button>
            </div>

            <div className="space-y-1 max-w-sm">
              <label className="font-bold text-slate-700 block">عنوان العمود</label>
              <Input
                value={servicesColumn.title}
                onChange={(e) =>
                  setFooterContent({
                    ...footerContent,
                    column_services: {
                      ...servicesColumn,
                      title: e.target.value,
                    },
                  })
                }
                placeholder="خدمات وضمانات"
                className="h-9 text-xs font-bold bg-slate-50"
              />
            </div>

            {/* Links List */}
            <div className="space-y-2.5 pt-2">
              <span className="font-extrabold text-slate-700 block">قائمة الروابط ({servicesColumn.links.length}):</span>
              {servicesColumn.links.map((link, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-200">
                  <Input
                    value={link.label}
                    onChange={(e) => {
                      const updated = [...servicesColumn.links];
                      updated[idx].label = e.target.value;
                      setFooterContent({
                        ...footerContent,
                        column_services: {
                          ...servicesColumn,
                          links: updated,
                        },
                      });
                    }}
                    placeholder="اسم الرابط (مثال: شهادة الضمان المعتمد)"
                    className="h-9 text-xs bg-white flex-1"
                  />

                  <Input
                    value={link.href}
                    onChange={(e) => {
                      const updated = [...servicesColumn.links];
                      updated[idx].href = e.target.value;
                      setFooterContent({
                        ...footerContent,
                        column_services: {
                          ...servicesColumn,
                          links: updated,
                        },
                      });
                    }}
                    placeholder="/warranty"
                    className="h-9 text-xs font-mono bg-white flex-1"
                    dir="ltr"
                  />

                  <button
                    type="button"
                    onClick={() => removeServiceLink(idx)}
                    className="w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 flex items-center justify-center shrink-0 cursor-pointer hover:bg-rose-50 transition-colors"
                    title="حذف هذا الرابط"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
