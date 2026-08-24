"use server";

import { createClient } from "@/lib/supabase/server";
import type { Category, Product, ProductFilterState } from "@/types/ecommerce";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/mock-data";

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_CATEGORIES;
    }
    return data;
  } catch {
    return MOCK_CATEGORIES;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), variants:product_variants(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_PRODUCTS.filter((p) => p.is_active);
    }
    return data;
  } catch {
    return MOCK_PRODUCTS.filter((p) => p.is_active);
  }
}

export async function getFeaturedProducts(limit = 12): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), variants:product_variants(*)")
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return MOCK_PRODUCTS.filter((p) => p.is_featured).slice(0, limit);
    }
    return data;
  } catch {
    return MOCK_PRODUCTS.filter((p) => p.is_featured).slice(0, limit);
  }
}

export async function getPopularProducts(limit = 10): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), variants:product_variants(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return MOCK_PRODUCTS.slice(0, limit);
    }
    return data;
  } catch {
    return MOCK_PRODUCTS.slice(0, limit);
  }
}

export async function getTopRatedProducts(limit = 10): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), variants:product_variants(*)")
      .eq("is_active", true)
      .order("base_price", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return MOCK_PRODUCTS.slice(0, limit);
    }
    return data;
  } catch {
    return MOCK_PRODUCTS.slice(0, limit);
  }
}

export async function getDealProducts(limit = 10): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), variants:product_variants(*)")
      .eq("is_active", true)
      .not("discount_price", "is", null)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return MOCK_PRODUCTS.filter((p) => p.discount_price !== null).slice(0, limit);
    }
    return data;
  } catch {
    return MOCK_PRODUCTS.filter((p) => p.discount_price !== null).slice(0, limit);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const decodedSlug = decodeURIComponent(slug);
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), variants:product_variants(*)")
      .or(`slug.eq."${slug}",slug.eq."${decodedSlug}",sku.eq."${slug}",sku.eq."${decodedSlug}"`)
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return (
        MOCK_PRODUCTS.find((p) => p.slug === slug || p.slug === decodedSlug) ??
        null
      );
    }
    return data;
  } catch {
    return (
      MOCK_PRODUCTS.find((p) => p.slug === slug || p.slug === decodedSlug) ??
      null
    );
  }
}

export async function getProductsByCategory(categorySlug: string): Promise<{
  category: Category | null;
  products: Product[];
}> {
  try {
    const categories = await getCategories();
    const decodedSlug = decodeURIComponent(categorySlug);
    const category =
      categories.find(
        (c) =>
          c.slug === categorySlug ||
          c.slug === decodedSlug ||
          decodeURIComponent(c.slug) === decodedSlug
      ) ?? null;

    if (!category) {
      return { category: null, products: [] };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), variants:product_variants(*)")
      .eq("category_id", category.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error || !data) {
      return { category, products: [] };
    }

    return { category, products: data };
  } catch {
    return { category: null, products: [] };
  }
}

export async function searchCatalog(query: string): Promise<Product[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), variants:product_variants(*)")
      .eq("is_active", true)
      .or(`title_ar.ilike.%${q}%,title_en.ilike.%${q}%,sku.ilike.%${q}%,description_ar.ilike.%${q}%`);

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch {}

  return MOCK_PRODUCTS.filter(
    (p) =>
      p.is_active &&
      (p.title_ar.toLowerCase().includes(q) ||
        p.title_en.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q))
  );
}

export async function getFilteredProducts(
  filter: ProductFilterState
): Promise<Product[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("products")
      .select("*, category:categories(*), variants:product_variants(*)")
      .eq("is_active", true);

    if (filter.categoryId) {
      query = query.eq("category_id", filter.categoryId);
    }
    if (filter.isConcealed !== undefined) {
      query = query.eq("is_concealed", filter.isConcealed);
    }
    if (filter.minPrice !== undefined) {
      query = query.gte("base_price", filter.minPrice);
    }
    if (filter.maxPrice !== undefined) {
      query = query.lte("base_price", filter.maxPrice);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return applyMockFilter(filter);
    }

    let products = data as Product[];

    if (filter.finishes && filter.finishes.length > 0) {
      products = products.filter((p) =>
        p.variants?.some((v) => filter.finishes!.includes(v.finish_code))
      );
    }

    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.title_en.toLowerCase().includes(q) ||
          p.title_ar.includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description_en.toLowerCase().includes(q) ||
          p.description_ar.includes(q)
      );
    }

    if (filter.sortBy) {
      products = sortProducts(products, filter.sortBy);
    }

    return products;
  } catch {
    return applyMockFilter(filter);
  }
}

function applyMockFilter(filter: ProductFilterState): Product[] {
  let products = [...MOCK_PRODUCTS].filter((p) => p.is_active);

  if (filter.categoryId) {
    products = products.filter((p) => p.category_id === filter.categoryId);
  }
  if (filter.isConcealed !== undefined) {
    products = products.filter((p) => p.is_concealed === filter.isConcealed);
  }
  if (filter.finishes && filter.finishes.length > 0) {
    products = products.filter((p) =>
      p.variants?.some((v) => filter.finishes!.includes(v.finish_code))
    );
  }
  if (filter.minPrice !== undefined) {
    products = products.filter(
      (p) => (p.discount_price ?? p.base_price) >= (filter.minPrice ?? 0)
    );
  }
  if (filter.maxPrice !== undefined) {
    products = products.filter(
      (p) => (p.discount_price ?? p.base_price) <= (filter.maxPrice ?? Infinity)
    );
  }
  if (filter.searchQuery) {
    const q = filter.searchQuery.toLowerCase();
    products = products.filter(
      (p) =>
        p.title_en.toLowerCase().includes(q) ||
        p.title_ar.includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.description_en.toLowerCase().includes(q) ||
        p.description_ar.includes(q)
    );
  }

  if (filter.sortBy) {
    products = sortProducts(products, filter.sortBy);
  }

  return products;
}

function sortProducts(
  products: Product[],
  sortBy: NonNullable<ProductFilterState["sortBy"]>
): Product[] {
  switch (sortBy) {
    case "price_asc":
      return products.sort(
        (a, b) =>
          (a.discount_price ?? a.base_price) - (b.discount_price ?? b.base_price)
      );
    case "price_desc":
      return products.sort(
        (a, b) =>
          (b.discount_price ?? b.base_price) - (a.discount_price ?? a.base_price)
      );
    case "newest":
      return products.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    case "featured":
      return products.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    default:
      return products;
  }
}
