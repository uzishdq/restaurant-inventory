import { TransactionCheckTableWrapper } from "@/components/transaction/transaction-table-wrapper";
import RenderError from "@/components/ui/render-error";
import { auth } from "@/lib/auth";
import { LABEL } from "@/lib/constant";
import { isTransactionId } from "@/lib/helper";
import { getItemsTrx } from "@/lib/server/data/data-item";
import { getSuppliersTrx } from "@/lib/server/data/data-supplier";
import { getDetailTransactions } from "@/lib/server/data/data-transaction";

export default async function DetailCheckPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isTransactionId(id)) {
    return RenderError(LABEL.ERROR[404]);
  }

  const session = await auth();
  const idUser = session?.user.id;
  const role = session?.user.role;

  if (!idUser || !role) {
    return RenderError(LABEL.ERROR.NOT_LOGIN);
  }

  const [details, supplier, items] = await Promise.all([
    getDetailTransactions(id),
    getSuppliersTrx(),
    getItemsTrx(),
  ]);

  if (
    !details.ok ||
    !details.data ||
    !supplier.ok ||
    !supplier.data ||
    !items.ok ||
    !items.data
  ) {
    return RenderError(LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className=" space-y-4">
      <TransactionCheckTableWrapper
        data={details.data}
        items={items.data}
        suppliers={supplier.data}
      />
    </div>
  );
}
