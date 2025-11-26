import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PackageSearch } from "lucide-react";
import { TLastTransaction } from "@/lib/type-data";
import { formatDateToIndo } from "@/lib/utils";

export default function LastStockCheckCard({
  data,
}: {
  data: TLastTransaction | null;
}) {
  if (!data) {
    return (
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <PackageSearch className="h-5 w-5" /> Last Item Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No item check record found.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <PackageSearch className="h-5 w-5" /> Last Item Check
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          <p>
            <strong>ID:</strong> {data.idTransaction}
          </p>
          <p>
            <strong>Date:</strong> {formatDateToIndo(data.dateTransaction)}
          </p>
          <p>
            <strong>Checked By:</strong> {data.nameUser ?? "Unknown"}
          </p>
        </div>

        <div className="border-t pt-4 space-y-3">
          {data.details.map((d) => (
            <div
              key={d.itemId}
              className="flex flex-col gap-1 p-3 rounded-xl border bg-muted/30"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{d.nameItem}</p>
                <Badge>{d.nameUnit}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">System</p>
                  <p>{d.quantityDetailTransaction}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Physical</p>
                  <p>{d.quantityCheck ?? "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Difference</p>
                  <p
                    className={
                      d.quantityDifference === 0
                        ? ""
                        : d.quantityDifference! < 0
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  >
                    {d.quantityDifference ?? "-"}
                  </p>
                </div>
              </div>

              {d.note && (
                <p className="text-xs text-muted-foreground mt-1">
                  Note: {d.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
