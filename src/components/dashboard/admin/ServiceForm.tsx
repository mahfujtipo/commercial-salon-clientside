"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createService, updateService } from "@/lib/actions";
import { ApiError, getErrorMessage } from "@/lib/api";
import { cardClass, inputClass } from "@/components/ui/styles";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";
import type { Service, ServiceStatus } from "@/types";

export const CATEGORY_SUGGESTIONS = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
];

export default function ServiceForm({ service }: { service?: Service }) {
  const router = useRouter();
  const isEdit = Boolean(service);

  const [serviceName, setServiceName] = useState(service?.serviceName ?? "");
  const [category, setCategory] = useState(service?.category ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [price, setPrice] = useState(service ? String(service.price) : "");
  const [duration, setDuration] = useState(service ? String(service.duration) : "");
  const [image, setImage] = useState(service?.image ?? "");
  const [status, setStatus] = useState<ServiceStatus>(service?.status ?? "active");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};

    if (serviceName.trim().length < 2) next.serviceName = "Service name is required (min 2 characters).";
    if (category.trim().length < 2) next.category = "Category is required.";
    if (description.trim().length < 10) next.description = "Description must be at least 10 characters.";

    const priceNumber = Number(price);
    if (!price || !Number.isFinite(priceNumber) || priceNumber <= 0) next.price = "Price must be a positive number.";

    const durationNumber = Number(duration);
    if (!duration || !Number.isInteger(durationNumber) || durationNumber <= 0) {
      next.duration = "Duration must be a positive whole number of minutes.";
    }

    if (!image) next.image = "Please upload a service image.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSaving(true);

    const payload = {
      serviceName: serviceName.trim(),
      category: category.trim(),
      description: description.trim(),
      price: Number(price),
      duration: Number(duration),
      image,
      status,
    };

    try {
      const result = service
        ? await updateService(service._id, payload)
        : await createService(payload);

      toast.success(result.message || "Service saved successfully.");
      router.push("/dashboard/services");
    } catch (error) {
      if (error instanceof ApiError && error.errors) setErrors(error.errors);
      toast.error(getErrorMessage(error, "Unable to save the service."));
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={`${cardClass} space-y-6 p-5 sm:p-7`}>
      <FormField label="Service image" error={errors.image} required>
        <ImageUploader value={image} onChange={setImage} error={errors.image} label="Upload service image" />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Service name" htmlFor="serviceName" error={errors.serviceName} required>
          <input id="serviceName" value={serviceName} onChange={(e) => setServiceName(e.target.value)} placeholder="e.g. Classic Haircut" className={inputClass} />
        </FormField>

        <FormField label="Service category" htmlFor="category" error={errors.category} required>
          <input id="category" list="category-suggestions" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Choose or type a category" className={inputClass} />
          <datalist id="category-suggestions">
            {CATEGORY_SUGGESTIONS.map((item) => <option key={item} value={item} />)}
          </datalist>
        </FormField>
      </div>

      <FormField label="Description" htmlFor="description" error={errors.description} required>
        <textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what is included in this service" className={inputClass} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="Price (USD)" htmlFor="price" error={errors.price} required>
          <input id="price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="45" className={inputClass} />
        </FormField>

        <FormField label="Duration (minutes)" htmlFor="duration" error={errors.duration} required>
          <input id="duration" type="number" min="1" step="1" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="60" className={inputClass} />
        </FormField>

        <FormField label="Status" htmlFor="status" error={errors.status}>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value as ServiceStatus)} className={inputClass}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </FormField>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-[#EDE4DC] pt-5 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={() => router.push("/dashboard/services")} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {saving ? "Saving..." : isEdit ? "Update service" : "Create service"}
        </Button>
      </div>
    </form>
  );
}
