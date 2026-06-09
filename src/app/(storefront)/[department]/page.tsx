import { notFound, redirect } from "next/navigation";
import { navCategories } from "@/lib/constants/home";
import {
  getDefaultCategorySlugForDepartment,
  toCategorySlug,
} from "@/lib/routes/category";
import { isReservedTopLevelSlug } from "@/lib/routes/reserved-slugs";

export const dynamicParams = false;

export function generateStaticParams() {
  return navCategories.map((label) => ({
    department: toCategorySlug(label),
  }));
}

type PageProps = {
  params: Promise<{ department: string }>;
};

export default async function DepartmentPage({ params }: PageProps) {
  const { department } = await params;

  if (isReservedTopLevelSlug(department)) {
    notFound();
  }

  const category = getDefaultCategorySlugForDepartment(department);
  redirect(`/${department}/${category}`);
}
