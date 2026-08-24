"use server";

import { revalidatePath } from "next/cache";
import { readCouponsStorage, writeCouponsStorage } from "@/lib/db/cms-storage";
import type {
  Coupon,
  CouponFormData,
  CouponValidationResult,
} from "@/types/ecommerce";

export async function getAdminCoupons(): Promise<Coupon[]> {
  try {
    return await readCouponsStorage();
  } catch (err) {
    console.error("Failed to get coupons:", err);
    return [];
  }
}

export async function upsertCoupon(
  formData: CouponFormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const coupons = await readCouponsStorage();
    const cleanCode = formData.code.trim().toUpperCase();

    if (!cleanCode) {
      return { success: false, error: "يرجى إدخال كود الكوبون." };
    }

    if (formData.discount_value <= 0) {
      return { success: false, error: "قيمة الخصم يجب أن تكون أكبر من الصفر." };
    }

    const isEdit = Boolean(formData.id);
    const couponId = formData.id || `coup-${Date.now()}`;

    // Check duplicate code
    const duplicate = coupons.find(
      (c) => c.code === cleanCode && c.id !== couponId
    );
    if (duplicate) {
      return { success: false, error: "كود الكوبون مستخدم مسبقاً، يرجى اختيار كود آخر." };
    }

    const updatedCoupon: Coupon = {
      id: couponId,
      code: cleanCode,
      discount_type: formData.discount_type,
      discount_value: Number(formData.discount_value),
      min_order_value: Number(formData.min_order_value || 0),
      max_discount_amount: formData.max_discount_amount
        ? Number(formData.max_discount_amount)
        : null,
      usage_limit: formData.usage_limit ? Number(formData.usage_limit) : null,
      used_count: isEdit ? coupons.find((c) => c.id === couponId)?.used_count || 0 : 0,
      expires_at: formData.expires_at || null,
      is_active: formData.is_active,
      created_at: isEdit
        ? coupons.find((c) => c.id === couponId)?.created_at || new Date().toISOString()
        : new Date().toISOString(),
    };

    let updatedList: Coupon[];
    if (isEdit) {
      updatedList = coupons.map((c) => (c.id === couponId ? updatedCoupon : c));
    } else {
      updatedList = [updatedCoupon, ...coupons];
    }

    const success = await writeCouponsStorage(updatedList);
    revalidatePath("/admin/coupons");
    revalidatePath("/checkout");

    return { success };
  } catch (err: any) {
    console.error("Failed to upsert coupon:", err);
    return { success: false, error: err?.message || "حدث خطأ أثناء حفظ الكوبون." };
  }
}

export async function toggleCouponStatus(
  couponId: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const coupons = await readCouponsStorage();
    const updatedList = coupons.map((c) =>
      c.id === couponId ? { ...c, is_active: isActive } : c
    );

    const success = await writeCouponsStorage(updatedList);
    revalidatePath("/admin/coupons");
    revalidatePath("/checkout");

    return { success };
  } catch (err: any) {
    console.error("Failed to toggle coupon status:", err);
    return { success: false, error: err?.message || "حدث خطأ أثناء تعديل حالة الكوبون." };
  }
}

export async function deleteCoupon(
  couponId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const coupons = await readCouponsStorage();
    const updatedList = coupons.filter((c) => c.id !== couponId);

    const success = await writeCouponsStorage(updatedList);
    revalidatePath("/admin/coupons");
    revalidatePath("/checkout");

    return { success };
  } catch (err: any) {
    console.error("Failed to delete coupon:", err);
    return { success: false, error: err?.message || "حدث خطأ أثناء حذف الكوبون." };
  }
}

export async function validateCouponCode(
  code: string,
  subtotal: number
): Promise<CouponValidationResult> {
  const cleanCode = code?.trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, discountAmount: 0, error: "يرجى إدخال كود الكوبون." };
  }

  try {
    const coupons = await readCouponsStorage();
    const coupon = coupons.find((c) => c.code === cleanCode);

    if (!coupon) {
      return { valid: false, discountAmount: 0, error: "كود الكوبون غير صحيح أو غير متوفر." };
    }

    if (!coupon.is_active) {
      return { valid: false, discountAmount: 0, error: "هذا الكوبون غير نشط حالياً." };
    }

    // Expiry check
    if (coupon.expires_at) {
      const expiryDate = new Date(coupon.expires_at).getTime();
      if (Date.now() > expiryDate) {
        return { valid: false, discountAmount: 0, error: "عذراً، انتهت صلاحية هذا الكوبون." };
      }
    }

    // Usage limit check
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return { valid: false, discountAmount: 0, error: "تم الوصول إلى الحد الأقصى لاستخدام هذا الكوبون." };
    }

    // Minimum order check
    if (coupon.min_order_value && subtotal < coupon.min_order_value) {
      return {
        valid: false,
        discountAmount: 0,
        error: `الحد الأدنى لقيمة الطلب لتفعيل هذا الكوبون هو ${coupon.min_order_value.toLocaleString("ar-EG")} ج.م.`,
      };
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discount_type === "percentage") {
      discountAmount = Math.round((subtotal * coupon.discount_value) / 100);
      if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
        discountAmount = coupon.max_discount_amount;
      }
    } else {
      discountAmount = Math.min(coupon.discount_value, subtotal);
    }

    return {
      valid: true,
      coupon,
      discountAmount,
    };
  } catch (err: any) {
    console.error("Coupon validation error:", err);
    return { valid: false, discountAmount: 0, error: "حدث خطأ أثناء فحص الكوبون." };
  }
}
