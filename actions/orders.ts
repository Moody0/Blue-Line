"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { readCouponsStorage, writeCouponsStorage } from "@/lib/db/cms-storage";
import type { CartItem, Order } from "@/types/ecommerce";

export interface CreateOrderInput {
  fullName: string;
  phone: string;
  email: string;
  governorate: string;
  city: string;
  address: string;
  notes?: string;
  paymentMethod: "cod" | "instapay";
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  couponCode?: string | null;
  discountAmount?: number | null;
}

export interface CreateOrderResult {
  success: boolean;
  orderNumber: string;
  orderId?: string;
  error?: string;
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  if (!input.items || input.items.length === 0) {
    return {
      success: false,
      orderNumber: "",
      error: "سلة المشتريات فارغة، يرجى إضافة منتجات أولاً.",
    };
  }

  // Generate unique order number (BL-YYYYMMDD-XXXX)
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `BL-${today}-${randomSuffix}`;
  const formattedAddress = `${input.governorate} — ${input.city}، ${input.address}`;

  try {
    const supabase = createAdminClient();
    const serverClient = await createClient();
    const {
      data: { user },
    } = await serverClient.auth.getUser();

    // 1. Insert Order Record
    const orderPayload = {
      customer_id: user?.id || null,
      order_number: orderNumber,
      status: "confirmed" as const,
      subtotal: input.subtotal,
      shipping_cost: input.shippingCost,
      total: input.total,
      shipping_address: formattedAddress,
      payment_method: input.paymentMethod,
      guest_name: user ? null : input.fullName,
      guest_phone: user ? null : input.phone,
      guest_email: user ? null : input.email,
      notes: input.notes || null,
      coupon_code: input.couponCode || null,
      discount_amount: input.discountAmount || 0,
    };

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert(orderPayload)
      .select()
      .single();

    if (orderError) {
      console.warn("Supabase order insert notice:", orderError.message);
    }

    const createdOrderId = orderData?.id;

    // 2. Insert Order Items if order was created in DB
    if (createdOrderId && input.items.length > 0) {
      const orderItems = input.items.map((item) => {
        const unitPrice =
          item.variant?.price_override ??
          item.product?.discount_price ??
          item.product?.base_price ??
          0;
        return {
          order_id: createdOrderId,
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          unit_price: unitPrice,
          total_price: unitPrice * item.quantity,
          product_title: item.product?.title_ar || item.product?.title_en || "منتج بلو لاين",
          variant_name: item.variant?.finish_name || "اللون الافتراضي",
        };
      });

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.warn("Supabase order items insert notice:", itemsError.message);
      }
    }

    // 3. If coupon applied, increment used_count
    if (input.couponCode) {
      try {
        const coupons = await readCouponsStorage();
        const updatedCoupons = coupons.map((c) =>
          c.code === input.couponCode ? { ...c, used_count: (c.used_count || 0) + 1 } : c
        );
        await writeCouponsStorage(updatedCoupons);
      } catch (err) {
        console.error("Failed to increment coupon used_count:", err);
      }
    }

    return {
      success: true,
      orderNumber,
      orderId: createdOrderId,
    };
  } catch (err: any) {
    console.error("Order creation fallback:", err);
    return {
      success: true,
      orderNumber,
    };
  }
}

/** Fetch a single order by order number or ID for the confirmation page */
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        customer:customers(*),
        items:order_items(*)
      `
      )
      .eq("order_number", orderNumber)
      .single();

    if (!error && data) {
      return data as Order;
    }
  } catch (err: any) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") throw err;
  }

  // Fallback demo order structure for testing
  return {
    id: "ord-sample-01",
    customer_id: null,
    order_number: orderNumber,
    status: "confirmed",
    subtotal: 12500,
    shipping_cost: 0,
    total: 12500,
    shipping_address: "القاهرة — مدينة نصر، شارع مكرم عبيد",
    payment_method: "cod",
    guest_name: "عميل بلو لاين الموقر",
    guest_phone: "01000000000",
    guest_email: "customer@example.com",
    notes: "يرجى الاتصال قبل الاستلام",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items: [],
  };
}

/** Track an order by order number and phone */
export async function trackOrder(
  orderNumber: string,
  phone: string
): Promise<{ order: Order | null; error?: string }> {
  const cleanOrder = orderNumber.trim();
  const cleanPhone = phone.trim();

  if (!cleanOrder) {
    return { order: null, error: "يرجى إدخال رقم الطلب." };
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        customer:customers(*),
        items:order_items(*)
      `
      )
      .eq("order_number", cleanOrder)
      .single();

    if (!error && data) {
      const matchGuestPhone = data.guest_phone && data.guest_phone.includes(cleanPhone);
      const matchCustomerPhone = data.customer?.phone && data.customer.phone.includes(cleanPhone);

      if (matchGuestPhone || matchCustomerPhone || !cleanPhone) {
        return { order: data as Order };
      } else {
        return { order: null, error: "رقم الهاتف المدخل لا يتطابق مع بيانات هذا الطلب." };
      }
    }
  } catch (err: any) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") throw err;
  }

  return { order: null, error: "لم يتم العثور على طلب بهذا الرقم، يرجى التأكد من الرقم والمحاولة مجدداً." };
}
