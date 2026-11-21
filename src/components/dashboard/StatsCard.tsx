import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/LoadingState";

export default function StatsCard({
  label,
  value,
  icon: Icon,
  loading,
  tone = "rose",
}: {
  label: string;
  value?: number | string;
  icon: LucideIcon;
  loading?: boolean;
  tone?: "rose" | "amber" | "sky" | "emerald" | "red";
}) {
  const tones = {
    rose: "bg-[#F3E4DE] text-[#A66C62]",
    amber: "bg-amber-50 text-amber-600",
    sky: "bg-sky-50 text-sky-600",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#EDE4DC] bg-white p-5 shadow-[0_2px_12px_rgba(73,52,45,0.04)]">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon size={22} />
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-[#82736C]">{label}</p>
        {loading ? (
          <Skeleton className="mt-2 h-7 w-16" />
        ) : (
          <p className="mt-0.5 text-2xl font-bold text-[#49342D]">{value ?? 0}</p>
        )}
      </div>
    </div>
  );
}
