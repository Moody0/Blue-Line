import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, ArrowLeft, Shield } from "lucide-react";
import { getSiteSettings } from "@/actions/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | بلو لاين لأدوات السباكة",
  description: "سياسة حماية البيانات والخصوصية المتبعة في متجر بلو لاين للأدوات الصحية.",
};

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const privacy = settings.policies_content?.privacy || {
    title: "سياسة الخصوصية وأمان البيانات",
    subtitle: "التزام كامل بحماية وتشفير بياناتك الشخصية",
    content: "• نجمع فقط البيانات الضرورية لتنفيذ وتوصيل الطلبيات (الاسم، رقم الهاتف، العنوان، والبريد الإلكتروني).\n• لا يتم مشاركة أو بيع بياناتك لأي جهة خارجية عدا شركات الشحن الرسمية لإتمام التوصيل.\n• كافة المعاملات المالية ومعلومات الدفع مشفرة بأعلى بروتوكولات الأمان SSL.",
  };
  const contact = settings.store_contact || {
    phoneDisplay: "+20 100 000 0000",
    whatsapp: "201000000000",
  };

  return (
    <div className="min-h-[70vh] py-8 sm:py-14 font-alexandria" dir="rtl">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 space-y-8 text-start">
        {/* Breadcrumb Navigation */}
        <nav aria-label="مسار التصفح" className="flex items-center gap-2 text-xs text-text-muted">
          <Link href="/" className="hover:text-brand-900 transition-colors">
            الرئيسية
          </Link>
          <span>/</span>
          <span className="text-brand-900 font-bold">سياسة الخصوصية</span>
        </nav>

        {/* Page Header */}
        <div className="space-y-3 pb-6 border-b border-border-default">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-blue-50 text-[#1E6091] border border-blue-200/60 text-xs font-bold flex items-center gap-1.5">
              <Shield size={14} />
              <span>حماية وتشفير كامل</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-900 tracking-tight">
            {privacy.title}
          </h1>
          {privacy.subtitle && (
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
              {privacy.subtitle}
            </p>
          )}
        </div>

        {/* Policy Content */}
        <div className="space-y-6 text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-line bg-surface-50/50 p-6 sm:p-8 rounded-2xl border border-border-default">
          {privacy.content}
        </div>

        {/* Action Footer */}
        <div className="pt-6 border-t border-border-default flex flex-wrap items-center gap-4">
          <a
            href={`https://wa.me/${contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-900 hover:bg-[#1E6091] text-white text-xs font-bold transition-colors"
          >
            <MessageCircle size={15} />
            <span className="inline-flex items-center gap-1">
              <span>تواصل مع مسؤول الخصوصية</span>
              <span dir="ltr" className="font-mono">({contact.phoneDisplay})</span>
            </span>
          </a>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-100 hover:bg-surface-200 text-brand-900 text-xs font-bold transition-colors"
          >
            <span>تصفح المنتجات</span>
            <ArrowLeft size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
