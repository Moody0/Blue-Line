import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export const metadata: Metadata = {
  title: "لوحة التحكم والإدارة | Blue Line Admin",
  description: "إدارة تشكيلات المنتجات، التشطيبات، والطلبات لمتجر بلو لاين للأدوات الصحية.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/admin");
  }

  const hasAdminRole =
    user.user_metadata?.is_admin === true ||
    user.app_metadata?.is_admin === true ||
    user.user_metadata?.role === "ADMIN" ||
    user.app_metadata?.role === "ADMIN" ||
    user.email?.toLowerCase().endsWith("@blueline-eg.com") ||
    user.email?.toLowerCase() === "admin@blueline-eg.com";

  if (!hasAdminRole) {
    redirect("/account");
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-alexandria" dir="rtl">
      {/* Fixed Sticky Sidebar on the right in RTL */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
