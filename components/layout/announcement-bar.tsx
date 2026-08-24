import Link from "next/link";
import { getSiteSettings } from "@/actions/settings";

export async function AnnouncementBar() {
  const settings = await getSiteSettings();
  const bar = settings.announcement_bar || {
    text: "شحن وتوصيل لكافة أنحاء الجمهورية. سياسة استبدال واسترجاع ١٤ يوماً. شحن مجاني للطلبات فوق ٥,٠٠٠ ج.م.",
    is_active: true,
    badge_text: "",
    link_url: "/category/mixers-basins",
    free_shipping_threshold: 5000,
  };

  if (!bar.is_active) {
    return null;
  }

  const displayText =
    bar.text ||
    `شحن وتوصيل لكافة أنحاء الجمهورية. سياسة استبدال واسترجاع ١٤ يوماً. شحن مجاني للطلبات فوق ${bar.free_shipping_threshold?.toLocaleString("ar-EG") || "٥٬٠٠٠"} ج.م.`;

  return (
    <aside
      aria-label="شريط الإعلانات الترويجي"
      className="bg-[#1E293B] text-white text-xs sm:text-[13px] font-medium border-b border-slate-700/50 select-none font-alexandria tracking-wide"
    >
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-center text-center">
        {bar.link_url ? (
          <Link
            href={bar.link_url}
            className="text-slate-100 hover:text-white transition-colors duration-200 hover:underline inline-block leading-relaxed"
          >
            {displayText}
          </Link>
        ) : (
          <p className="text-slate-100 leading-relaxed">{displayText}</p>
        )}
      </div>
    </aside>
  );
}
