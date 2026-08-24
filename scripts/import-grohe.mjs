import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read .env.local
const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) {
    env[k.trim()] = v.join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase URL or Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Decode HTML entities
function decodeHtml(html) {
  if (!html) return '';
  return html
    .replace(/&#8211;/g, '–')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ');
}

// Generate URL slug from title/SKU
function createSlug(title, sku) {
  const cleanSku = (sku || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
  const cleanTitle = (title || '')
    .trim()
    .toLowerCase()
    .replace(/[^\u0621-\u064Aa-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60);
  return cleanSku ? `${cleanTitle}-${cleanSku}` : cleanTitle;
}

/**
 * Import a specific category or all categories
 * @param {string} categorySlug - e.g. "burial-objects" or "all"
 */
async function importCategory(categorySlug = 'burial-objects') {
  console.log(`\n======================================================`);
  console.log(`🚀 Starting GROHE Product Importer for: [${categorySlug}]`);
  console.log(`   Price Rule: Original Price minus 1,000 EGP (-1k)`);
  console.log(`======================================================\n`);

  // 1. Fetch categories from faster-grohe.com
  console.log('📦 Fetching categories list...');
  const catRes = await fetch('https://faster-grohe.com/wp-json/wc/store/v1/products/categories?per_page=100');
  const remoteCats = await catRes.json();

  // Find target category or all
  const targetCats = categorySlug === 'all'
    ? remoteCats
    : remoteCats.filter(c => c.slug === categorySlug);

  if (targetCats.length === 0) {
    console.error(`❌ Category "${categorySlug}" not found on faster-grohe.com!`);
    return;
  }

  // 2. Ensure Categories exist in Supabase
  const categoryMap = {}; // remote_slug -> supabase_uuid
  for (const rc of targetCats) {
    const cleanNameAr = decodeHtml(rc.name);
    const slug = rc.slug;

    // Check if category already exists in Supabase
    let { data: existingCat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (!existingCat) {
      const { data: newCat, error: catInsertErr } = await supabase
        .from('categories')
        .insert({
          name_ar: cleanNameAr,
          name_en: rc.name || cleanNameAr,
          slug: slug,
          image_url: rc.image?.src || null,
        })
        .select('id')
        .single();

      if (catInsertErr) {
        console.error(`Error inserting category ${slug}:`, catInsertErr.message);
      } else {
        categoryMap[slug] = newCat.id;
        console.log(`  ➕ Created Category: "${cleanNameAr}" (${slug})`);
      }
    } else {
      categoryMap[slug] = existingCat.id;
      console.log(`  ✓ Existing Category: "${cleanNameAr}" (${slug})`);
    }
  }

  // 3. Fetch products for target category
  for (const cat of targetCats) {
    console.log(`\n🔍 Fetching products for category: "${decodeHtml(cat.name)}" (${cat.slug}) ...`);
    
    let page = 1;
    let hasMore = true;
    let totalImported = 0;

    while (hasMore) {
      const url = `https://faster-grohe.com/wp-json/wc/store/v1/products?category=${cat.slug}&per_page=100&page=${page}`;
      const prodRes = await fetch(url);
      
      if (!prodRes.ok) {
        hasMore = false;
        break;
      }

      const products = await prodRes.json();
      if (!Array.isArray(products) || products.length === 0) {
        hasMore = false;
        break;
      }

      console.log(`  📥 Processing ${products.length} products on page ${page}...`);

      for (const p of products) {
        const rawTitle = decodeHtml(p.name);
        const sku = p.sku || `GROHE-${p.id}`;
        const slug = createSlug(rawTitle, sku);

        // Price Calculation with -1000 EGP rule
        const originalRegularPrice = parseFloat(p.prices.regular_price || p.prices.price) || 0;
        const originalSalePrice = p.on_sale && p.prices.sale_price ? parseFloat(p.prices.sale_price) : null;

        // Apply -1000 EGP discount
        const basePrice = Math.max(0, originalRegularPrice - 1000);
        const discountPrice = originalSalePrice ? Math.max(0, originalSalePrice - 1000) : null;

        // Collect all images
        const imageUrls = (p.images || []).map(img => img.src);
        const mainImage = imageUrls[0] || null;
        const technicalDrawing = imageUrls.find(url => url.includes('specs') || url.includes('dim')) || null;

        const categoryId = categoryMap[cat.slug] || null;

        // Check if product already exists by SKU
        const { data: existingProd } = await supabase
          .from('products')
          .select('id')
          .eq('sku', sku)
          .maybeSingle();

        let productId = existingProd?.id;

        if (!existingProd) {
          // Insert Product
          const { data: newProd, error: prodErr } = await supabase
            .from('products')
            .insert({
              title_ar: rawTitle,
              title_en: rawTitle,
              slug: slug,
              sku: sku,
              base_price: basePrice,
              discount_price: discountPrice,
              category_id: categoryId,
              description_ar: decodeHtml(p.description || p.short_description || ''),
              description_en: '',
              is_concealed: rawTitle.includes('دفن'),
              warranty_years: 5,
              technical_drawing_url: technicalDrawing,
              is_featured: true,
              is_active: true,
            })
            .select('id')
            .single();

          if (prodErr) {
            console.error(`    ❌ Error inserting product [${sku}]:`, prodErr.message);
            continue;
          }
          productId = newProd.id;
        } else {
          // Update Product Prices & Info
          await supabase
            .from('products')
            .update({
              title_ar: rawTitle,
              base_price: basePrice,
              discount_price: discountPrice,
              category_id: categoryId,
              technical_drawing_url: technicalDrawing,
            })
            .eq('id', productId);
        }

        // Insert / Update Default Variant with Multi-Images
        const { data: existingVariant } = await supabase
          .from('product_variants')
          .select('id')
          .eq('product_id', productId)
          .maybeSingle();

        if (!existingVariant) {
          await supabase.from('product_variants').insert({
            product_id: productId,
            finish_name: rawTitle.includes('كروم') ? 'كروم لامع' : (rawTitle.includes('أسود') ? 'أسود مط' : 'كروم أصلي'),
            finish_code: 'chrome',
            hex_color: '#D4D4D8',
            image_urls: imageUrls,
            stock_quantity: 15,
            is_default: true,
          });
        } else {
          await supabase
            .from('product_variants')
            .update({
              image_urls: imageUrls,
            })
            .eq('id', existingVariant.id);
        }

        totalImported++;
        console.log(`    ✅ [${sku}] ${rawTitle.slice(0, 45)}...`);
        console.log(`       💰 Was: ${originalRegularPrice} EGP ➔ Now: ${basePrice} EGP | Images: ${imageUrls.length}`);
      }

      page++;
    }

    console.log(`\n🎉 Completed category "${decodeHtml(cat.name)}"! Total products imported: ${totalImported}`);
  }

  console.log(`\n======================================================`);
  console.log(`✨ All operations completed successfully!`);
  console.log(`======================================================\n`);
}

// Execute for target category from command-line argument (e.g. node scripts/import-grohe.mjs burial-objects)
const targetCategory = process.argv[2] || 'burial-objects';
importCategory(targetCategory);
