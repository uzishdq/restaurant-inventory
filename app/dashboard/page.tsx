import { ChartAreaInteractive } from "@/components/chart/chart-area-interactive";
import LastStockCheckCard from "@/components/chart/last-check-inv-card";
import LowItemCard from "@/components/chart/low-item-card";
import SectionCard from "@/components/section/section-card";
import RenderError from "@/components/ui/render-error";
import { LABEL } from "@/lib/constant";
import {
  getCountItem,
  getItemMovementGrouped,
  getLowItem,
} from "@/lib/server/data/data-item";
import { getCountSupplier } from "@/lib/server/data/data-supplier";
import { getLastTransactions } from "@/lib/server/data/data-transaction";
import { Package, Store } from "lucide-react";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { month?: string; year?: string };
}) {
  const { month: monthParam, year: yearParam } = await searchParams;

  const now = new Date();
  const month = Number(monthParam) || now.getMonth() + 1;
  const year = Number(yearParam) || now.getFullYear();

  const [countItem, countSupplier, itemMovement, lastCheck, lowItem] =
    await Promise.all([
      getCountItem(),
      getCountSupplier(),
      getItemMovementGrouped(month, year),
      getLastTransactions("CHECK"),
      getLowItem(),
    ]);

  if (
    !countItem.ok ||
    !countSupplier.ok ||
    !itemMovement.ok ||
    !lastCheck.ok ||
    !lowItem.ok
  ) {
    return RenderError(LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <SectionCard
          title="Total Bahan Baku"
          value={countItem.data}
          Icon={Package}
        />
        <SectionCard
          title="Total Supplier"
          value={countSupplier.data}
          Icon={Store}
        />
      </div>

      {itemMovement.data && (
        <ChartAreaInteractive
          data={itemMovement.data}
          month={month}
          year={year}
        />
      )}

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <LastStockCheckCard data={lastCheck.data} />
        {lowItem.data && <LowItemCard data={lowItem.data} />}
      </div>
    </div>
  );
}
