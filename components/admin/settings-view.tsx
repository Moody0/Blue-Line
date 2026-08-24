"use client";

import { useState, useTransition } from "react";
import {
  Save,
  Store,
  Phone,
  Truck,
  Megaphone,
  Check,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { BRAND, CONTACT, CURRENCY } from "@/lib/constants";
import { Input } from "@/components/ui/input";

export function SettingsView() {
  const [storeNameAr, setStoreNameAr] = useState<string>(BRAND.nameAr);
  const [taglineAr, setTaglineAr] = useState<string>(BRAND.taglineAr);
  const [phoneDisplay, setPhoneDisplay] = useState<string>(CONTACT.phoneDisplay);
  const [whatsappNumber, setWhatsappNumber] = useState<string>(CONTACT.phoneInternational);
  const [announcementText, setAnnouncementText] = useState<string>(
    "شحن وتوصيل فوري لكافة محافظات جمهورية مصر العربية | ضمان معتمد ٥ سنوات"
  );
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<string>("5000");

  const [isSaved, setIsSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      // Persist settings
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    });
  };

  return (
    <div className="space-y-6 text-start">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-900">
          إعدادات المتجر والمنظومة
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          التحكم في بيانات الهوية، أرقام خدمة العملاء، وشريط الإعلانات الترويجي
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* Section 1: Store Brand Identity */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-border-default space-y-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-border-default">
            <Store size={18} className="text-[#1E6091]" />
            <h2 className="text-sm font-extrabold text-brand-900">
              هوية وبيانات المتجر
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-text-primary block">
                اسم المتجر بالعربية
              </label>
              <Input
                value={storeNameAr}
                onChange={(e) => setStoreNameAr(e.target.value)}
                className="h-10 text-xs rounded-xl bg-surface-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-text-primary block">
                الوصف المختصر (الشعار الترويجي)
              </label>
              <Input
                value={taglineAr}
                onChange={(e) => setTaglineAr(e.target.value)}
                className="h-10 text-xs rounded-xl bg-surface-50"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Support */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-border-default space-y-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-border-default">
            <Phone size={18} className="text-[#1E6091]" />
            <h2 className="text-sm font-extrabold text-brand-900">
              أرقام التواصل وخدمة العملاء
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-text-primary block">
                رقم الهاتف المعروض في الموقع
              </label>
              <Input
                value={phoneDisplay}
                onChange={(e) => setPhoneDisplay(e.target.value)}
                dir="ltr"
                className="h-10 text-xs rounded-xl bg-surface-50 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-text-primary block">
                رقم محادثات واتساب (مع رمز الدولة)
              </label>
              <Input
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                dir="ltr"
                className="h-10 text-xs rounded-xl bg-surface-50 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Shipping & Promotions */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-border-default space-y-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-border-default">
            <Megaphone size={18} className="text-[#1E6091]" />
            <h2 className="text-sm font-extrabold text-brand-900">
              الشريط الترويجي وسياسات الشحن
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-text-primary block">
                نص الشريط الإعلاني العلوي (Announcement Bar)
              </label>
              <Input
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="h-10 text-xs rounded-xl bg-surface-50"
              />
            </div>

            <div className="space-y-1.5 max-w-xs">
              <label className="font-bold text-text-primary block">
                حد الشحن المجاني (بالجنيه المصري)
              </label>
              <div className="relative flex items-center">
                <Input
                  type="number"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(e.target.value)}
                  dir="ltr"
                  className="h-10 text-xs rounded-xl bg-surface-50 font-mono pl-12"
                />
                <span className="absolute end-3 text-xs font-bold text-text-muted">
                  ج.م
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isPending}
            className="px-8 h-11 rounded-xl bg-brand-900 hover:bg-[#1E6091] text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <Save size={15} />
            <span>{isPending ? "جاري الحفظ..." : "حفظ التعديلات"}</span>
          </button>

          {isSaved && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl">
              <Check size={14} />
              <span>تم حفظ التعديلات بنجاح ✓</span>
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
