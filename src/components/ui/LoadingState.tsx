export function Spinner({ size = 36 }: { size?: number }) {
  return (
    <div
      className="animate-spin rounded-full border-4 border-[#EDE4DC] border-t-[#A66C62]"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}

export default function LoadingState({
  label = "Loading...",
  className = "py-20",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <Spinner />
      <p className="text-sm font-medium text-[#82736C]">{label}</p>
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-[#F3EAE3] ${className}`} />;
}
