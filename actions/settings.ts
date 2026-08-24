"use server";

import { revalidatePath } from "next/cache";
import {
  readSiteSettingsStorage,
  writeSiteSettingsStorage,
} from "@/lib/db/cms-storage";
import type { SiteSettings } from "@/types/ecommerce";

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    return await readSiteSettingsStorage();
  } catch (err) {
    console.error("Failed to get site settings:", err);
    return {} as SiteSettings;
  }
}

export async function updateSiteSettings<K extends keyof SiteSettings>(
  key: K,
  value: SiteSettings[K]
): Promise<{ success: boolean; error?: string }> {
  try {
    const success = await writeSiteSettingsStorage(key, value);

    // Revalidate all storefront pages that consume dynamic settings
    revalidatePath("/");
    revalidatePath("/admin/content");
    revalidatePath("/admin/settings");
    revalidatePath("/warranty");
    revalidatePath("/returns");
    revalidatePath("/shipping");
    revalidatePath("/privacy");
    revalidatePath("/terms");

    return { success };
  } catch (err: any) {
    console.error(`Failed to update site settings for key ${String(key)}:`, err);
    return { success: false, error: err?.message || "حدث خطأ أثناء حفظ الإعدادات" };
  }
}
