import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingState from "@/components/ui/LoadingState";

// Public site shell: Navbar + Footer.
// The dashboard lives outside this route group so it can use its own layout.
// The Suspense boundary lets dynamic routes (for example /services/[id]) stream in.
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<LoadingState className="min-h-[60vh]" />}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
