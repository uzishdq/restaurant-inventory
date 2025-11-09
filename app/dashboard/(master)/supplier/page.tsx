import { columnSupplier } from "@/components/columns/column-supplier";
import { CreateSupplierForm } from "@/components/supplier/supplier-form";
import TableDateWrapper from "@/components/table/table-wrapper";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Supplier</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {suppliers.data.length}
          </CardTitle>
          <CardAction>
            <Store className="h-5 w-5 text-muted-foreground" />
          </CardAction>
        </CardHeader>
      </Card>
      <TableDateWrapper
        header="Supplier"
        description="Contains information about vendors or suppliers who provide ingredients and materials for the restaurant"
        searchBy="nameSupplier"
        labelSearch="name"
        isFilterDate={false}
        filterDate=""
        data={suppliers.data}
        columns={columnSupplier}
      >
        <CreateSupplierForm />
      </TableDateWrapper>
    </div>
  );
}
