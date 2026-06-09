import {
  staticPageMetadata,
  StaticPageRoute,
} from "@/components/static/static-page-route";

export const metadata = staticPageMetadata("contact");
export default function Page() {
  return <StaticPageRoute slug="contact" />;
}
