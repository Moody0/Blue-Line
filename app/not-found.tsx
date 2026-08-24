import Link from "next/link";
import { ArrowLeft, Home, PackageSearch } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-alexandria"
      dir="rtl"
    >
      <div className="w-20 h-20 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-6 shadow-2xs">
        <PackageSearch size={36} />
      </div>

      <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-2">
        Error 404
      </span>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
        عذراً، هذا القسم أو المنتج غير متوفر
      </h1>

      <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-8 leading-relaxed">
        ربما تم تعديل رابط الصفحة، أو تم إزالة القسم من إدارة الكتالوج. يمكنك العودة للصفحة الرئيسية واستكشاف باقي الأقسام النشطة.
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className={cn(
            buttonVariants({ size: "default" }),
            "bg-[#0B192C] hover:bg-[#1E6091] text-white rounded-xl text-xs font-bold flex items-center gap-2 h-11 px-6 shadow-xs transition-colors"
          )}
        >
          <Home size={15} />
          <span>العودة للرئيسية</span>
        </Link>

        <Link
          href="/search"
          className={cn(
            buttonVariants({ variant: "outline", size: "default" }),
            "rounded-xl text-xs font-bold flex items-center gap-2 h-11 px-6 border-slate-200 hover:bg-slate-50 transition-colors"
          )}
        >
          <span>تصفح المنتجات</span>
          <ArrowLeft size={14} />
        </Link>
      </div>
    </div>
  );
}
