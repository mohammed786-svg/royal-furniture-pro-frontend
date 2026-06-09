import {
  staticPageMetadata,
  StaticPageRoute,
} from "@/components/static/static-page-route";

export const metadata = staticPageMetadata("return-policy");
export default function Page() {
  return <StaticPageRoute slug="return-policy" />;
}
