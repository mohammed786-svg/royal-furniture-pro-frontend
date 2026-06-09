import {
  staticPageMetadata,
  StaticPageRoute,
} from "@/components/static/static-page-route";

export const metadata = staticPageMetadata("faqs");
export default function Page() {
  return <StaticPageRoute slug="faqs" />;
}
