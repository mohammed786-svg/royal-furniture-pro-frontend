import {
  staticPageMetadata,
  StaticPageRoute,
} from "@/components/static/static-page-route";

export const metadata = staticPageMetadata("franchise");
export default function Page() {
  return <StaticPageRoute slug="franchise" />;
}
