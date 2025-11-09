import ItemTable from "@/components/item/item-table";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Items</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {items.data.length}
          </CardTitle>
          <CardAction>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardAction>
        </CardHeader>
      </Card>
      <ItemTable
        data={items.data}
        unit={units.data}
        category={categorys.data}
      />
    </div>
  );
}
