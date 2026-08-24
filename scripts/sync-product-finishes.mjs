import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) env[k.trim()] = v.join('=').trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function detectFinish(title = '', sku = '') {
  const t = (title + ' ' + sku).toLowerCase();

  if (t.includes('فانتوم') || t.includes('اسود') || t.includes('أسود') || t.includes('بلاك') || t.includes('kf') || t.includes('2433')) {
    return { name: 'أسود فانتوم مطفي', code: 'phantom-black', hex: '#18181B' };
  }
  if (t.includes('روز جولد') || t.includes('روزجولد') || t.includes('da') || t.includes('dl') || t.includes('sunset')) {
    return { name: 'روز جولد فاخر', code: 'rose-gold', hex: '#B45309' };
  }
  if (t.includes('ذهب') || t.includes('ذهبي') || t.includes('gl') || t.includes('gn') || t.includes('sunrise')) {
    return { name: 'ذهبي مصقول', code: 'polished-gold', hex: '#EAB308' };
  }
  if (t.includes('جرافيت') || t.includes('غرافيت') || t.includes('graphite') || t.includes('al') || t.includes('a0')) {
    return { name: 'جرافيت معماري', code: 'hard-graphite', hex: '#3F3F46' };
  }
  if (t.includes('نيكل مط') || t.includes('سوبر ستيل') || t.includes('supersteel') || t.includes('dc') || t.includes('en')) {
    return { name: 'نيكل سوبر ستيل', code: 'super-steel', hex: '#71717A' };
  }
  if (t.includes('ابيض') || t.includes('أبيض') || t.includes('white') || t.includes('il')) {
    return { name: 'أبيض سيراميكي', code: 'pure-white', hex: '#FAFAFA' };
  }
  if (t.includes('نحاس') || t.includes('نحاسي')) {
    return { name: 'نحاس طبيعي', code: 'brass', hex: '#D97706' };
  }

  // Default: Classic GROHE StarLight Chrome
  return { name: 'كروم لامع StarLight', code: 'chrome', hex: '#D4D4D8' };
}

async function syncAllProductFinishesFast() {
  console.log('🎨 Starting Fast Batch Color & Finish Sync...');

  const { data: products } = await supabase
    .from('products')
    .select('id, sku, title_ar');

  console.log(`Found ${products.length} products to synchronize.`);

  // Process in chunks of 50
  const chunkSize = 50;
  let updated = 0;

  for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(async (p) => {
        const finish = detectFinish(p.title_ar, p.sku);
        return supabase
          .from('product_variants')
          .update({
            finish_name: finish.name,
            finish_code: finish.code,
            hex_color: finish.hex,
          })
          .eq('product_id', p.id);
      })
    );
    updated += chunk.length;
    console.log(`  ✓ Updated ${updated} / ${products.length} products...`);
  }

  console.log(`\n🎉 All ${updated} products synchronized with exact GROHE finishes & hex colors!`);
}

syncAllProductFinishesFast();
