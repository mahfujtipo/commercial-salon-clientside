import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Public site shell: Navbar + Footer.
// The dashboard lives outside this route group so it can use its own layout.
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
