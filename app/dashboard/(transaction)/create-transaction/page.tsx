import { CreateTransactionForm } from "@/components/transaction/transaction-form";
import RenderError from "@/components/ui/render-error";
import { LABEL } from "@/lib/constant";
import { getItemsTrx } from "@/lib/server/data/data-item";
import { getSuppliersTrx } from "@/lib/server/data/data-supplier";
import React from "react";

export default async function CreateTransactionPage() {
  const [supplier, items] = await Promise.all([
    getSuppliersTrx(),
    getItemsTrx(),
  ]);

  if (!supplier.ok || !supplier.data || !items.ok || !items.data) {
    return RenderError(LABEL.ERROR.DESCRIPTION);
  }

  return <CreateTransactionForm items={items.data} supplier={supplier.data} />;
}
