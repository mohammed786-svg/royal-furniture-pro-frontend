import { FloatingActions } from "@/components/home/floating-actions";
import { StorefrontFooter } from "@/components/layout/storefront-footer";
import { StorefrontHeader } from "@/components/layout/storefront-header";
import { StorefrontLoadingShell } from "@/components/layout/storefront-loading-shell";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white">
      <StorefrontHeader />
      <StorefrontLoadingShell>{children}</StorefrontLoadingShell>
      <StorefrontFooter />
      <FloatingActions />
    </div>
  );
}
