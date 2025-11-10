import SectionCard from "@/components/section/section-card";
import { Package, Store } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <SectionCard title="Total Item" value={2} Icon={Package} />
        <SectionCard title="Total Supplier" value={2} Icon={Store} />
      </div>
      <div className="bg-amber-400">DashboardPage 1</div>
      <div className="bg-red-500">DashboardPage 2</div>
    </div>
  );
}
