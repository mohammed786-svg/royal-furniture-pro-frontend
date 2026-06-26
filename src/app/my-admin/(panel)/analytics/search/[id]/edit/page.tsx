import { SearchFormPage } from "@/components/admin/analytics/search-form-page";

type PageProps = { params: Promise<{ id: string }> };

export default async function SearchEditRoute({ params }: PageProps) {
  const { id } = await params;
  return <SearchFormPage mode="edit" searchId={id} />;
}
