"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { isValidEmail, isValidPhoneNumber, normalizePhoneNumber } from "@/lib/validation";
import type { Customer } from "@/types/ecommerce";

/** Translates raw Supabase error messages into clear, friendly Arabic */
function formatAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials") || lower.includes("invalid credentials")) {
    return "اسم المستخدم / البريد الإلكتروني أو كلمة المرور غير صحيحة.";
  }
  if (lower.includes("user already registered") || lower.includes("already registered")) {
    return "هذا الحساب أو البريد الإلكتروني مسجل بالفعل، يرجى تسجيل الدخول بدلاً من ذلك.";
  }
  if (lower.includes("password should be at least")) {
    return "يجب أن تتكون كلمة المرور من ٦ أحرف على الأقل.";
  }
  if (lower.includes("email not confirmed")) {
    return "يرجى تأكيد بريدك الإلكتروني من خلال الرابط المرسل إليك.";
  }
  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "محاولات كثيرة جداً، يرجى الانتظار قليلاً والمحاولة مرة أخرى.";
  }
  return message || "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.";
}

/** Server Action: Sign in with Username or Email & Password */
export async function signIn(formData: FormData) {
  const rawIdentifier = (formData.get("identifier") || formData.get("email") || "") as string;
  const identifier = rawIdentifier.trim();
  const password = (formData.get("password") as string) || "";
  const redirectTo = (formData.get("redirectTo") as string) || "/account";

  if (!identifier || !password) {
    return { error: "يرجى إدخال اسم المستخدم أو البريد الإلكتروني وكلمة المرور." };
  }

  let emailToUse = identifier;

  try {
    const supabase = await createClient();

    // If identifier is NOT an email, look it up by username in public.customers
    if (!identifier.includes("@")) {
      const { data: customer } = await supabase
        .from("customers")
        .select("email")
        .ilike("full_name", identifier)
        .limit(1)
        .maybeSingle();

      if (customer?.email) {
        emailToUse = customer.email;
      }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: emailToUse.toLowerCase(),
      password,
    });

    if (error) {
      return { error: formatAuthError(error.message) };
    }
  } catch (err: any) {
    if (isRedirectError(err)) throw err;
    return { error: formatAuthError(err?.message || "") };
  }

  redirect(redirectTo);
}

/** Server Action: Sign up new user with Username, Email, Phone & Password Confirmation */
export async function signUp(formData: FormData) {
  const username = ((formData.get("fullName") || formData.get("username") || "") as string).trim();
  const email = ((formData.get("email") || "") as string).trim().toLowerCase();
  const rawPhone = ((formData.get("phone") || "") as string).trim();
  const password = (formData.get("password") as string) || "";
  const confirmPassword = (formData.get("confirmPassword") as string) || "";
  const redirectTo = (formData.get("redirectTo") as string) || "/account";

  // 1. Mandatory Field Validation
  if (!username) {
    return { error: "يرجى إدخال اسم المستخدم." };
  }

  if (username.length < 2 || username.length > 60) {
    return { error: "يجب أن يتراوح طول اسم المستخدم بين ٢ و ٦٠ حرفاً." };
  }

  // 2. Strict Email Validation
  if (!email || !isValidEmail(email)) {
    return { error: "البريد الإلكتروني غير صحيح، يرجى إدخال بريد إلكتروني صالح." };
  }

  // 3. Strict Phone validation (must be valid Egyptian or international mobile)
  let cleanedPhone: string | null = null;
  if (rawPhone) {
    if (!isValidPhoneNumber(rawPhone)) {
      return {
        error: "رقم الهاتف غير صحيح، يرجى إدخال رقم هاتف صالح.",
      };
    }
    cleanedPhone = normalizePhoneNumber(rawPhone);
  }

  // 4. Password Validation & Matching
  if (!password || password.length < 6) {
    return { error: "يجب أن تتكون كلمة المرور من ٦ أحرف على الأقل." };
  }

  if (confirmPassword && password !== confirmPassword) {
    return { error: "كلمتا المرور غير متطابقتين، يرجى إعادة التأكيد." };
  }

  try {
    const supabase = await createClient();

    // 5. Pre-check: Ensure Username is unique
    const { data: existingUser } = await supabase
      .from("customers")
      .select("id")
      .ilike("full_name", username)
      .limit(1)
      .maybeSingle();

    if (existingUser) {
      return { error: "اسم المستخدم هذا مسجل بالفعل، يرجى اختيار اسم مستخدم آخر." };
    }

    // 6. Pre-check: Ensure Email is unique in customers table
    const { data: existingEmail } = await supabase
      .from("customers")
      .select("id")
      .eq("email", email)
      .limit(1)
      .maybeSingle();

    if (existingEmail) {
      return { error: "البريد الإلكتروني هذا مسجل بالفعل، يرجى تسجيل الدخول بدلاً من ذلك." };
    }

    // 7. Pre-check: Ensure Phone Number is unique if provided
    if (cleanedPhone) {
      const { data: existingPhone } = await supabase
        .from("customers")
        .select("id")
        .eq("phone", cleanedPhone)
        .limit(1)
        .maybeSingle();

      if (existingPhone) {
        return { error: "رقم الهاتف هذا مسجل بالفعل بحساب آخر." };
      }
    }

    // 8. Register User in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: username,
          phone: cleanedPhone,
        },
      },
    });

    if (error) {
      console.error("Supabase signUp error:", error.message);
      return { error: formatAuthError(error.message) };
    }

    // 9. Synchronize profile in public.customers
    if (data.user) {
      await supabase.from("customers").upsert({
        id: data.user.id,
        email,
        full_name: username,
        phone: cleanedPhone,
      });

      // Ensure user session cookie is fully established immediately
      if (!data.session) {
        await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }
    }
  } catch (err: any) {
    if (isRedirectError(err)) throw err;
    return { error: formatAuthError(err?.message || "") };
  }

  redirect(redirectTo);
}

/** Server Action: Sign out current user */
export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore error and continue redirect
  }

  redirect("/auth/login");
}

/** Server Action: Get currently authenticated user */
export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

/** Server Action: Get customer profile with orders and address details */
export async function getCustomerProfile(): Promise<Customer | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: customer } = await supabase
      .from("customers")
      .select("*")
      .eq("id", user.id)
      .single();

    if (customer) {
      return customer as Customer;
    }

    // Fallback if record was not created by trigger
    return {
      id: user.id,
      email: user.email || "",
      full_name: user.user_metadata?.full_name || "عميل بلو لاين",
      phone: user.user_metadata?.phone || null,
      address_line_1: null,
      address_line_2: null,
      city: null,
      governorate: null,
      postal_code: null,
      created_at: user.created_at,
    };
  } catch {
    return null;
  }
}

/** Server Action: Update Customer Profile */
export async function updateCustomerProfile(formData: FormData) {
  const fullName = (formData.get("fullName") as string)?.trim();
  const rawPhone = (formData.get("phone") as string)?.trim();

  if (rawPhone && !isValidPhoneNumber(rawPhone)) {
    return { error: "رقم الهاتف غير صحيح، يرجى إدخال رقم هاتف صالح." };
  }

  const phone = rawPhone ? normalizePhoneNumber(rawPhone) : null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "يرجى تسجيل الدخول أولاً." };
    }

    const { error } = await supabase
      .from("customers")
      .update({
        full_name: fullName,
        phone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      return { error: "فشل حفظ التعديلات." };
    }

    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "حدث خطأ أثناء التحديث." };
  }
}
