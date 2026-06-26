import { TagFormPage } from "@/components/admin/catalog/tag-form-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditTagPage({ params }: PageProps) {
  const { id } = await params;
  return <TagFormPage mode="edit" tagId={id} />;
}
