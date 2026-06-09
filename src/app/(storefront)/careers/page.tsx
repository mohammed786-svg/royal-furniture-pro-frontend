import {
  staticPageMetadata,
  StaticPageRoute,
} from "@/components/static/static-page-route";

export const metadata = staticPageMetadata("careers");
export default function Page() {
  return <StaticPageRoute slug="careers" />;
}
