import type { Metadata } from "next";
import { getAdminCoupons } from "@/actions/coupons";
import { CouponsDataTable } from "@/components/admin/coupons-data-table";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "كوبونات وقسائم الخصم | Blue Line Admin",
  description: "إدارة وإنشاء أكواد الخصم والعروض الترويجية لمتجر بلو لاين.",
};

export default async function AdminCouponsPage() {
  const coupons = await getAdminCoupons();

  return <CouponsDataTable initialCoupons={coupons} />;
}
