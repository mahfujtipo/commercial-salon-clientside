"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/actions";
import { getErrorMessage } from "@/lib/api";

const MAX_SIZE = 5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  error?: string;
  shape?: "wide" | "round";
  label?: string;
}

// Uploads the chosen file to the Express API (which forwards it to ImgBB)
// and returns the hosted URL through onChange.
export default function ImageUploader({
  value,
  onChange,
  error,
  shape = "wide",
  label = "Upload image",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;

    if (!TYPES.includes(file.type)) {
      toast.error("Please choose a JPG, PNG, WEBP or GIF image.");
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error("Image must be 5 MB or smaller.");
      return;
    }

    setUploading(true);

    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success("Image uploaded successfully.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Image upload failed."));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const previewClass =
    shape === "round"
      ? "h-28 w-28 rounded-full"
      : "h-44 w-full rounded-xl sm:h-52";

  return (
    <div>
      <div
        className={`relative flex items-center justify-center overflow-hidden border-2 border-dashed bg-[#FFFCF8] ${previewClass} ${
          error ? "border-red-300" : "border-[#EDE4DC]"
        }`}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Preview" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1.5 px-4 text-center text-[#82736C]">
            <ImagePlus size={26} />
            <span className="text-xs">JPG, PNG, WEBP or GIF · max 5 MB</span>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/75">
            <Loader2 className="animate-spin text-[#A66C62]" size={28} />
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={TYPES.join(",")}
          className="hidden"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />

        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl border border-[#EDE4DC] bg-white px-4 py-2 text-sm font-semibold text-[#49342D] transition-colors hover:bg-[#F8F2ED] disabled:opacity-60"
        >
          <ImagePlus size={15} />
          {uploading ? "Uploading..." : value ? "Change image" : label}
        </button>

        {value && !uploading && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 size={14} /> Remove
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
