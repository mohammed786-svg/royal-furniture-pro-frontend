import {
  staticPageMetadata,
  StaticPageRoute,
} from "@/components/static/static-page-route";

export const metadata = staticPageMetadata("stores");
export default function Page() {
  return <StaticPageRoute slug="stores" />;
}
