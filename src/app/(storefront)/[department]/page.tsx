import { notFound } from "next/navigation";
import { DepartmentRedirect } from "@/components/category/department-redirect";
import { isReservedTopLevelSlug } from "@/lib/routes/reserved-slugs";

export const dynamicParams = true;

type PageProps = {
  params: Promise<{ department: string }>;
};

export default async function DepartmentPage({ params }: PageProps) {
  const { department } = await params;

  if (isReservedTopLevelSlug(department)) {
    notFound();
  }

  return <DepartmentRedirect department={department} />;
}
