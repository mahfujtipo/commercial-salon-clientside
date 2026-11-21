"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { updateProfile } from "@/lib/actions";
import { ApiError, getErrorMessage } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { cardClass, inputClass } from "@/components/ui/styles";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";
import PageHeader from "./PageHeader";
import { useDashboardUser } from "./DashboardProvider";

const PHONE_PATTERN = /^\+?[\d\s-]{6,20}$/;

// Shared by Admin and Customer. Role and blocked status can never be edited here.
export default function ProfileForm() {
  const { user, refreshUser } = useDashboardUser();

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [image, setImage] = useState(user.image);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};

    if (name.trim().length < 2 || name.trim().length > 80) {
      next.name = "Name must be 2-80 characters.";
    }

    if (phone.trim() && !PHONE_PATTERN.test(phone.trim())) {
      next.phone = "Enter a valid phone number (digits, spaces, + or -).";
    }

    if (image.trim() && !/^https?:\/\/.+/i.test(image.trim())) {
      next.image = "Image must be an uploaded image or a valid http(s) URL.";
    }

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

    try {
      const result = await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        image: image.trim(),
      });

      // Keep the Better Auth session (navbar, header) in sync immediately
      await authClient.updateUser({
        name: result.data.name,
        image: result.data.image || undefined,
      });

      toast.success(result.message || "Profile updated successfully.");
      refreshUser();
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        setErrors(error.errors);
      }
      toast.error(getErrorMessage(error, "Unable to update your profile."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="My Profile" description="Update your basic information." />

      <div className="grid gap-6 lg:grid-cols-3">
        <aside className={`${cardClass} h-fit p-6 text-center`}>
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name} className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-[#F3EAE3]" />
          ) : (
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#F3EAE3] text-3xl font-bold text-[#A66C62]">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <h3 className="mt-4 text-lg font-bold text-[#49342D]">{user.name}</h3>
          <p className="break-all text-sm text-[#82736C]">{user.email}</p>
          <span className="mt-3 inline-flex rounded-full bg-[#EEDBD3] px-3 py-1 text-xs font-semibold capitalize text-[#6F4038]">
            {user.role} account
          </span>
          <p className="mt-4 text-xs text-[#82736C]">Member since {formatDate(user.createdAt)}</p>
        </aside>

        <form onSubmit={handleSubmit} noValidate className={`${cardClass} space-y-5 p-6 lg:col-span-2`}>
          <FormField label="Profile image" error={errors.image}>
            <ImageUploader value={image} onChange={setImage} shape="round" label="Upload photo" />
            <input
              type="url"
              value={image}
              onChange={(event) => setImage(event.target.value)}
              placeholder="...or paste an image URL"
              className={`${inputClass} mt-3`}
            />
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Full name" htmlFor="name" error={errors.name} required>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </FormField>

            <FormField label="Phone number" htmlFor="phone" error={errors.phone}>
              <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+880 1XXX-XXXXXX" className={inputClass} />
            </FormField>
          </div>

          <FormField label="Email" htmlFor="email" hint="Email cannot be changed here.">
            <input id="email" value={user.email} disabled className={inputClass} />
          </FormField>

          <div className="flex justify-end border-t border-[#EDE4DC] pt-5">
            <Button type="submit" loading={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
