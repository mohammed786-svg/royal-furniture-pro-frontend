import {
  staticPageMetadata,
  StaticPageRoute,
} from "@/components/static/static-page-route";

export const metadata = staticPageMetadata("customer-support");
export default function Page() {
  return <StaticPageRoute slug="customer-support" />;
}
