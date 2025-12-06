import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TLowItem } from "@/lib/type-data";
import { AlertTriangle, CheckCircle2, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LowItemCard({ data }: { data: TLowItem[] }) {
  return (
    <Card className="rounded-2xl shadow-sm border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-semibold">
          Bahan Baku Persediaan Rendah
        </CardTitle>
        <AlertTriangle className="h-6 w-6" />
      </CardHeader>

      <CardContent>
        {data.length === 0 ? <EmptyState /> : <ItemList data={data} />}
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------
// Empty state
// ----------------------------------------------------

function EmptyState() {
  return (
    <div className="py-6 text-center">
      <CheckCircle2 className="h-8 w-8 mx-auto text-green-500 mb-2" />
      <p className="text-sm text-muted-foreground">
        Semua bahan baku tersedia dalam jumlah yang cukup.
      </p>
    </div>
  );
}

// ----------------------------------------------------
// Item List
// ----------------------------------------------------

function ItemList({ data }: { data: TLowItem[] }) {
  return (
    <div className="space-y-3">
      {data.map((item) => {
        const status =
          item.stockQuantity < item.minStock
            ? "LOW"
            : item.stockQuantity === item.minStock
            ? "WARN"
            : "SAFE";

        const statusColor =
          status === "LOW"
            ? "text-red-500"
            : status === "WARN"
            ? "text-yellow-500"
            : "text-green-500";

        const statusIcon =
          status === "LOW" ? (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          ) : status === "WARN" ? (
            <Minus className="h-4 w-4 text-yellow-500" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          );

        const percent =
          (item.stockQuantity / item.minStock) * 100 > 100
            ? 100
            : (item.stockQuantity / item.minStock) * 100;

        return (
          <div
            key={item.idItem}
            className="border rounded-xl p-3 shadow-sm hover:shadow-md transition-all bg-white"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium">{item.nameItem}</p>
              </div>

              <div className="flex items-center gap-1">
                {statusIcon}
                <span className={cn("text-xs font-semibold", statusColor)}>
                  {status}
                </span>
              </div>
            </div>

            {/* Quantity Info */}
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">
                Persediaan: {item.stockQuantity} {item.nameUnit ?? "-"}
              </span>
              <span className="text-muted-foreground">
                Min: {item.minStock} {item.nameUnit ?? "-"}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all",
                  status === "LOW"
                    ? "bg-red-500"
                    : status === "WARN"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                )}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
