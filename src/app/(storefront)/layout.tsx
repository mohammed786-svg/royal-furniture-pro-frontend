import { CommerceHydrator } from "@/components/commerce/commerce-hydrator";
import { FloatingActions } from "@/components/home/floating-actions";
import { StorefrontFooter } from "@/components/layout/storefront-footer";
import { StorefrontHeader } from "@/components/layout/storefront-header";
import { StorefrontLoadingShell } from "@/components/layout/storefront-loading-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { localBusinessSchema, organizationSchema, websiteSchema } from "@/config/seo";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={[organizationSchema(), localBusinessSchema(), websiteSchema()]} />
      <CommerceHydrator />
      <StorefrontHeader />
      <StorefrontLoadingShell>{children}</StorefrontLoadingShell>
      <StorefrontFooter />
      <FloatingActions />
    </div>
  );
}
