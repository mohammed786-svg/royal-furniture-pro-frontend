import {
  staticPageMetadata,
  StaticPageRoute,
} from "@/components/static/static-page-route";

export const metadata = staticPageMetadata("sitemap");
export default function Page() {
  return <StaticPageRoute slug="sitemap" />;
}
