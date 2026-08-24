import type { Metadata } from "next";
import { getAdminOrders } from "@/actions/admin";
import { OrdersDataTable } from "@/components/admin/orders-data-table";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "الطلبات والمبيعات | Blue Line Admin",
  description: "متابعة وإدارة مسار طلبيات الأدوات الصحية والسباكة المعمارية.",
};

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return <OrdersDataTable orders={orders} />;
}
