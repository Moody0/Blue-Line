import Link from "next/link";
import { Phone } from "lucide-react";
import { Logo } from "./logo";
import { CONTACT } from "@/lib/constants";
import { getSiteSettings } from "@/actions/settings";
import type { FooterColumn } from "@/types/ecommerce";

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
    { label: "قوانين وسياسة الضمان", href: "/warranty" },
    { label: "سياسة الشحن والتوصيل للمحافظات", href: "/shipping" },
    { label: "سياسة الاسترجاع والاستبدال (١٤ يوماً)", href: "/returns" },
    { label: "تتبع حالة الشحنة والطلب", href: "/track-order" },
    { label: "حسابي وسجل المشتريات", href: "/account" },
  ],
};

export async function Footer() {
  const settings = await getSiteSettings();
  const footer = settings.footer_content || {
    about_text: "الموزع المعتمد لحلول وخلاطات GROHE الألمانية وأنظمة الدش المعمارية في مصر.",
    phone_label: "هاتف ومبيعات:",
    phone_display: CONTACT.phoneDisplay,
    phone_international: CONTACT.phoneInternational,
    whatsapp_number: "201000000000",
    facebook_url: CONTACT.facebookUrl,
    copyright_text: "بلو لاين (Blue Line). جميع الحقوق محفوظة.",
  };

  const categoriesCol = footer.column_categories?.links && footer.column_categories.links.length > 0
    ? footer.column_categories
    : DEFAULT_CATEGORIES_COLUMN;

  const servicesCol = footer.column_services?.links && footer.column_services.links.length > 0
    ? footer.column_services
    : DEFAULT_SERVICES_COLUMN;

  const whatsappUrl = `https://wa.me/${footer.whatsapp_number || "201000000000"}`;

  return (
    <footer className="bg-brand-900 text-white border-t border-brand-800 selection:bg-[#1E6091] selection:text-white font-alexandria" dir="rtl">
      {/* ── Main Footer Container ── */}
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ── Column 1: Brand & Contact Info (5 cols on lg) ── */}
          <div className="lg:col-span-5 space-y-4 text-start">
            <Logo variant="light" size="md" />
            
            <p className="text-xs text-surface-200/70 leading-relaxed max-w-sm">
              {footer.about_text}
            </p>

            {/* Direct Contact Details */}
            <div className="space-y-2 text-xs text-surface-200/80 pt-1">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-surface-200/50 shrink-0" />
                <span>{footer.phone_label || "هاتف ومبيعات:"}</span>
                <a
                  href={`tel:${footer.phone_international || footer.phone_display}`}
                  dir="ltr"
                  className="font-plus-jakarta font-bold text-white hover:text-accent-300 transition-colors"
                >
                  {footer.phone_display}
                </a>
              </div>
            </div>

            {/* Clean Social Media Icons */}
            <div className="pt-2 flex items-center gap-2.5">
              {/* WhatsApp Icon */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="واتساب"
                title="تواصل عبر واتساب"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#25D366] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.677.15-.2.301-.777.98-1.028 1.256-.25.276-.501.301-.802.15-.301-.15-1.272-.469-2.423-1.496-.897-.799-1.503-1.787-1.679-2.088-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.15-.175.2-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.633-.928-2.235-.244-.587-.492-.507-.677-.517l-.577-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508s1.078 2.909 1.229 3.11c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.721.23 1.378.197 1.897.12.578-.087 1.78-.727 2.031-1.43.25-.702.25-1.304.175-1.43-.075-.125-.276-.2-.577-.35z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.547 4.103 1.505 5.834L0 24l6.338-1.463C8.016 23.479 9.948 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.815 0-3.504-.492-4.961-1.349l-.356-.208-3.753.867.882-3.664-.229-.366C2.697 15.82 2.2 13.978 2.2 12 2.2 6.597 6.597 2.2 12 2.2s9.8 4.397 9.8 9.8c0 5.403-4.397 9.8-9.8 9.8z" />
                </svg>
              </a>

              {/* Facebook Icon */}
              <a
                href={footer.facebook_url || CONTACT.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="فيسبوك"
                title="صفحتنا على فيسبوك"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#1877F2] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── Column 2: Product Catalog (3 cols on lg, 6 cols on md) ── */}
          <div className="lg:col-span-3 space-y-3.5 text-start">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {categoriesCol.title}
            </h3>
            <ul className="space-y-2.5 text-xs text-surface-200/70">
              {categoriesCol.links.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Quick Navigation & Policies (4 cols on lg, 6 cols on md) ── */}
          <div className="lg:col-span-4 space-y-3.5 text-start">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {servicesCol.title}
            </h3>
            <ul className="space-y-2.5 text-xs text-surface-200/70">
              {servicesCol.links.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-surface-200/50">
          <p>© {new Date().getFullYear()} {footer.copyright_text || "بلو لاين (Blue Line). جميع الحقوق محفوظة."}</p>
          <div className="flex items-center gap-5 text-surface-200/60">
            <Link href="/privacy" className="hover:text-white transition-colors">
              سياسة الخصوصية
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              الشروط والأحكام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
