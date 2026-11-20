"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Scissors,
  CheckCircle2,
  UserRound,
  Mail,
  Image as ImageIcon,
  LockKeyhole,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 2.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Email validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Optional profile image URL validation
  const isPhotoURLValid =
    photoURL.trim() === "" || /^https?:\/\/.+/i.test(photoURL.trim());

  // Password validation
  const isLengthValid = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);

  const isPasswordMatch = password.length > 0 && password === confirmPassword;

  const isFormValid =
    fullName.trim().length > 0 &&
    isEmailValid &&
    isPhotoURLValid &&
    isLengthValid &&
    hasUppercase &&
    hasLowercase &&
    isPasswordMatch &&
    agreeTerms;

  // Handle profile image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setSelectedImage(file);
    setPhotoURL("");

    toast.success("Profile image selected successfully.");
  };

  // Remove selected image
  const removeSelectedImage = () => {
    setSelectedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Upload image to ImgBB
  const uploadProfileImage = async (): Promise<string | undefined> => {
    if (!selectedImage) {
      return photoURL.trim() || undefined;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("ImgBB API key is missing. Check your environment file.");
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    setIsUploadingImage(true);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success || !result.data?.url) {
        throw new Error(
          result.error?.message || "Profile image upload failed.",
        );
      }

      return result.data.url;
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Email and password registration
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please complete all required fields correctly.");
      return;
    }

    if (isLoading || isGoogleLoading) return;

    setIsLoading(true);

    try {
      // Upload selected image first, if one exists
      const imageURL = await uploadProfileImage();

      await authClient.signUp.email(
        {
          name: fullName.trim(),
          email: email.trim(),
          password,
          image: imageURL,
        },
        {
          onRequest: () => {
            setIsLoading(true);
          },

          onSuccess: async () => {
            try {
              await authClient.signOut();
            } catch {
              // Registration may succeed without an active session.
            }

            setIsLoading(false);

            toast.success("Account created successfully!");

            setTimeout(() => {
              router.push("/login");
            }, 1200);
          },

          onError: (ctx) => {
            setIsLoading(false);

            toast.error(ctx.error.message || "Registration failed.");
          },
        },
      );
    } catch (error) {
      setIsLoading(false);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  // Google registration
  const handleGoogleSignUp = async () => {
    if (isGoogleLoading || isLoading) return;

    setIsGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      setIsGoogleLoading(false);

      toast.error(
        error instanceof Error
          ? error.message
          : "Google sign up failed. Please try again.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFCF8] px-4 pb-12 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[760px] max-w-6xl overflow-hidden rounded-[28px] border border-[#EDE4DC] bg-white shadow-[0_20px_70px_rgba(73,52,45,0.08)] lg:grid-cols-2">
        {/* Left: Brand Panel */}
        <section className="relative hidden min-h-[760px] overflow-hidden lg:flex lg:flex-col lg:justify-between">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=90')",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#30221E]/90 via-[#49342D]/50 to-[#49342D]/20" />

          <div className="relative z-10 p-12">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8B6A7] text-[#49342D]">
                <Scissors size={23} strokeWidth={1.8} />
              </span>

              <span className="text-2xl font-bold tracking-tight text-white">
                Salon<span className="text-[#E8B6A7]">Book.</span>
              </span>
            </Link>
          </div>

          <div className="relative z-10 max-w-lg px-12 pb-14">
            <span className="mb-5 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[2px] text-[#F4D6CB] backdrop-blur-sm">
              Join the SalonBook Community
            </span>

            <h1 className="font-serif text-4xl font-medium leading-[1.2] text-white xl:text-5xl">
              Your journey to better self-care starts here.
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/80">
              Create your account and discover professional salon services. Find
              treatments, request appointments, and manage your bookings in one
              place.
            </p>

            <div className="mt-9 space-y-4">
              {[
                "Explore a variety of salon services",
                "Request appointments online",
                "Manage your bookings in one place",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-white/90"
                >
                  <CheckCircle2 size={18} className="shrink-0 text-[#E8B6A7]" />
                  {item}
                </div>
              ))}
            </div>

            <p className="mt-14 text-xs text-white/60">
              © {new Date().getFullYear()} SalonBook. All rights reserved.
            </p>
          </div>
        </section>

        {/* Right: Registration Form */}
        <section className="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A66C62] text-white">
                  <Scissors size={21} />
                </span>

                <span className="text-2xl font-bold text-[#49342D]">
                  Salon<span className="text-[#A66C62]">Book.</span>
                </span>
              </Link>
            </div>

            <div className="mb-7">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[2.5px] text-[#A66C62]">
                Get Started
              </p>

              <h2 className="font-serif text-4xl font-medium tracking-tight text-[#49342D]">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#82736C]">
                Join SalonBook and make your next salon appointment easier.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#49342D]"
                >
                  Full Name
                </label>

                <div className="relative">
                  <UserRound
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A18F85]"
                  />

                  <input
                    id="fullName"
                    type="text"
                    required
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-[#EDE4DC] bg-[#FFFCF8] py-3.5 pl-11 pr-4 text-sm text-[#49342D] outline-none transition placeholder:text-[#B5A69E] focus:border-[#A66C62] focus:ring-2 focus:ring-[#A66C62]/10"
                  />
                </div>
              </div>

              {/* Profile Image */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#49342D]">
                  Profile Image
                  <span className="font-normal normal-case tracking-normal text-[#A18F85]">
                    (Optional)
                  </span>
                </label>

                {/* Image URL */}
                <div className="relative">
                  <ImageIcon
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A18F85]"
                  />

                  <input
                    id="photoURL"
                    type="url"
                    value={photoURL}
                    onChange={(e) => {
                      setPhotoURL(e.target.value);
                      setSelectedImage(null);

                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full rounded-xl border border-[#EDE4DC] bg-[#FFFCF8] py-3.5 pl-11 pr-4 text-sm text-[#49342D] outline-none transition placeholder:text-[#B5A69E] focus:border-[#A66C62] focus:ring-2 focus:ring-[#A66C62]/10"
                  />
                </div>

                {!isPhotoURLValid && (
                  <p className="mt-1.5 text-xs text-red-500">
                    Please enter a valid HTTP or HTTPS image URL.
                  </p>
                )}

                {/* Upload Divider */}
                <div className="my-3 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#EDE4DC]" />
                  <span className="text-[11px] text-[#A18F85]">
                    OR UPLOAD IMAGE
                  </span>
                  <div className="h-px flex-1 bg-[#EDE4DC]" />
                </div>

                {/* File Upload */}
                <label
                  htmlFor="profileImage"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#D8C9BF] bg-[#FFFCF8] px-4 py-4 text-sm font-medium text-[#A66C62] transition hover:border-[#A66C62] hover:bg-[#F8F4EF]"
                >
                  <Upload size={18} />
                  Choose Profile Image
                </label>

                <input
                  ref={fileInputRef}
                  id="profileImage"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {selectedImage && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#EDE4DC] bg-[#FFFCF8] p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-[#49342D]">
                        {selectedImage.name}
                      </p>
                      <p className="mt-1 text-[11px] text-[#82736C]">
                        {(selectedImage.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={removeSelectedImage}
                      aria-label="Remove selected image"
                      className="rounded-lg p-2 text-[#A18F85] transition hover:bg-[#F8F4EF] hover:text-red-500"
                    >
                      <X size={17} />
                    </button>
                  </div>
                )}

                <p className="mt-2 text-[11px] text-[#A18F85]">
                  JPG, PNG, WEBP or GIF. Maximum size 5 MB.
                </p>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#49342D]"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A18F85]"
                  />

                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-[#EDE4DC] bg-[#FFFCF8] py-3.5 pl-11 pr-4 text-sm text-[#49342D] outline-none transition placeholder:text-[#B5A69E] focus:border-[#A66C62] focus:ring-2 focus:ring-[#A66C62]/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#49342D]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A18F85]"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full rounded-xl border border-[#EDE4DC] bg-[#FFFCF8] py-3.5 pl-11 pr-12 text-sm text-[#49342D] outline-none transition placeholder:text-[#B5A69E] focus:border-[#A66C62] focus:ring-2 focus:ring-[#A66C62]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A18F85] hover:text-[#49342D]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
                  <p
                    className={`flex items-center gap-1.5 text-[11px] ${
                      isLengthValid ? "text-green-700" : "text-[#A18F85]"
                    }`}
                  >
                    <CheckCircle2 size={13} />
                    At least 6 characters
                  </p>

                  <p
                    className={`flex items-center gap-1.5 text-[11px] ${
                      hasUppercase ? "text-green-700" : "text-[#A18F85]"
                    }`}
                  >
                    <CheckCircle2 size={13} />
                    One uppercase letter
                  </p>

                  <p
                    className={`flex items-center gap-1.5 text-[11px] ${
                      hasLowercase ? "text-green-700" : "text-[#A18F85]"
                    }`}
                  >
                    <CheckCircle2 size={13} />
                    One lowercase letter
                  </p>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#49342D]"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A18F85]"
                  />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full rounded-xl border border-[#EDE4DC] bg-[#FFFCF8] py-3.5 pl-11 pr-12 text-sm text-[#49342D] outline-none transition placeholder:text-[#B5A69E] focus:border-[#A66C62] focus:ring-2 focus:ring-[#A66C62]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A18F85] hover:text-[#49342D]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {confirmPassword.length > 0 && !isPasswordMatch && (
                  <p className="mt-1.5 text-xs text-red-500">
                    Passwords do not match.
                  </p>
                )}
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[#D8C9BF] accent-[#A66C62]"
                />

                <span className="text-xs leading-5 text-[#82736C]">
                  I agree to the{" "}
                  <span className="font-semibold text-[#A66C62]">
                    Terms and Conditions
                  </span>{" "}
                  and Privacy Policy.
                </span>
              </label>

              {/* Register Button */}
              <button
                type="submit"
                disabled={
                  isLoading ||
                  isGoogleLoading ||
                  isUploadingImage ||
                  !isFormValid
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A66C62] px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-[#A66C62]/15 transition hover:-translate-y-0.5 hover:bg-[#8F584F] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploadingImage
                  ? "Uploading image..."
                  : isLoading
                    ? "Creating account..."
                    : "Create Account"}

                {!isLoading && !isUploadingImage && <ArrowRight size={17} />}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#EDE4DC]" />
              </div>

              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs text-[#A18F85]">
                  OR SIGN UP WITH
                </span>
              </div>
            </div>

            {/* Google Registration */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading || isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#EDE4DC] bg-white px-5 py-3.5 text-sm font-semibold text-[#49342D] transition hover:bg-[#FFFCF8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <GoogleIcon />

              {isGoogleLoading
                ? "Connecting to Google..."
                : "Continue with Google"}
            </button>

            {/* Login Link */}
            <p className="mt-7 text-center text-sm text-[#82736C]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#A66C62] transition hover:text-[#8F584F]"
              >
                Sign In
              </Link>
            </p>

            <p className="mt-5 text-center text-[11px] leading-5 text-[#A18F85]">
              By creating an account, you agree to SalonBook&apos;s terms and
              privacy policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
