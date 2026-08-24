import { FileText, ShieldCheck, CheckCircle2 } from "lucide-react";
import type { Product } from "@/types/ecommerce";

interface SpecTableProps {
  product: Product;
}

export function SpecTable({ product }: SpecTableProps) {
  const specs = [
    { label: "كود الموديل (SKU)", value: product.sku, isCode: true },
    { label: "الفئة والتصنيف", value: product.category?.name_ar || "أدوات صحية معمارية" },
    {
      label: "نوع التركيب الهندسي",
      value: product.is_concealed ? "تركيب مخفي داخل الجدار (Concealed)" : "تركيب ظاهر على السطح / الكاونتر",
    },
    {
      label: "فترة الضمان المعتمد",
      value: `${product.warranty_years} سنوات ضمان شامل ضد عيوب الصناعة`,
      highlight: true,
    },
    {
      label: "تقنية القلب والتحكم",
      value: "قلب سيراميكي ألماني عالي الدقة (Ceramic Cartridge) مانع للتسريب",
    },
    {
      label: "تقنية معالجة السطح",
      value: "طلاء PVD نانوي مقاوم للترسبات الكلسية والخدوش",
    },
    {
      label: "معايير الجودة والتصنيع",
      value: "مطابق للمواصفات القياسية الأوروبية (EN Standards)",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border-default overflow-hidden bg-white">
        <table className="w-full text-xs text-start border-collapse">
          <tbody>
            {specs.map((item, index) => (
              <tr
                key={item.label}
                className={
                  index % 2 === 0
                    ? "bg-surface-50/70 border-b border-border-default"
                    : "bg-white border-b border-border-default last:border-b-0"
                }
              >
                <td className="py-3.5 px-4 font-bold text-text-secondary w-1/3 sm:w-1/4">
                  {item.label}
                </td>
                <td className="py-3.5 px-4 text-text-primary font-medium">
                  {item.isCode ? (
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-200/60 text-brand-900 font-bold">
                      {item.value}
                    </span>
                  ) : item.highlight ? (
                    <span className="inline-flex items-center gap-1.5 text-accent-600 font-bold">
                      <ShieldCheck size={14} />
                      {item.value}
                    </span>
                  ) : (
                    <span>{item.value}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {product.technical_drawing_url && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 border border-border-default">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white border border-border-default text-accent-600">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-brand-900">
                المخطط الهندسي والكتالوج الفني
              </p>
              <p className="text-[11px] text-text-muted">
                أبعاد التركيب والمواصفات الميكانيكية بصيغة PDF
              </p>
            </div>
          </div>
          <a
            href={product.technical_drawing_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-accent-600 hover:text-accent-500 underline underline-offset-4"
          >
            تحميل المخطط
          </a>
        </div>
      )}
    </div>
  );
}
