import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SalonBook | Your Beauty, Your Time",
    template: "%s | SalonBook",
  },
  description:
    "Discover professional salon services, explore beauty treatments, and book your perfect appointment with SalonBook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Toaster position="top-center" richColors closeButton />
        {children}
      </body>
    </html>
  );
}
