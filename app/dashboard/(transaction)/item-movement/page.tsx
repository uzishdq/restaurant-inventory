import { columnItemMovement } from "@/components/columns/column-item";
import TableDateWrapper from "@/components/table/table-wrapper";
import RenderError from "@/components/ui/render-error";
import { LABEL } from "@/lib/constant";
import { getItemsMovement } from "@/lib/server/data/data-item";

export default async function ItemMovementPage() {
  const [itemMovement] = await Promise.all([getItemsMovement()]);

  if (!itemMovement.ok || !itemMovement.data) {
    return RenderError(LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className="space-y-4">
      <TableDateWrapper
        header="Pergerakan Bahan Baku"
        description="Catatan semua aktivitas keluar-masuk dan perubahan stok bahan baku untuk memastikan inventaris tetap akurat dan terkendali"
        searchBy="nameItem"
        labelSearch="Nama"
        isFilterDate={true}
        filterDate="createdAt"
        data={itemMovement.data}
        columns={columnItemMovement}
      ></TableDateWrapper>
    </div>
  );
}
