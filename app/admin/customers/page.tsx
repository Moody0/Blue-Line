import type { Metadata } from "next";
import { getAdminCustomers } from "@/actions/customers";
import { CustomersDataTable } from "@/components/admin/customers-data-table";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "دليل العملاء وعلاقات المشترين (CRM) | Blue Line Admin",
  description: "سجلات العملاء، القيمة الدائمة LTV، والتواصل المباشر عبر واتساب.",
};

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return <CustomersDataTable initialCustomers={customers} />;
}
