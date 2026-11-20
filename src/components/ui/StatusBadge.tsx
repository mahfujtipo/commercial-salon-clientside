const tones: Record<string, string> = {
  // appointment
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  confirmed: "bg-sky-50 text-sky-700 ring-sky-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
  // payment / transaction
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  unpaid: "bg-orange-50 text-orange-700 ring-orange-200",
  failed: "bg-red-50 text-red-700 ring-red-200",
  // service / user
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  inactive: "bg-stone-100 text-stone-600 ring-stone-200",
  blocked: "bg-red-50 text-red-700 ring-red-200",
};

export default function StatusBadge({ status }: { status: string }) {
  const tone = tones[status] ?? "bg-stone-100 text-stone-600 ring-stone-200";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${tone}`}
    >
      {status}
    </span>
  );
}
