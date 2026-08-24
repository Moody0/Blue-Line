"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { CustomerListItem } from "@/types/ecommerce";

const SEED_CUSTOMERS: CustomerListItem[] = [
  {
    id: "cust-001",
    full_name: "م. شريف طارق",
    email: "sherif.t@example.com",
    phone: "01001234567",
    governorate: "القاهرة",
    city: "مصر الجديدة",
    total_orders: 4,
    lifetime_spent: 48600,
    last_order_date: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "cust-002",
    full_name: "د. هاني منصور",
    email: "dr.hani@example.com",
    phone: "01119876543",
    governorate: "الجيزة",
    city: "الشيخ زايد",
    total_orders: 3,
    lifetime_spent: 34200,
    last_order_date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "cust-003",
    full_name: "م. كريم الشناوي",
    email: "karim.elshinnawy@example.com",
    phone: "01223456789",
    governorate: "القاهرة",
    city: "التجمع الخامس",
    total_orders: 2,
    lifetime_spent: 21500,
    last_order_date: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "cust-004",
    full_name: "أحمد عبد الرحمن",
    email: "ahmed.abdelrahman@example.com",
    phone: "01098765432",
    governorate: "الإسكندرية",
    city: "سموحة",
    total_orders: 1,
    lifetime_spent: 8900,
    last_order_date: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "cust-005",
    full_name: "سارة محمود الخولي",
    email: "sara.kholy@example.com",
    phone: "01011223344",
    governorate: "القاهرة",
    city: "المعادي",
    total_orders: 2,
    lifetime_spent: 16800,
    last_order_date: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
  },
];

export async function getAdminCustomers(): Promise<CustomerListItem[]> {
  try {
    const supabase = createAdminClient();

    // 1. Fetch registered customers
    const { data: customersData, error: custError } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    // 2. Fetch orders to calculate totals
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("id, customer_id, guest_name, guest_phone, guest_email, shipping_address, total, created_at");

    if (!custError && customersData && customersData.length > 0) {
      const orders = ordersData || [];

      // Map registered customers
      const customerMap = new Map<string, CustomerListItem>();

      for (const cust of customersData) {
        const customerOrders = orders.filter((o) => o.customer_id === cust.id);
        const totalSpent = customerOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        const sortedOrders = [...customerOrders].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        customerMap.set(cust.id, {
          id: cust.id,
          full_name: cust.full_name || "عميل مسجل",
          email: cust.email,
          phone: cust.phone,
          governorate: cust.governorate || "القاهرة",
          city: cust.city,
          total_orders: customerOrders.length,
          lifetime_spent: totalSpent,
          last_order_date: sortedOrders[0]?.created_at || cust.created_at,
          created_at: cust.created_at,
        });
      }

      // Also extract unique guest buyers from orders that don't have customer_id
      for (const order of orders) {
        if (!order.customer_id && (order.guest_phone || order.guest_email)) {
          const guestKey = order.guest_phone || order.guest_email || order.id;
          if (!customerMap.has(guestKey)) {
            const guestOrders = orders.filter(
              (o) =>
                !o.customer_id &&
                ((order.guest_phone && o.guest_phone === order.guest_phone) ||
                  (order.guest_email && o.guest_email === order.guest_email))
            );

            const totalSpent = guestOrders.reduce((sum, o) => sum + (o.total || 0), 0);
            const sortedOrders = [...guestOrders].sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );

            customerMap.set(guestKey, {
              id: guestKey,
              full_name: order.guest_name || "زائر المتجر",
              email: order.guest_email || "",
              phone: order.guest_phone || null,
              governorate: order.shipping_address ? order.shipping_address.split("—")[0].trim() : "القاهرة",
              city: null,
              total_orders: guestOrders.length,
              lifetime_spent: totalSpent,
              last_order_date: sortedOrders[0]?.created_at || order.created_at,
              created_at: sortedOrders[sortedOrders.length - 1]?.created_at || order.created_at,
            });
          }
        }
      }

      const list = Array.from(customerMap.values());
      return list.sort((a, b) => b.lifetime_spent - a.lifetime_spent);
    }
  } catch (err: any) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") throw err;
    console.warn("Using seed customers fallback:", err?.message);
  }

  return SEED_CUSTOMERS;
}
