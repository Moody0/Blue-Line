import Link from "next/link";
import { CONTACT } from "@/lib/constants";
import { getSiteSettings } from "@/actions/settings";
import { FooterClient } from "./footer-client";
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

  const categoriesCol =
    footer.column_categories?.links && footer.column_categories.links.length > 0
      ? footer.column_categories
      : DEFAULT_CATEGORIES_COLUMN;

  const servicesCol =
    footer.column_services?.links && footer.column_services.links.length > 0
      ? footer.column_services
      : DEFAULT_SERVICES_COLUMN;

  const whatsappUrl = `https://wa.me/${footer.whatsapp_number || "201000000000"}`;

  return (
    <footer
      className="bg-brand-900 text-white border-t border-brand-800 selection:bg-[#1E6091] selection:text-white font-alexandria"
      dir="rtl"
    >
      {/* ── Main Footer Container ── */}
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Client Interactive Accordions on Mobile + Multi-Column on Desktop */}
        <FooterClient
          footer={footer}
          categoriesCol={categoriesCol}
          servicesCol={servicesCol}
          whatsappUrl={whatsappUrl}
        />

        {/* ── Bottom Bar ── */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-surface-200/50">
          <p>
            © {new Date().getFullYear()}{" "}
            {footer.copyright_text || "بلو لاين (Blue Line). جميع الحقوق محفوظة."}
          </p>
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
