import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Read .env.local manually
const envPath = path.resolve(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const [k, ...v] = line.split("=");
  if (k && v) {
    env[k.trim()] = v.join("=").trim().replace(/^["']|["']$/g, "");
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), variants:product_variants(*)")
    .or("sku.eq.13262000,slug.eq.13262000")
    .limit(1);

  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log("Found product:", JSON.stringify(data?.[0], null, 2));
}

test();
