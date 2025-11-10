import ItemTable from "@/components/item/item-table";
import SectionCard from "@/components/section/section-card";
import RenderError from "@/components/ui/render-error";
import { LABEL } from "@/lib/constant";
import { getCategory } from "@/lib/server/data/data-category";
import { getItems } from "@/lib/server/data/data-item";
import { getUnits } from "@/lib/server/data/data-unit";
import { Package } from "lucide-react";

export default async function ItemsPage() {
  const [items, units, categorys] = await Promise.all([
    getItems(),
    getUnits(),
    getCategory(),
  ]);

  if (!items.ok || !items.data || !units.data || !categorys.data) {
    return RenderError(LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className=" space-y-4">
      <SectionCard
        title="Total Items"
        value={items.data.length}
        Icon={Package}
      />
      <ItemTable
        data={items.data}
        unit={units.data}
        category={categorys.data}
      />
    </div>
  );
}
