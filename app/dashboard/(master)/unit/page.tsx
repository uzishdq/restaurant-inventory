import { columnUnit } from "@/components/columns/column-unit";
import SectionCard from "@/components/section/section-card";
import TableDateWrapper from "@/components/table/table-wrapper";
import FormDialog from "@/components/ui/form-dialog";
import RenderError from "@/components/ui/render-error";
import { CreateUnitForm } from "@/components/unit/unit-form";
import { LABEL } from "@/lib/constant";
import { getUnits } from "@/lib/server/data/data-unit";
import { Boxes } from "lucide-react";

export default async function UnitPage() {
  const [units] = await Promise.all([getUnits()]);

  if (!units.ok || !units.data) {
    return RenderError(LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className=" space-y-4">
      <SectionCard title="Total Unit" value={units.data.length} Icon={Boxes} />
      <TableDateWrapper
        header="Unit"
        description="Daftar satuan pengukuran yang digunakan untuk menentukan bagaimana barang dihitung atau diukur, seperti pcs, kg, atau liter"
        searchBy="nameUnit"
        labelSearch="Nama"
        isFilterDate={false}
        filterDate=""
        data={units.data}
        columns={columnUnit}
      >
        <FormDialog type="create" title="Tambah Unit">
          <CreateUnitForm />
        </FormDialog>
      </TableDateWrapper>
    </div>
  );
}
