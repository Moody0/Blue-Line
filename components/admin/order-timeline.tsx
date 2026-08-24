import { Check, Clock, PackageCheck, Truck, CheckCircle2, XCircle } from "lucide-react";
import type { OrderStatus } from "@/types/ecommerce";
import { cn } from "@/lib/utils";

interface OrderTimelineProps {
  status: OrderStatus;
}

const STEPS: { status: OrderStatus; labelAr: string; icon: any }[] = [
  { status: "pending", labelAr: "استلام الطلب", icon: Clock },
  { status: "confirmed", labelAr: "تأكيد الطلب", icon: Check },
  { status: "processing", labelAr: "التجهيز والتعبئة", icon: PackageCheck },
  { status: "shipped", labelAr: "جاري الشحن", icon: Truck },
  { status: "delivered", labelAr: "تم التسليم", icon: CheckCircle2 },
];

export function OrderTimeline({ status }: OrderTimelineProps) {
  if (status === "cancelled") {
    return (
      <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-center gap-2">
        <XCircle size={18} />
        <span>تم إلغاء هذا الطلب ولا يتم اتخاذ أي إجراءات شحن إضافية.</span>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex((s) => s.status === status);

  return (
    <div className="rounded-3xl bg-white border border-border-default p-6 space-y-4 shadow-xs">
      <h3 className="text-xs font-bold text-text-secondary">
        مراحل معالجة وتنفيذ الطلب
      </h3>

      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={step.status}
              className="flex sm:flex-col items-center gap-3 w-full sm:w-auto text-center"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center transition-all shrink-0",
                  isCompleted
                    ? "bg-brand-900 text-white shadow-xs"
                    : "bg-surface-100 text-text-muted border border-border-default",
                  isCurrent && "ring-4 ring-accent-600/20 bg-accent-600 text-white"
                )}
              >
                <Icon size={18} />
              </div>

              <div className="text-start sm:text-center">
                <p
                  className={cn(
                    "text-xs font-bold",
                    isCompleted ? "text-brand-900" : "text-text-muted"
                  )}
                >
                  {step.labelAr}
                </p>
                <span className="text-[10px] text-text-muted">
                  {isCurrent ? "المرحلة الحالية" : isCompleted ? "مكتملة" : "قيد الانتظار"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
