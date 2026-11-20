"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Scissors, CheckCircle2 } from "lucide-react";
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

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      await authClient.signIn.email(
        {
          email: email.trim(),
          password,
          rememberMe,
        },
        {
          onRequest: () => setIsLoading(true),
          onSuccess: () => {
            toast.success("Welcome back! Sign in successful.");

            setTimeout(() => {
              router.push("/");
              router.refresh();
            }, 1200);
          },
          onError: (ctx) => {
            setIsLoading(false);
            toast.error(ctx.error.message || "Unable to sign in.");
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

  const handleGoogleSignIn = async () => {
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
          : "Google sign in failed. Please try again.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFCF8] px-4 pb-12 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[680px] max-w-6xl overflow-hidden rounded-[28px] border border-[#EDE4DC] bg-white shadow-[0_20px_70px_rgba(73,52,45,0.08)] lg:grid-cols-2">
        {/* Left: Brand Panel */}
        <section className="relative hidden min-h-[680px] overflow-hidden lg:flex lg:flex-col lg:justify-between">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1400&q=90')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#30221E]/90 via-[#49342D]/45 to-[#49342D]/20" />

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
              Your Beauty, Your Moment
            </span>

            <h1 className="font-serif text-4xl font-medium leading-[1.2] text-white xl:text-5xl">
              A little time for yourself can make a beautiful difference.
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/80">
              Discover professional salon services, find the right treatment,
              and make your next appointment with ease.
            </p>

            <div className="mt-9 space-y-4">
              {[
                "Explore professional salon services",
                "Request appointments with ease",
                "Keep track of your bookings",
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

        {/* Right: Sign In Form */}
        <section className="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-14">
          <div className="w-full max-w-md">
            <div className="mb-9 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A66C62] text-white">
                  <Scissors size={21} />
                </span>
                <span className="text-2xl font-bold text-[#49342D]">
                  Salon<span className="text-[#A66C62]">Book.</span>
                </span>
              </Link>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[2.5px] text-[#A66C62]">
                Welcome Back
              </p>
              <h2 className="font-serif text-4xl font-medium tracking-tight text-[#49342D]">
                Sign in to SalonBook
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#82736C]">
                Welcome back! Sign in to manage your appointments and explore
                your beauty experience.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#49342D]"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[#EDE4DC] bg-[#FFFCF8] px-4 py-3.5 text-sm text-[#49342D] outline-none transition placeholder:text-[#B5A69E] focus:border-[#A66C62] focus:ring-2 focus:ring-[#A66C62]/10"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#49342D]"
                  >
                    Password
                  </label>
                  <span className="text-xs text-[#A66C62]">Secure sign in</span>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-[#EDE4DC] bg-[#FFFCF8] px-4 py-3.5 pr-12 text-sm text-[#49342D] outline-none transition placeholder:text-[#B5A69E] focus:border-[#A66C62] focus:ring-2 focus:ring-[#A66C62]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A18F85] transition hover:text-[#49342D]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-[#D8C9BF] accent-[#A66C62]"
                />
                <span className="text-xs text-[#82736C]">Remember me</span>
              </label>

              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A66C62] px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-[#A66C62]/15 transition hover:-translate-y-0.5 hover:bg-[#8F584F] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Signing in..." : "Sign In"}
                {!isLoading && <ArrowRight size={17} />}
              </button>
            </form>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#EDE4DC]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs text-[#A18F85]">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#EDE4DC] bg-white px-5 py-3.5 text-sm font-semibold text-[#49342D] transition hover:bg-[#FFFCF8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <GoogleIcon />
              {isGoogleLoading
                ? "Connecting to Google..."
                : "Continue with Google"}
            </button>

            <p className="mt-8 text-center text-sm text-[#82736C]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#A66C62] transition hover:text-[#8F584F]"
              >
                Create an account
              </Link>
            </p>

            <p className="mt-7 text-center text-[11px] leading-5 text-[#A18F85]">
              By continuing, you agree to use SalonBook responsibly and
              securely.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
