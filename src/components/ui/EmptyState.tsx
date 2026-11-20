import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export default function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F8F2ED] text-[#A66C62]">
        {icon ?? <Inbox size={26} />}
      </div>
      <h3 className="text-base font-bold text-[#49342D]">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-6 text-[#82736C]">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
