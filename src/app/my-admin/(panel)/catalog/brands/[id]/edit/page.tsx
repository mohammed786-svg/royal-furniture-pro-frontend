import { BrandFormPage } from "@/components/admin/catalog/brand-form-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditBrandPage({ params }: PageProps) {
  const { id } = await params;
  return <BrandFormPage mode="edit" brandId={id} />;
}
