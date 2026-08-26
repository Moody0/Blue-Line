"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, ChevronDown, ArrowLeft } from "lucide-react";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";
import type { FooterContent, FooterColumn } from "@/types/ecommerce";

interface FooterClientProps {
  footer: FooterContent;
  categoriesCol: FooterColumn;
  servicesCol: FooterColumn;
  whatsappUrl: string;
}

export function FooterClient({
  footer,
  categoriesCol,
  servicesCol,
  whatsappUrl,
}: FooterClientProps) {
  // Mobile accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    storeInfo: false,
    categories: true, // open first by default on mobile for immediate discovery
    services: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-8">
      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. MOBILE ACCORDION VIEW (< md screens)                    */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="block md:hidden space-y-0 divide-y divide-white/10 text-start">
        {/* Section 1: Store Information / Brand & Contact */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggleSection("storeInfo")}
            className="w-full flex items-center justify-between py-1 text-sm font-bold text-white tracking-wide cursor-pointer focus:outline-none"
            aria-expanded={openSections.storeInfo}
          >
            <span>معلومات المتجر والتواصل</span>
            <ChevronDown
              size={18}
              className={cn(
                "text-surface-200/60 transition-transform duration-300 transform",
                openSections.storeInfo ? "rotate-180 text-white" : ""
              )}
            />
          </button>

          <div
            className={cn(
              "grid transition-all duration-300 ease-in-out",
              openSections.storeInfo
                ? "grid-rows-[1fr] opacity-100 pt-3.5"
                : "grid-rows-[0fr] opacity-0 pointer-events-none"
            )}
          >
            <div className="overflow-hidden space-y-3.5">
              <Logo variant="light" size="sm" />
              <p className="text-xs text-surface-200/70 leading-relaxed">
                {footer.about_text}
              </p>

              <div className="flex items-center gap-2 text-xs text-surface-200/90 pt-1">
                <Phone size={13} className="text-[#1E6091] shrink-0" />
                <span>{footer.phone_label || "هاتف ومبيعات:"}</span>
                <a
                  href={`tel:${footer.phone_international || footer.phone_display}`}
                  dir="ltr"
                  className="font-plus-jakarta font-bold text-white hover:text-accent-300"
                >
                  {footer.phone_display}
                </a>
              </div>

              {/* Social Media Icons on Mobile */}
              <div className="pt-2 flex items-center gap-2.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="واتساب"
                  title="تواصل عبر واتساب"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#25D366] text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.677.15-.2.301-.777.98-1.028 1.256-.25.276-.501.301-.802.15-.301-.15-1.272-.469-2.423-1.496-.897-.799-1.503-1.787-1.679-2.088-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.15-.175.2-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.633-.928-2.235-.244-.587-.492-.507-.677-.517l-.577-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508s1.078 2.909 1.229 3.11c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.721.23 1.378.197 1.897.12.578-.087 1.78-.727 2.031-1.43.25-.702.25-1.304.175-1.43-.075-.125-.276-.2-.577-.35z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.547 4.103 1.505 5.834L0 24l6.338-1.463C8.016 23.479 9.948 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.815 0-3.504-.492-4.961-1.349l-.356-.208-3.753.867.882-3.664-.229-.366C2.697 15.82 2.2 13.978 2.2 12 2.2 6.597 6.597 2.2 12 2.2s9.8 4.397 9.8 9.8c0 5.403-4.397 9.8-9.8 9.8z" />
                  </svg>
                </a>

                <a
                  href={footer.facebook_url || "https://facebook.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="فيسبوك"
                  title="صفحتنا على فيسبوك"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#1877F2] text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Categories / Quick Links */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggleSection("categories")}
            className="w-full flex items-center justify-between py-1 text-sm font-bold text-white tracking-wide cursor-pointer focus:outline-none"
            aria-expanded={openSections.categories}
          >
            <span>{categoriesCol.title || "أقسام المنتجات"}</span>
            <ChevronDown
              size={18}
              className={cn(
                "text-surface-200/60 transition-transform duration-300 transform",
                openSections.categories ? "rotate-180 text-white" : ""
              )}
            />
          </button>

          <div
            className={cn(
              "grid transition-all duration-300 ease-in-out",
              openSections.categories
                ? "grid-rows-[1fr] opacity-100 pt-3"
                : "grid-rows-[0fr] opacity-0 pointer-events-none"
            )}
          >
            <div className="overflow-hidden">
              <ul className="space-y-2.5 text-xs text-surface-200/80">
                {categoriesCol.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 py-0.5 hover:text-white transition-colors"
                    >
                      <ArrowLeft size={12} className="text-surface-200/40 shrink-0" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Services & Policies */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggleSection("services")}
            className="w-full flex items-center justify-between py-1 text-sm font-bold text-white tracking-wide cursor-pointer focus:outline-none"
            aria-expanded={openSections.services}
          >
            <span>{servicesCol.title || "خدمات وضمانات"}</span>
            <ChevronDown
              size={18}
              className={cn(
                "text-surface-200/60 transition-transform duration-300 transform",
                openSections.services ? "rotate-180 text-white" : ""
              )}
            />
          </button>

          <div
            className={cn(
              "grid transition-all duration-300 ease-in-out",
              openSections.services
                ? "grid-rows-[1fr] opacity-100 pt-3"
                : "grid-rows-[0fr] opacity-0 pointer-events-none"
            )}
          >
            <div className="overflow-hidden">
              <ul className="space-y-2.5 text-xs text-surface-200/80">
                {servicesCol.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 py-0.5 hover:text-white transition-colors"
                    >
                      <ArrowLeft size={12} className="text-surface-200/40 shrink-0" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. DESKTOP & TABLET MULTI-COLUMN GRID (≥ md screens)      */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 items-start text-start">
        {/* Column 1: Brand & Contact Info (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <Logo variant="light" size="md" />

          <p className="text-xs text-surface-200/70 leading-relaxed max-w-sm">
            {footer.about_text}
          </p>

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

          {/* Social Icons */}
          <div className="pt-2 flex items-center gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="واتساب"
              title="تواصل عبر واتساب"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#25D366] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.677.15-.2.301-.777.98-1.028 1.256-.25.276-.501.301-.802.15-.301-.15-1.272-.469-2.423-1.496-.897-.799-1.503-1.787-1.679-2.088-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.15-.175.2-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.633-.928-2.235-.244-.587-.492-.507-.677-.517l-.577-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508s1.078 2.909 1.229 3.11c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.721.23 1.378.197 1.897.12.578-.087 1.78-.727 2.031-1.43.25-.702.25-1.304.175-1.43-.075-.125-.276-.2-.577-.35z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.547 4.103 1.505 5.834L0 24l6.338-1.463C8.016 23.479 9.948 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.815 0-3.504-.492-4.961-1.349l-.356-.208-3.753.867.882-3.664-.229-.366C2.697 15.82 2.2 13.978 2.2 12 2.2 6.597 6.597 2.2 12 2.2s9.8 4.397 9.8 9.8c0 5.403-4.397 9.8-9.8 9.8z" />
              </svg>
            </a>

            <a
              href={footer.facebook_url || "https://facebook.com"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="فيسبوك"
              title="صفحتنا على فيسبوك"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#1877F2] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Product Catalog (3 cols on lg) */}
        <div className="lg:col-span-3 space-y-3.5">
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

        {/* Column 3: Services & Policies (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-3.5">
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
    </div>
  );
}
