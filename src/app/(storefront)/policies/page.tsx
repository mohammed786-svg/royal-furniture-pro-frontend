import {
  staticPageMetadata,
  StaticPageRoute,
} from "@/components/static/static-page-route";

export const metadata = staticPageMetadata("policies");
export default function Page() {
  return <StaticPageRoute slug="policies" />;
}
