import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import * as fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Testing signInWithPassword for admin@blueline-eg.com...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "admin@blueline-eg.com",
    password: "AdminPassword123!",
  });

  if (error) {
    console.error("Login failed:", error.message);
    process.exit(1);
  }

  console.log("Login successful! User ID:", data.user.id);
  console.log("User email:", data.user.email);
  console.log("Metadata:", data.user.user_metadata);
}

test();
