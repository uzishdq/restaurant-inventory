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
        title="Total Kategori"
        value={category.data.length}
        Icon={Blocks}
      />
      <TableDateWrapper
        header="Kategori"
        description="Koleksi kategori barang yang digunakan untuk mengatur produk berdasarkan jenis, seperti sayuran, daging, atau rempah"
        searchBy="nameCategory"
        labelSearch="Nama"
        isFilterDate={false}
        filterDate=""
        data={category.data}
        columns={columnCategory}
      >
        <FormDialog type="create" title="Tambah Kategori">
          <CreateCategoryForm />
        </FormDialog>
      </TableDateWrapper>
    </div>
  );
}
