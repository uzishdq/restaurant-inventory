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
        header="Item Movement"
        description="Incoming ingredients or supplies received from vendors to keep your inventory accurate and up to date"
        searchBy="nameItem"
        labelSearch="name Item"
        isFilterDate={true}
        filterDate="createdAt"
        data={itemMovement.data}
        columns={columnItemMovement}
      ></TableDateWrapper>
    </div>
  );
}
