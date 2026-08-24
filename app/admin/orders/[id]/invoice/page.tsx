import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAdminOrderById } from "@/actions/admin";
import { PrintableInvoiceView } from "@/components/admin/printable-invoice-view";

export const dynamic = "force-dynamic";

interface AdminOrderInvoicePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AdminOrderInvoicePageProps): Promise<Metadata> {
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) {
    return { title: "الفاتورة غير موجودة | Blue Line Admin" };
  }

  return {
    title: `فاتورة طلب ${order.order_number} | Blue Line Admin`,
  };
}

export default async function AdminOrderInvoicePage({
  params,
}: AdminOrderInvoicePageProps) {
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) {
    notFound();
  }

  return <PrintableInvoiceView order={order} />;
}
