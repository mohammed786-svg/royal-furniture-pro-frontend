import { CmsPageFormPage } from "@/components/admin/marketing/cms-page-form-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditCmsPage({ params }: PageProps) {
  const { id } = await params;
  return <CmsPageFormPage mode="edit" pageId={id} />;
}
