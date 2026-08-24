import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  titleEn: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive?: boolean;
    label?: string;
  };
  subtitle?: string;
  className?: string;
}

export function MetricCard({
  title,
  titleEn,
  value,
  icon: Icon,
  trend,
  subtitle,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-white border border-border-default p-6 shadow-xs relative overflow-hidden transition-all duration-200 hover:shadow-elevated",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-text-secondary">{title}</p>
          <span className="text-[10px] text-text-muted font-plus-jakarta uppercase tracking-wider">
            {titleEn}
          </span>
        </div>

        <div className="w-11 h-11 rounded-2xl bg-surface-50 border border-border-default flex items-center justify-center text-brand-900 shadow-2xs">
          <Icon size={20} className="text-accent-600" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-900 tracking-tight">
          {value}
        </h3>

        {trend && (
          <div
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold font-plus-jakarta",
              trend.isPositive !== false
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {trend.isPositive !== false ? (
              <TrendingUp size={12} />
            ) : (
              <TrendingDown size={12} />
            )}
            <span>+{trend.value}%</span>
          </div>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-text-muted border-t border-border-default pt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}
