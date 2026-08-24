import { getAdminCategories } from "@/actions/admin";
import { CategoriesDataTable } from "@/components/admin/categories-data-table";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return <CategoriesDataTable categories={categories} />;
}
