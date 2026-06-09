import {
  staticPageMetadata,
  StaticPageRoute,
} from "@/components/static/static-page-route";

export const metadata = staticPageMetadata("about");
export default function Page() {
  return <StaticPageRoute slug="about" />;
}
