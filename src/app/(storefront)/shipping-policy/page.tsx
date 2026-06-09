import {
  staticPageMetadata,
  StaticPageRoute,
} from "@/components/static/static-page-route";

export const metadata = staticPageMetadata("shipping-policy");
export default function Page() {
  return <StaticPageRoute slug="shipping-policy" />;
}
