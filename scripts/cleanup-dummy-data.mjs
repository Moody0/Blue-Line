import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) env[k.trim()] = v.join('=').trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function cleanupDummyData() {
  console.log('🧹 Cleaning up old placeholder / sample products (BL-%)...');

  // Delete all products with SKU starting with BL-
  const { data: deleted, error } = await supabase
    .from('products')
    .delete()
    .like('sku', 'BL-%')
    .select('sku, title_ar');

  if (error) {
    console.error('❌ Error deleting dummy products:', error.message);
  } else {
    console.log(`✅ Successfully removed ${deleted.length} dummy seed products:`);
    deleted.forEach(d => console.log(`   - [${d.sku}] ${d.title_ar}`));
  }

  // Count remaining products
  const { data: remaining, count } = await supabase
    .from('products')
    .select('sku, title_ar', { count: 'exact' });

  console.log(`\n📦 Remaining Real Products in Supabase: ${remaining.length}`);
  remaining.forEach(p => console.log(`   • [${p.sku}] ${p.title_ar}`));
}

cleanupDummyData();
