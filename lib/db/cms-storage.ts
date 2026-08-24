import fs from "fs/promises";
import path from "path";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SiteSettings, Coupon } from "@/types/ecommerce";

const SETTINGS_FILE_PATH = path.join(process.cwd(), "data", "site-settings.json");
const COUPONS_FILE_PATH = path.join(process.cwd(), "data", "coupons.json");

export async function readSiteSettingsStorage(): Promise<SiteSettings> {
  // 1. Try Supabase first
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("site_settings").select("*");
    if (!error && data && data.length > 0) {
      const settingsMap: Record<string, any> = {};
      data.forEach((row) => {
        settingsMap[row.key] = row.value;
      });
      return settingsMap as unknown as SiteSettings;
    }
  } catch {}

  // 2. Fallback to file storage
  try {
    const content = await fs.readFile(SETTINGS_FILE_PATH, "utf-8");
    return JSON.parse(content) as SiteSettings;
  } catch (e) {
    console.error("Error reading site settings file:", e);
    return {} as SiteSettings;
  }
}

export async function writeSiteSettingsStorage(
  key: keyof SiteSettings,
  value: any
): Promise<boolean> {
  let success = false;

  // 1. Try Supabase
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (!error) {
      success = true;
    }
  } catch {}

  // 2. Persist to local JSON file
  try {
    let currentSettings: Record<string, any> = {};
    try {
      const content = await fs.readFile(SETTINGS_FILE_PATH, "utf-8");
      currentSettings = JSON.parse(content);
    } catch {}

    currentSettings[key] = value;
    await fs.writeFile(SETTINGS_FILE_PATH, JSON.stringify(currentSettings, null, 2), "utf-8");
    success = true;
  } catch (err) {
    console.error("Error saving site settings to file:", err);
  }

  return success;
}

export async function readCouponsStorage(): Promise<Coupon[]> {
  // 1. Try Supabase
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data as Coupon[];
    }
  } catch {}

  // 2. Fallback to file storage
  try {
    const content = await fs.readFile(COUPONS_FILE_PATH, "utf-8");
    return JSON.parse(content) as Coupon[];
  } catch (e) {
    console.error("Error reading coupons file:", e);
    return [];
  }
}

export async function writeCouponsStorage(coupons: Coupon[]): Promise<boolean> {
  let success = false;

  // 1. Try Supabase for each coupon
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("coupons").upsert(coupons, { onConflict: "id" });
    if (!error) {
      success = true;
    }
  } catch {}

  // 2. Persist to local JSON file
  try {
    await fs.writeFile(COUPONS_FILE_PATH, JSON.stringify(coupons, null, 2), "utf-8");
    success = true;
  } catch (err) {
    console.error("Error saving coupons to file:", err);
  }

  return success;
}
