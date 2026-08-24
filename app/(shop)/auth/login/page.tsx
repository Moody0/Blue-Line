import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const params = await searchParams;
  const redirectTo = params.redirect || "/account";

  // Instant server-side redirect if already authenticated (0ms delay)
  if (user) {
    redirect(redirectTo);
  }

  return (
    <div className="min-h-[65vh] flex items-center justify-center py-10 sm:py-16 px-4">
      <LoginForm redirectTo={redirectTo} />
    </div>
  );
}
