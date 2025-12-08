import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, PackageSearch } from "lucide-react";
import { TLastTransaction } from "@/lib/type-data";
import { formatDateToIndo } from "@/lib/utils";
import Link from "next/link";
import { ROUTES } from "@/lib/constant";
import { Button } from "../ui/button";

// export default function LastStockCheckCard({
//   data,
// }: {
//   data: TLastTransaction | null;
// }) {
//   if (!data) {
//     return (
//       <Card className="p-4">
//         <CardHeader>
//           <CardTitle className="text-lg flex items-center gap-2">
//             <PackageSearch className="h-5 w-5" /> Last Item Check
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-sm text-muted-foreground">
//             No item check record found.
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card className="p-4">
//       <CardHeader>
//         <CardTitle className="text-lg flex items-center gap-2">
//           <PackageSearch className="h-5 w-5" /> Last Item Check
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="text-sm">
//           <p>
//             <strong>ID:</strong> {data.idTransaction}
//           </p>
//           <p>
//             <strong>Date:</strong> {formatDateToIndo(data.dateTransaction)}
//           </p>
//           <p>
//             <strong>Checked By:</strong> {data.nameUser ?? "Unknown"}
//           </p>
//         </div>

//         <div className="border-t pt-4 space-y-3">
//           {data.details.map((d) => (
//             <div
//               key={d.itemId}
//               className="flex flex-col gap-1 p-3 rounded-xl border bg-muted/30"
//             >
//               <div className="flex items-center justify-between">
//                 <p className="font-medium">{d.nameItem}</p>
//                 <Badge>{d.nameUnit}</Badge>
//               </div>

//               <div className="grid grid-cols-3 gap-3 text-sm">
//                 <div>
//                   <p className="text-muted-foreground">System</p>
//                   <p>{d.quantityDetailTransaction}</p>
//                 </div>
//                 <div>
//                   <p className="text-muted-foreground">Physical</p>
//                   <p>{d.quantityCheck ?? "-"}</p>
//                 </div>
//                 <div>
//                   <p className="text-muted-foreground">Difference</p>
//                   <p
//                     className={
//                       d.quantityDifference === 0
//                         ? ""
//                         : d.quantityDifference! < 0
//                         ? "text-red-600"
//                         : "text-green-600"
//                     }
//                   >
//                     {d.quantityDifference ?? "-"}
//                   </p>
//                 </div>
//               </div>

//               {d.note && (
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Note: {d.note}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

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
            <PackageSearch className="h-5 w-5" /> Pemeriksaan Bahan Baku
            Terakhir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Tidak ditemukan catatan pemeriksaan bahan baku.
          </p>
        </CardContent>
      </Card>
    );
  }

  const limitedDetails = data.details.slice(0, 3);
  const remainingCount = data.details.length - limitedDetails.length;

  return (
    <Card className="p-4 rounded-2xl shadow">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <PackageSearch className="h-5 w-5" /> Pemeriksaan Bahan Baku Terakhir
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* SUMMARY */}
        <div className="text-sm space-y-1">
          <p className="font-bold">{data.idTransaction}</p>
          <p>
            <strong>Tanggal:</strong> {formatDateToIndo(data.dateTransaction)}
          </p>
          <p className="capitalize">
            <strong>Diperiksa Oleh:</strong> {data.nameUser ?? "Unknown"}
          </p>
        </div>

        {/* ITEMS LIST */}
        <div className="border-t pt-4 space-y-3">
          {limitedDetails.map((d) => (
            <div
              key={d.itemId}
              className="flex flex-col gap-2 p-3 rounded-xl border bg-muted/30 hover:bg-muted transition"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{d.nameItem}</p>
                <Badge>{d.nameUnit}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Qyt Sistem</p>
                  <p className="font-semibold">{d.quantityDetailTransaction}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Qyt Fisik</p>
                  <p className="font-semibold">{d.quantityCheck ?? "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Selisih</p>
                  <p
                    className={`font-semibold ${
                      d.quantityDifference === 0
                        ? "text-muted-foreground"
                        : d.quantityDifference! < 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
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

          {remainingCount > 0 && (
            <p className="text-xs text-muted-foreground text-center">
              +{remainingCount} more items not shown…
            </p>
          )}
        </div>

        {/* BUTTON TO FULL DETAIL */}
        <Link
          href={ROUTES.AUTH.TRANSACTION.INVENTORY_CHECK.DETAIL(
            data.idTransaction
          )}
        >
          <Button className="w-full flex items-center gap-2 mt-2">
            View Full Details <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
