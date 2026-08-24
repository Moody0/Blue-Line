"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Lock, Mail, User, Phone, ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { signUp } from "@/actions/auth";
import { Button } from "@/components/ui/button";

interface RegisterFormProps {
  redirectTo: string;
}

export function RegisterForm({ redirectTo }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    const formData = new FormData(e.currentTarget);
    formData.set("redirectTo", redirectTo);

    const password = (formData.get("password") as string) || "";

    if (password.length < 6) {
      setErrorMessage("يجب أن تتكون كلمة المرور من ٦ أحرف على الأقل.");
      return;
    }

    startTransition(async () => {
      const result = await signUp(formData);
      if (result?.error) {
        setErrorMessage(result.error);
      }
    });
  };

  return (
    <div className="w-full max-w-[440px] mx-auto space-y-6 font-alexandria" dir="rtl">
      {/* Main Auth Card */}
      <div className="bg-white rounded-2xl border border-border-default/90 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Card Header & Switcher */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h1 className="text-xl font-extrabold text-brand-900">
              إنشاء حساب جديد
            </h1>
            <p className="text-xs text-text-muted">
              سجل حسابك لتسوق أسرع ومتابعة شحناتك وتخزين عناوينك
            </p>
          </div>

          {/* Segmented Auth Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-surface-100 rounded-xl text-xs font-bold text-text-muted border border-border-default/60">
            <Link
              href={`/auth/login${redirectTo !== "/account" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
              className="py-2 rounded-lg hover:text-brand-900 text-center transition-colors font-medium"
            >
              تسجيل الدخول
            </Link>
            <span className="py-2 rounded-lg bg-white text-brand-900 shadow-2xs text-center font-bold">
              إنشاء حساب جديد
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold leading-relaxed animate-in fade-in duration-200 text-right">
            {errorMessage}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <input type="hidden" name="redirectTo" value={redirectTo} />

          {/* Username */}
          <div className="space-y-1.5 text-right">
            <label className="text-[11px] font-bold text-text-primary block text-right">
              اسم المستخدم
            </label>
            <div className="relative flex items-center">
              <User
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
              <input
                name="username"
                type="text"
                required
                minLength={2}
                maxLength={60}
                autoComplete="name"
                placeholder="مثال: كريم الشناوي"
                dir="rtl"
                className="w-full h-11 pr-10 pl-3.5 rounded-xl bg-surface-50 border border-border-default text-xs text-brand-900 text-right focus:bg-white focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/15 transition-all outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5 text-right">
            <label className="text-[11px] font-bold text-text-primary block text-right">
              البريد الإلكتروني
            </label>
            <div className="relative flex items-center">
              <Mail
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@example.com"
                dir="rtl"
                className="w-full h-11 pr-10 pl-3.5 rounded-xl bg-surface-50 border border-border-default text-xs text-brand-900 text-right focus:bg-white focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/15 transition-all outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5 text-right">
            <label className="text-[11px] font-bold text-text-primary block text-right">
              رقم الهاتف
            </label>
            <div className="relative flex items-center">
              <Phone
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="01012345678"
                dir="rtl"
                className="w-full h-11 pr-10 pl-3.5 rounded-xl bg-surface-50 border border-border-default text-xs text-brand-900 text-right focus:bg-white focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/15 transition-all outline-none"
              />
            </div>
          </div>

          {/* Password (Single Clean Field) */}
          <div className="space-y-1.5 text-right">
            <label className="text-[11px] font-bold text-text-primary block text-right">
              كلمة المرور
            </label>
            <div className="relative flex items-center">
              <Lock
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="••••••••"
                dir="rtl"
                className="w-full h-11 pr-10 pl-10 rounded-xl bg-surface-50 border border-border-default text-xs text-brand-900 text-right focus:bg-white focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/15 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-brand-900 cursor-pointer transition-colors p-1"
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 bg-brand-900 hover:bg-[#1E6091] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer mt-3"
          >
            <span>{isPending ? "جاري إنشاء الحساب..." : "إنشاء الحساب والمتابعة"}</span>
            <ArrowLeft size={14} />
          </Button>
        </form>

        {/* Benefits Footer */}
        <div className="pt-4 border-t border-border-default/60 text-[11px] text-text-muted">
          <div className="flex items-center justify-center gap-4 text-text-secondary">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
              <span>ضمان أصلي معتمد</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
              <span>شحن وتوصيل لجميع المحافظات</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
