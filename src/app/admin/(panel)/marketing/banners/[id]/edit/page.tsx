import { BannerFormPage } from "@/components/admin/marketing/banner-form-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditBannerPage({ params }: PageProps) {
  const { id } = await params;
  return <BannerFormPage mode="edit" bannerId={id} />;
}
