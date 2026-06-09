import {
  staticPageMetadata,
  StaticPageRoute,
} from "@/components/static/static-page-route";

export const metadata = staticPageMetadata("privacy-policy");
export default function Page() {
  return <StaticPageRoute slug="privacy-policy" />;
}
