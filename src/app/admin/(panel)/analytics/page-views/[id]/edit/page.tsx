import { PageViewFormPage } from "@/components/admin/analytics/page-view-form-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function PageViewEditRoute({ params }: PageProps) {
  const { id } = await params;
  return <PageViewFormPage mode="edit" pageViewId={id} />;
}
