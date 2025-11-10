import SectionCard from "@/components/section/section-card";
import RenderError from "@/components/ui/render-error";
import { LABEL } from "@/lib/constant";
import { getCountItem } from "@/lib/server/data/data-item";
import { getCountSupplier } from "@/lib/server/data/data-supplier";
import { Package, Store } from "lucide-react";

export default async function DashboardPage() {
  const [countItem, countSupplier] = await Promise.all([
    getCountItem(),
    getCountSupplier(),
  ]);

  if (!countItem.ok || !countSupplier.ok) {
    return RenderError(LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <SectionCard title="Total Item" value={countItem.data} Icon={Package} />
        <SectionCard
          title="Total Supplier"
          value={countSupplier.data}
          Icon={Store}
        />
      </div>
      <div className="bg-amber-400">DashboardPage 1</div>
      <div className="bg-red-500">DashboardPage 2</div>
    </div>
  );
}
