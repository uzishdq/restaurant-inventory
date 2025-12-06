import { columnSupplier } from "@/components/columns/column-supplier";
import SectionCard from "@/components/section/section-card";
import { CreateSupplierForm } from "@/components/supplier/supplier-form";
import TableDateWrapper from "@/components/table/table-wrapper";
import FormDialog from "@/components/ui/form-dialog";
import RenderError from "@/components/ui/render-error";
import { LABEL } from "@/lib/constant";
import { getSuppliers } from "@/lib/server/data/data-supplier";
import { Store } from "lucide-react";

export default async function SupplierPage() {
  const [suppliers] = await Promise.all([getSuppliers()]);

  if (!suppliers.ok || !suppliers.data) {
    return RenderError(LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className=" space-y-4">
      <SectionCard
        title="Total Supplier"
        value={suppliers.data.length}
        Icon={Store}
      />
      <TableDateWrapper
        header="Supplier"
        description="Berisi informasi tentang vendor atau supplier yang menyediakan bahan dan material untuk restoran"
        searchBy="nameSupplier"
        labelSearch="Nama"
        isFilterDate={false}
        filterDate=""
        data={suppliers.data}
        columns={columnSupplier}
      >
        <FormDialog type="create" title="Tambah Supplier">
          <CreateSupplierForm />
        </FormDialog>
      </TableDateWrapper>
    </div>
  );
}
