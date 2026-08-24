import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import * as fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env.local
const envPath = resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  const adminEmail = "admin@blueline-eg.com";
  const adminPassword = "AdminPassword123!";
  const adminName = "admin";

  console.log(`Checking if user ${adminEmail} exists...`);

  const { data: usersData } = await supabase.auth.admin.listUsers();
  const existingUser = usersData?.users?.find(
    (u) => u.email?.toLowerCase() === adminEmail.toLowerCase()
  );

  let userId;

  if (existingUser) {
    console.log(`User found (ID: ${existingUser.id}). Updating password and metadata...`);
    userId = existingUser.id;
    await supabase.auth.admin.updateUserById(userId, {
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: "admin",
        is_admin: true,
        role: "ADMIN",
      },
      app_metadata: {
        is_admin: true,
        role: "ADMIN",
      },
    });
  } else {
    console.log(`Creating new admin user: ${adminEmail}...`);
    const { data: createData } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: "admin",
        is_admin: true,
        role: "ADMIN",
      },
      app_metadata: {
        is_admin: true,
        role: "ADMIN",
      },
    });
    userId = createData.user.id;
  }

  // Ensure record exists in public.customers table
  const { error: customerError } = await supabase.from("customers").upsert({
    id: userId,
    email: adminEmail,
    full_name: "admin",
    phone: "01203007686",
  });

  if (customerError) {
    console.warn("Notice for public.customers upsert:", customerError.message);
  } else {
    console.log("Customer table profile verified!");
  }

  console.log("\n==========================================");
  console.log(" ADMIN CREDENTIALS CREATED & ACTIVE:");
  console.log(` Email / Identifier : ${adminEmail}`);
  console.log(` Username           : ${adminName}`);
  console.log(` Password           : ${adminPassword}`);
  console.log("==========================================\n");
}

main();
