"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Lock, User, ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { signIn } from "@/actions/auth";
import { Button } from "@/components/ui/button";

interface LoginFormProps {
  redirectTo: string;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    const formData = new FormData(e.currentTarget);
    formData.set("redirectTo", redirectTo);

    startTransition(async () => {
      const result = await signIn(formData);
      if (result?.error) {
        setErrorMessage(result.error);
      }
    });
  };

  return (
    <div className="w-full max-w-[440px] mx-auto space-y-6 font-alexandria" dir="rtl">
      {/* Main Luxury Auth Card */}
      <div className="bg-white rounded-2xl border border-border-default/90 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Card Header & Switcher */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h1 className="text-xl font-extrabold text-brand-900">
              تسجيل الدخول
            </h1>
            <p className="text-xs text-text-muted">
              أدخل بيانات حسابك للمتابعة وإدارة طلباتك وعناوينك
            </p>
          </div>

          {/* Segmented Auth Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-surface-100 rounded-xl text-xs font-bold text-text-muted border border-border-default/60">
            <span className="py-2 rounded-lg bg-white text-brand-900 shadow-2xs text-center font-bold">
              تسجيل الدخول
            </span>
            <Link
              href={`/auth/register${redirectTo !== "/account" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
              className="py-2 rounded-lg hover:text-brand-900 text-center transition-colors font-medium"
            >
              إنشاء حساب جديد
            </Link>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold leading-relaxed animate-in fade-in duration-200 text-right">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="redirectTo" value={redirectTo} />

          {/* Username or Email */}
          <div className="space-y-1.5 text-right">
            <label className="text-[11px] font-bold text-text-primary block text-right">
              اسم المستخدم أو البريد الإلكتروني
            </label>
            <div className="relative flex items-center">
              <User
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
              <input
                name="identifier"
                type="text"
                required
                autoComplete="username"
                placeholder="اسم المستخدم أو name@example.com"
                dir="rtl"
                className="w-full h-11 pr-10 pl-3.5 rounded-xl bg-surface-50 border border-border-default text-xs text-brand-900 text-right focus:bg-white focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/15 transition-all outline-none"
              />
            </div>
          </div>

          {/* Password */}
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
                autoComplete="current-password"
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
            className="w-full h-11 bg-brand-900 hover:bg-[#1E6091] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer mt-2"
          >
            <span>{isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}</span>
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
