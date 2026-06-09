import {
  staticPageMetadata,
  StaticPageRoute,
} from "@/components/static/static-page-route";

export const metadata = staticPageMetadata("media");
export default function Page() {
  return <StaticPageRoute slug="media" />;
}
