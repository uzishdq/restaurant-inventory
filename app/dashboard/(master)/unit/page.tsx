import { columnUnit } from "@/components/columns/column-unit";
import SectionCard from "@/components/section/section-card";
import TableDateWrapper from "@/components/table/table-wrapper";
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
      <SectionCard title="Total Units" value={units.data.length} Icon={Boxes} />
      <TableDateWrapper
        header="Units"
        description="A list of measurement units used to define how items are counted or measured, such as pcs, kg, or liters"
        searchBy="nameUnit"
        labelSearch="name"
        isFilterDate={false}
        filterDate=""
        data={units.data}
        columns={columnUnit}
      >
        <CreateUnitForm />
      </TableDateWrapper>
    </div>
  );
}
