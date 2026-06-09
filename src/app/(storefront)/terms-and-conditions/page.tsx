import {
  staticPageMetadata,
  StaticPageRoute,
} from "@/components/static/static-page-route";

export const metadata = staticPageMetadata("terms-and-conditions");
export default function Page() {
  return <StaticPageRoute slug="terms-and-conditions" />;
}
