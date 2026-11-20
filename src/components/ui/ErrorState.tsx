import { AlertTriangle } from "lucide-react";
import Button from "./Button";

export default function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertTriangle size={26} />
      </div>
      <h3 className="text-base font-bold text-[#49342D]">Something went wrong</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-6 text-[#82736C]">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
