import { CreateCategoryForm } from "@/components/category/category-form";
import { columnCategory } from "@/components/columns/column-category";
import SectionCard from "@/components/section/section-card";
import TableDateWrapper from "@/components/table/table-wrapper";
import FormDialog from "@/components/ui/form-dialog";
import RenderError from "@/components/ui/render-error";
import { LABEL } from "@/lib/constant";
import { getCategory } from "@/lib/server/data/data-category";
import { Blocks } from "lucide-react";

export default async function CategoryPage() {
  const [category] = await Promise.all([getCategory()]);

  if (!category.ok || !category.data) {
    return RenderError(LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className=" space-y-4">
      <SectionCard
        title="Total Category"
        value={category.data.length}
        Icon={Blocks}
      />
      <TableDateWrapper
        header="Category"
        description="A collection of item categories used to organize products by type, such as vegetables, meat, or spices"
        searchBy="nameCategory"
        labelSearch="name"
        isFilterDate={false}
        filterDate=""
        data={category.data}
        columns={columnCategory}
      >
        <FormDialog type="create" title="Create Category">
          <CreateCategoryForm />
        </FormDialog>
      </TableDateWrapper>
    </div>
  );
}
