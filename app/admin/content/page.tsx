import type { Metadata } from "next";
import { getSiteSettings } from "@/actions/settings";
import { CmsContentView } from "@/components/admin/cms-content-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "إدارة المحتوى والصفحات (CMS) | Blue Line Admin",
  description: "التحكم في لافتات الصفحة الرئيسية، ركائز الثقة، نصوص الضمان، والسياسات.",
};

export default async function AdminContentPage() {
  const settings = await getSiteSettings();

  return <CmsContentView initialSettings={settings} />;
}
