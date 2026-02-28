"use client";
import React, { useCallback, useEffect, useRef } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import {
  AddTransactionDetailSchema,
  CreateTransactionTestSchema,
  DeleteTransactionDetailSchema,
  DeleteTransactionSchema,
  UpdateTransactionDetailSchema,
  UpdateTransactionSchema,
  UpdateTrxDetailStatusSchema,
} from "@/lib/schema-validation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  CO_TRANSACTION,
  STATUS_TRANSACTION,
  statusColor,
  TYPE_TRANSACTION,
} from "@/lib/constant";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  statusTransactionType,
  TDetailTransaction,
  TItemTrx,
  TransactionDetailForm,
  TSupplierTrx,
  TTransaction,
  typeTransactionType,
} from "@/lib/type-data";
import CustomSelect from "../ui/custom-select";
import {
  addDetailTransaction,
  createTransaction,
  deleteDetailTransaction,
  deleteTransaction,
  updateDetailTransaction,
  updateDetailTrxStatus,
  updateTransaction,
} from "@/lib/server/actions/action-transaction";
import { cn } from "@/lib/utils";
import { Check, Plus, Trash2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useNotiSideStore } from "@/store/notif-side-store";

interface ICreateTransactionForm {
  items: TItemTrx[];
  supplier: TSupplierTrx[];
}
interface IItemList {
  items: TItemTrx[];
  selectedItemIds?: string[];
}

interface IAddDetailTransactionForm {
  onSuccess?: () => void;
  data: TDetailTransaction;
  items: TItemTrx[];
  supplier: TSupplierTrx[];
}

interface IDeleteTransactionForm {
  onSuccess?: () => void;
  data: TTransaction;
}

interface IUpdateDetailTransactionForm {
  onSuccess?: () => void;
  data: TDetailTransaction;
  items: TItemTrx[];
  suppliers: TSupplierTrx[];
}

interface IUpdateStatusDetailTransactionForm {
  onSuccess?: () => void;
  data: TDetailTransaction;
}

interface IDeleteDetailTransactionForm {
  onSuccess?: () => void;
  data: TDetailTransaction;
}

const labelMap = {
  CHECK: {
    quantityDetailTransaction: "Qty Sistem",
    quantityCheck: "Qty Fisik",
    quantityDifference: "Selisih",
  },
  OUT: {
    quantityDetailTransaction: "Qyt Keluar",
    quantityCheck: "Qty Fisik",
    quantityDifference: "Selisih",
  },
  IN: {
    quantityDetailTransaction: "Jumlah Pesanan",
    quantityCheck: "Diterima",
    quantityDifference: "Tidak Diterima",
  },
} as const;

// function CreateTransactionForm({
//   items,
//   supplier,
// }: Readonly<ICreateTransactionForm>) {
//   const [isPending, startTransition] = React.useTransition();

//   const { fetchNotifications } = useNotiSideStore();

//   const schema = CreateTransactionTestSchema(items);

//   const form = useForm<z.infer<typeof schema>>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       typeTransaction: "IN",
//       detail: [
//         {
//           itemId: "",
//           supplierId: "",
//           quantityDetailTransaction: 0,
//           quantityCheck: 0,
//           quantityDifference: 0,
//           note: "",
//         },
//       ],
//     },
//     mode: "onChange",
//   });

//   const { fields, append, remove } = useFieldArray({
//     control: form.control,
//     name: "detail",
//   });

//   const watchType = useWatch({
//     control: form.control,
//     name: "typeTransaction",
//   });

//   // Watch SEMUA detail sekaligus → ini kunci performa + stabilitas
//   const watchDetails = useWatch({
//     control: form.control,
//     name: "detail",
//   });

//   const prevTypeRef = useRef<string | undefined>(undefined);

//   React.useEffect(() => {
//     // Pertama kali render → inisialisasi
//     if (prevTypeRef.current === undefined) {
//       prevTypeRef.current = watchType;
//       return;
//     }

//     // Jika tipe tidak berubah → skip
//     if (!watchType || watchType === prevTypeRef.current) {
//       prevTypeRef.current = watchType;
//       return;
//     }

//     // Ambil data saat ini
//     const currentDetails = form.getValues("detail") || [];

//     // === Cek apakah ada data yang benar-benar diisi ===
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const hasFilledData = currentDetails.some((item: any) => {
//       return (
//         item?.itemId ||
//         item?.supplierId ||
//         (item?.quantityDetailTransaction ?? 0) > 0 ||
//         (item?.quantityCheck ?? 0) > 0 ||
//         (item?.note?.trim() ?? "") !== ""
//       );
//     });

//     // Jika belum ada data penting → langsung ganti tanpa drama
//     if (!hasFilledData) {
//       prevTypeRef.current = watchType;
//       return;
//     }

//     // === ADA DATA PENTING → simpan dulu, jangan langsung reset! ===
//     const oldType = prevTypeRef.current as typeTransactionType;
//     const oldDetails = structuredClone(currentDetails); // deep clone aman

//     // Kembalikan tipe sementara (biar UI tidak langsung berubah)
//     form.setValue("typeTransaction", oldType, { shouldValidate: false });

//     // Tampilkan toast Sonner dengan Undo + Lanjutkan
//     toast("Jenis Transaksi Diubah", {
//       description: "Semua data detail akan direset jika Anda melanjutkan.",
//       duration: 15000,
//       action: {
//         label: "Undo",
//         onClick: () => {
//           form.setValue("typeTransaction", oldType);
//           form.setValue("detail", oldDetails);
//           prevTypeRef.current = oldType;
//           toast.success("Perubahan telah dibatalkan.");
//         },
//       },
//       cancel: {
//         label: "Ok",
//         onClick: () => {
//           prevTypeRef.current = watchType;
//           form.setValue("typeTransaction", watchType);
//           form.setValue("detail", [
//             {
//               itemId: "",
//               supplierId: "",
//               quantityDetailTransaction: 0,
//               quantityCheck: 0,
//               quantityDifference: 0,
//               note: "",
//             },
//           ]);
//           toast.success(
//             "Jenis transaksi berhasil diperbarui. Data detail telah direset.",
//           );
//         },
//       },
//     });
//   }, [watchType, form, watchDetails]);

//   // Effect untuk auto-fill saat type = "CHECK"
//   React.useEffect(() => {
//     if (watchType !== "CHECK" || !watchDetails) return;

//     watchDetails.forEach((detail, index) => {
//       if (detail === undefined) return;

//       const itemId = detail.itemId;
//       const qtyCheck = detail.quantityCheck ?? 0;

//       const selectedItem = itemId
//         ? items.find((i) => i.idItem === itemId)
//         : null;
//       const qtySystem = selectedItem?.qty ?? 0;

//       // Hanya update jika ada perubahan → hindari infinite loop
//       const currentQtySystem = form.getValues(
//         `detail.${index}.quantityDetailTransaction`,
//       );
//       const currentDiff = form.getValues(`detail.${index}.quantityDifference`);

//       if (currentQtySystem !== qtySystem) {
//         form.setValue(`detail.${index}.quantityDetailTransaction`, qtySystem, {
//           shouldValidate: true,
//           shouldDirty: true,
//           shouldTouch: true,
//         });
//       }

//       const newDiff = qtyCheck - qtySystem;
//       if (currentDiff !== newDiff) {
//         form.setValue(`detail.${index}.quantityDifference`, newDiff, {
//           shouldDirty: true,
//         });
//       }
//     });
//   }, [watchType, watchDetails, items, form]); // watchDetails berubah → trigger effect

//   // Jangan reset detail saat ganti type! Hanya set default saat pertama kali mount
//   React.useEffect(() => {
//     const currentDetails = form.getValues("detail");
//     if (!currentDetails || currentDetails.length === 0) {
//       form.setValue("detail", [
//         {
//           itemId: "",
//           supplierId: "",
//           quantityDetailTransaction: 0,
//           quantityCheck: 0,
//           quantityDifference: 0,
//           note: "",
//         },
//       ]);
//     }
//   }, [form]); // Hanya sekali saat mount

//   // --- Handlers ---
//   const handleAddItem = useCallback(() => {
//     if (fields.length >= 20) {
//       form.setError("detail", { message: "Maximum 20 data allowed." });
//       return;
//     }
//     append({
//       itemId: "",
//       supplierId: "",
//       quantityDetailTransaction: 0,
//       quantityCheck: 0,
//       quantityDifference: 0,
//       note: "",
//     });
//   }, [fields.length, append, form]);

//   const handleRemove = useCallback(
//     (index: number) => {
//       if (fields.length > 1) remove(index);
//     },
//     [fields.length, remove],
//   );

//   const onSubmit = (values: z.infer<typeof schema>) => {
//     startTransition(() => {
//       createTransaction(values).then((data) => {
//         if (data.ok) {
//           form.reset();
//           fetchNotifications();
//           toast.success(data.message);
//         } else {
//           toast.error(data.message);
//         }
//       });
//     });
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="text-xl">Buat Transaksi</CardTitle>
//         <CardDescription className="text-base">
//           Pilih jenis transaksi (Cek, Pengadaan atau bahan baku keluar) lalu
//           tambahkan minimal satu bahan baku.
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             {/* Transaction Type */}
//             <FormField
//               control={form.control}
//               name="typeTransaction"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Jenis Transaksi</FormLabel>
//                   <Select onValueChange={field.onChange} value={field.value}>
//                     <FormControl>
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Select type" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {TYPE_TRANSACTION.map((item) => (
//                         <SelectItem key={item.value} value={item.value}>
//                           {item.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Transaction Details */}
//             <div className="space-y-4">
//               <FormLabel>Detail Transaksi</FormLabel>

//               {fields.map((field, index) => {
//                 const currentDetail = watchDetails?.[index] || {};
//                 const selectedItem = currentDetail.itemId
//                   ? items.find((i) => i.idItem === currentDetail.itemId)
//                   : null;
//                 const isDisable = watchType === "CHECK";

//                 return (
//                   <Card key={field.id} className="p-4">
//                     <CardHeader className="p-0 font-medium text-gray-700">
//                       Data #{index + 1}
//                     </CardHeader>
//                     <CardContent>
//                       <div
//                         className={cn(
//                           "grid p-0 grid-cols-1 gap-4",
//                           watchType === "IN" && "md:grid-cols-3 mb-4",
//                           watchType === "OUT" && "md:grid-cols-2 mb-4",
//                           watchType === "CHECK" && "md:grid-cols-4 mb-2",
//                         )}
//                       >
//                         {/* Item Select */}
//                         <CustomSelect
//                           name={`detail.${index}.itemId`}
//                           label="Bahan Baku"
//                           control={form.control}
//                           data={items}
//                           valueKey="idItem"
//                           labelKey="nameItem"
//                           required
//                         />

//                         {/* Supplier (only IN) */}
//                         {watchType === "IN" && (
//                           <CustomSelect
//                             name={`detail.${index}.supplierId`}
//                             label="Toko"
//                             control={form.control}
//                             data={supplier}
//                             valueKey="idSupplier"
//                             labelKey="store_name"
//                             required
//                           />
//                         )}

//                         {/* Quantity Detail */}
//                         <div className="space-y-2">
//                           <FormField
//                             control={form.control}
//                             name={`detail.${index}.quantityDetailTransaction`}
//                             render={({ field: qtyField }) => (
//                               <FormItem>
//                                 <FormLabel>
//                                   {labelMap[watchType]
//                                     ?.quantityDetailTransaction ?? "Quantity"}
//                                 </FormLabel>
//                                 <div className="flex items-center gap-2">
//                                   <FormControl>
//                                     <Input
//                                       type="number"
//                                       {...qtyField}
//                                       value={
//                                         qtyField.value === null
//                                           ? ""
//                                           : qtyField.value
//                                       }
//                                       onChange={(e) => {
//                                         const raw = e.target.value;

//                                         // jika kosong → jadikan null (bukan 0)
//                                         if (raw === "") {
//                                           qtyField.onChange(null);
//                                           return;
//                                         }

//                                         // selain itu → number
//                                         qtyField.onChange(
//                                           e.target.valueAsNumber,
//                                         );
//                                       }}
//                                       disabled={isDisable}
//                                     />
//                                   </FormControl>
//                                   {selectedItem && (
//                                     <span className="text-sm min-w-10 capitalize">
//                                       {selectedItem.nameUnit}
//                                     </span>
//                                   )}
//                                 </div>
//                                 {isDisable ||
//                                   (watchType === "OUT" && selectedItem && (
//                                     <p className="text-xs text-muted-foreground">
//                                       Stok Saat Ini: {selectedItem.qty}
//                                     </p>
//                                   ))}
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />
//                         </div>

//                         {/* Quantity Check */}
//                         {isDisable && (
//                           <div className="space-y-2">
//                             <FormField
//                               control={form.control}
//                               name={`detail.${index}.quantityCheck`}
//                               render={({ field: checkField }) => (
//                                 <FormItem>
//                                   <FormLabel>
//                                     {labelMap[watchType]?.quantityCheck ??
//                                       "Quantity Fisik"}
//                                   </FormLabel>
//                                   <div className="flex items-center gap-2">
//                                     <FormControl>
//                                       <Input
//                                         type="number"
//                                         {...checkField}
//                                         value={
//                                           checkField.value === null
//                                             ? ""
//                                             : checkField.value
//                                         }
//                                         onChange={(e) => {
//                                           const raw = e.target.value;

//                                           // Jika kosong → set null agar field bisa dikosongkan
//                                           if (raw === "") {
//                                             checkField.onChange(null);

//                                             // Set diff juga kosong (atau nol, sesuai kebutuhan)
//                                             form.setValue(
//                                               `detail.${index}.quantityDifference`,
//                                               0,
//                                               {
//                                                 shouldDirty: true,
//                                               },
//                                             );

//                                             return;
//                                           }

//                                           // Convert ke number kalau tidak kosong
//                                           const checkVal =
//                                             e.target.valueAsNumber;
//                                           checkField.onChange(checkVal);

//                                           // Ambil qty system
//                                           const transQty =
//                                             form.getValues(
//                                               `detail.${index}.quantityDetailTransaction`,
//                                             ) || 0;

//                                           // Hitung selisih
//                                           const diff = checkVal - transQty;

//                                           form.setValue(
//                                             `detail.${index}.quantityDifference`,
//                                             diff,
//                                             {
//                                               shouldDirty: true,
//                                             },
//                                           );
//                                         }}
//                                       />
//                                     </FormControl>
//                                     {selectedItem && (
//                                       <span className="text-sm min-w-10 capitalize">
//                                         {selectedItem.nameUnit}
//                                       </span>
//                                     )}
//                                   </div>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />
//                           </div>
//                         )}

//                         {/* Quantity Difference */}
//                         {isDisable && (
//                           <div className="space-y-2">
//                             <FormField
//                               control={form.control}
//                               name={`detail.${index}.quantityDifference`}
//                               render={({ field: diffField }) => (
//                                 <FormItem>
//                                   <FormLabel>
//                                     {labelMap[watchType]?.quantityDifference ??
//                                       "Selisih"}
//                                   </FormLabel>
//                                   <div className="flex items-center gap-2">
//                                     <FormControl>
//                                       <Input
//                                         type="number"
//                                         {...diffField}
//                                         className="bg-muted font-medium"
//                                         readOnly
//                                         disabled
//                                       />
//                                     </FormControl>
//                                     {selectedItem && (
//                                       <span className="text-sm min-w-10 capitalize">
//                                         {selectedItem.nameUnit}
//                                       </span>
//                                     )}
//                                   </div>
//                                   <FormDescription
//                                     className={cn(
//                                       diffField.value > 0
//                                         ? "text-green-600"
//                                         : diffField.value < 0
//                                           ? "text-red-600"
//                                           : "text-muted-foreground",
//                                     )}
//                                   >
//                                     {diffField.value > 0
//                                       ? `+${diffField.value} lebih`
//                                       : diffField.value < 0
//                                         ? `${diffField.value} kurang`
//                                         : "cocok"}
//                                   </FormDescription>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />
//                           </div>
//                         )}
//                       </div>
//                       {watchType !== "IN" && (
//                         <div className="space-y-2">
//                           <FormField
//                             control={form.control}
//                             name={`detail.${index}.note`}
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Note</FormLabel>
//                                 <FormControl>
//                                   <Textarea {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />
//                         </div>
//                       )}
//                     </CardContent>
//                     <CardDescription className="w-full">
//                       <Button
//                         type="button"
//                         variant="destructive"
//                         size="sm"
//                         className="w-full"
//                         onClick={() => handleRemove(index)}
//                         disabled={fields.length === 1}
//                       >
//                         Delete
//                       </Button>
//                     </CardDescription>
//                   </Card>
//                 );
//               })}

//               {/* Global Error */}
//               {form.formState.errors.detail?.message && (
//                 <p className="text-sm text-destructive">
//                   {form.formState.errors.detail.message}
//                 </p>
//               )}

//               {/* Add Item */}
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full"
//                 onClick={handleAddItem}
//                 disabled={fields.length >= 20}
//               >
//                 <Plus className="mr-2 h-4 w-4" />
//                 Tambah Detail
//               </Button>
//             </div>

//             {/* Submit */}
//             <Button type="submit" className="w-full" disabled={isPending}>
//               {isPending ? "Creating..." : "Create Transaction"}
//             </Button>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// }

// Helper functions outside component to reduce nesting

const getAvailableItems = (
  items: TItemTrx[],
  watchDetails: TransactionDetailForm[] | undefined,
  currentIndex: number,
) => {
  if (!watchDetails) return items;

  return items.filter((item) => {
    const isItemAlreadyAdded = watchDetails.some(
      (detail, detailIndex) =>
        detailIndex !== currentIndex && detail?.itemId === item.idItem,
    );
    return !isItemAlreadyAdded;
  });
};

export function ItemListIN({ items, selectedItemIds = [] }: IItemList) {
  const availableItems = items.filter(
    (item) =>
      !selectedItemIds.includes(item.idItem) && item.qty <= item.minStock,
  );

  if (availableItems.length === 0) {
    return (
      <p className="text-sm text-center text-muted-foreground py-4">
        Semua item sudah dipilih.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
      {availableItems.map((item) => (
        <div
          key={item.idItem}
          className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 px-4 py-3"
        >
          <div>
            <p className="text-sm font-medium">{item.nameItem}</p>
            <p className="text-xs text-muted-foreground">
              {item.nameUnit} · stok: {item.qty} / min: {item.minStock}
            </p>
          </div>
          {item.minStock - item.qty > 0 && (
            <span className="text-xs font-semibold text-red-500">
              -{item.minStock - item.qty}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function CreateTransactionForm({
  items,
  supplier,
}: Readonly<ICreateTransactionForm>) {
  const [isPending, startTransition] = React.useTransition();
  const [selectedSupplier, setSelectedSupplier] = React.useState<string>("");

  const { fetchNotifications } = useNotiSideStore();

  const schema = CreateTransactionTestSchema(items);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      typeTransaction: "IN",
      condition: "",
      detail: [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "detail",
  });

  const watchType = useWatch({
    control: form.control,
    name: "typeTransaction",
  });

  const watchDetails = useWatch({
    control: form.control,
    name: "detail",
  });

  const filteredCoTransaction = CO_TRANSACTION.filter(
    (co) => co.type === watchType,
  );

  const prevTypeRef = useRef<string | undefined>(undefined);
  const hasInitializedRef = useRef(false);

  // Auto-populate logic
  React.useEffect(() => {
    if (!watchType || items.length === 0) return;

    // Pertama kali render
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      prevTypeRef.current = watchType;

      // Untuk type IN, mulai dengan array kosong
      if (watchType === "IN") {
        form.setValue("detail", [], {
          shouldValidate: true,
          shouldDirty: false,
        });
        return;
      }

      // Untuk OUT dan CHECK, auto-populate
      const newDetails = items.map((item) => ({
        itemId: item.idItem,
        supplierId: "",
        quantityDetailTransaction: watchType === "CHECK" ? item.qty : 0,
        quantityCheck: 0,
        quantityDifference: 0,
        note: "",
      }));

      form.setValue("detail", newDetails, {
        shouldValidate: true,
        shouldDirty: false,
      });
      return;
    }

    // Jika tipe tidak berubah, skip
    if (watchType === prevTypeRef.current) {
      return;
    }

    // Cek apakah ada data yang sudah diisi
    const currentDetails = form.getValues("detail") || [];

    const hasFilledData = currentDetails.some((item) => {
      return (
        item?.supplierId ||
        (item?.quantityDetailTransaction ?? 0) > 0 ||
        (item?.quantityCheck ?? 0) > 0 ||
        (item?.note?.trim() ?? "") !== ""
      );
    });

    // Jika belum ada data penting, langsung ganti
    if (!hasFilledData) {
      prevTypeRef.current = watchType;

      // Reset untuk type IN
      if (watchType === "IN") {
        form.setValue("detail", [], {
          shouldValidate: true,
          shouldDirty: false,
        });
        setSelectedSupplier("");
        return;
      }

      // Auto-populate untuk OUT dan CHECK
      const newDetails = items.map((item) => ({
        itemId: item.idItem,
        supplierId: "",
        quantityDetailTransaction: watchType === "CHECK" ? item.qty : 0,
        quantityCheck: 0,
        quantityDifference: 0,
        note: "",
      }));

      form.setValue("detail", newDetails, {
        shouldValidate: true,
        shouldDirty: false,
      });
      return;
    }

    // Ada data penting, konfirmasi dulu
    const oldType = prevTypeRef.current as typeTransactionType;
    const oldDetails = structuredClone(currentDetails);

    form.setValue("typeTransaction", oldType, { shouldValidate: false });

    toast("Jenis Transaksi Diubah", {
      description: "Semua data detail akan direset jika Anda melanjutkan.",
      duration: 15000,
      action: {
        label: "Undo",
        onClick: () => {
          form.setValue("typeTransaction", oldType);
          form.setValue("detail", oldDetails);
          prevTypeRef.current = oldType;
          toast.success("Perubahan telah dibatalkan.");
        },
      },
      cancel: {
        label: "Ok",
        onClick: () => {
          prevTypeRef.current = watchType;
          form.setValue("typeTransaction", watchType);

          if (watchType === "IN") {
            form.setValue("detail", [], {
              shouldValidate: true,
              shouldDirty: true,
            });
            setSelectedSupplier("");
          } else {
            const newDetails = items.map((item) => ({
              itemId: item.idItem,
              supplierId: "",
              quantityDetailTransaction: watchType === "CHECK" ? item.qty : 0,
              quantityCheck: 0,
              quantityDifference: 0,
              note: "",
            }));

            form.setValue("detail", newDetails, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }

          toast.success("Jenis transaksi berhasil diperbarui.");
        },
      },
    });
  }, [watchType, form, items]);

  // Effect untuk auto-fill saat type = "CHECK"
  React.useEffect(() => {
    if (watchType !== "CHECK" || !watchDetails) return;

    watchDetails.forEach((detail, index) => {
      if (detail === undefined) return;

      const itemId = detail.itemId;
      const qtyCheck = detail.quantityCheck ?? 0;

      const selectedItem = itemId
        ? items.find((i) => i.idItem === itemId)
        : null;
      const qtySystem = selectedItem?.qty ?? 0;

      const currentQtySystem = form.getValues(
        `detail.${index}.quantityDetailTransaction`,
      );
      const currentDiff = form.getValues(`detail.${index}.quantityDifference`);

      if (currentQtySystem !== qtySystem) {
        form.setValue(`detail.${index}.quantityDetailTransaction`, qtySystem, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }

      const newDiff = qtyCheck - qtySystem;
      if (currentDiff !== newDiff) {
        form.setValue(`detail.${index}.quantityDifference`, newDiff, {
          shouldDirty: true,
        });
      }
    });
  }, [watchType, watchDetails, items, form]);

  const handleRemove = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  // Handler untuk add item di type IN (1 item kosong)
  const handleAddItem = useCallback(() => {
    if (!selectedSupplier) {
      toast.error("Pilih toko terlebih dahulu");
      return;
    }

    const currentDetails = form.getValues("detail") || [];
    const addedItemIds = new Set(currentDetails.map((d) => d.itemId));
    const availableItems = items.filter(
      (item) => !addedItemIds.has(item.idItem),
    );

    if (availableItems.length === 0) {
      toast.error("Semua item sudah ditambahkan");
      return;
    }

    // Tambahkan item kosong untuk dipilih manual
    append({
      itemId: "",
      supplierId: selectedSupplier,
      quantityDetailTransaction: 0,
      quantityCheck: 0,
      quantityDifference: 0,
      note: "",
    });

    // Reset selected supplier setelah menambahkan item
    // Sehingga user bisa pilih toko lain untuk item berikutnya
    setSelectedSupplier("");

    toast.success(
      "Item baru ditambahkan. Silakan pilih toko lagi untuk menambahkan item dari toko lain.",
    );
  }, [selectedSupplier, append, form, items]);

  // Handler untuk add semua item available dari toko yang dipilih
  const handleAddAllItems = useCallback(() => {
    if (!selectedSupplier) {
      toast.error("Pilih toko terlebih dahulu");
      return;
    }

    const currentDetails = form.getValues("detail") || [];
    const addedItemIds = new Set(currentDetails.map((d) => d.itemId));
    const availableItems = items.filter(
      (item) => !addedItemIds.has(item.idItem),
    );

    if (availableItems.length === 0) {
      toast.error("Semua item sudah ditambahkan");
      return;
    }

    const newItems = availableItems.map((item) => ({
      itemId: item.idItem,
      supplierId: selectedSupplier,
      quantityDetailTransaction: 0,
      quantityCheck: 0,
      quantityDifference: 0,
      note: "",
    }));

    form.setValue("detail", [...currentDetails, ...newItems], {
      shouldValidate: true,
      shouldDirty: true,
    });

    const storeName = supplier.find(
      (s) => s.idSupplier === selectedSupplier,
    )?.store_name;
    toast.success(
      `${availableItems.length} item ditambahkan dari ${storeName}`,
    );

    // Reset selected supplier setelah menambahkan semua item
    setSelectedSupplier("");
  }, [selectedSupplier, form, items, supplier]);

  const onSubmit = (values: z.infer<typeof schema>) => {
    startTransition(() => {
      createTransaction(values).then((data) => {
        if (data.ok) {
          form.reset();
          hasInitializedRef.current = false;
          setSelectedSupplier("");
          fetchNotifications();
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
    });
  };

  // Group items by supplier untuk tampilan yang lebih jelas (untuk type IN)
  // FIX: Include field.id to enable stable indexing when items are deleted
  const groupedBySupplier = React.useMemo(() => {
    if (watchType !== "IN" || !watchDetails || !fields) return {};

    type GroupedItem = (typeof watchDetails)[number] & {
      originalIndex: number;
      fieldId: string;
    };

    return watchDetails.reduce(
      (acc, detail, index) => {
        if (!detail?.supplierId) return acc;

        if (!acc[detail.supplierId]) {
          acc[detail.supplierId] = [];
        }
        acc[detail.supplierId].push({
          ...detail,
          originalIndex: index,
          fieldId: fields[index]?.id || "",
        });
        return acc;
      },
      {} as Record<string, GroupedItem[]>,
    );
  }, [watchType, watchDetails, fields]);

  // Handler untuk add item ke supplier tertentu
  const handleAddItemToSupplier = useCallback(
    (supplierId: string) => {
      const currentDetails = form.getValues("detail") || [];
      const addedItemIds = new Set(currentDetails.map((d) => d.itemId));
      const availableItems = items.filter(
        (item) => !addedItemIds.has(item.idItem),
      );

      if (availableItems.length === 0) {
        toast.error("Semua item sudah ditambahkan");
        return;
      }

      // Tambahkan item kosong untuk dipilih manual
      append({
        itemId: "",
        supplierId: supplierId,
        quantityDetailTransaction: 0,
        quantityCheck: 0,
        quantityDifference: 0,
        note: "",
      });

      const storeName = supplier.find(
        (s) => s.idSupplier === supplierId,
      )?.store_name;
      toast.success(`Item baru ditambahkan ke ${storeName}`);
    },
    [append, form, items, supplier],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Buat Transaksi</CardTitle>
        <CardDescription className="text-base">
          {watchType === "IN"
            ? "Pilih toko → tambahkan item → ulangi untuk toko lain. Anda bisa membeli dari beberapa toko sekaligus dalam satu transaksi."
            : "Pilih jenis transaksi (Cek atau bahan baku keluar). Semua item akan ditambahkan otomatis, hapus yang tidak diperlukan."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Transaction Type */}
            <FormField
              control={form.control}
              name="typeTransaction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Transaksi</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Jenis" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TYPE_TRANSACTION.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Transaction Condition */}
            {watchType !== "IN" && (
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kondisi</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Kondisi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredCoTransaction.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {watchType === "IN" && (
              <ItemListIN
                items={items}
                selectedItemIds={
                  watchDetails?.map((d) => d.itemId).filter(Boolean) ?? []
                }
              />
            )}

            {/* Supplier Selection untuk type IN */}
            {watchType === "IN" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <FormLabel>Pilih Toko</FormLabel>
                  <Select
                    onValueChange={setSelectedSupplier}
                    value={selectedSupplier}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih toko untuk menambahkan item" />
                    </SelectTrigger>
                    <SelectContent>
                      {supplier.map((sup) => (
                        <SelectItem key={sup.idSupplier} value={sup.idSupplier}>
                          {sup.store_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    💡 Tip: Anda bisa menambahkan bahan baku dari toko yang sama
                    dengan klik tombol + di grup toko, atau pilih toko baru
                    untuk membeli dari toko lain.
                  </p>
                </div>

                {selectedSupplier && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddItem}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Detail Transaksi
                  </Button>
                )}
              </div>
            )}

            {/* Transaction Details - Grouped by Supplier for IN type */}
            {watchType === "IN" && fields.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <FormLabel>
                    Detail Transaksi ({fields.length} item dari{" "}
                    {Object.keys(groupedBySupplier).length} toko)
                  </FormLabel>
                </div>

                {Object.entries(groupedBySupplier).map(
                  ([supplierId, supplierItems]) => {
                    const storeName = supplier.find(
                      (s) => s.idSupplier === supplierId,
                    )?.store_name;

                    return (
                      <div
                        key={supplierId}
                        className="border rounded-lg overflow-hidden"
                      >
                        <div className="bg-primary/10 px-4 py-3 border-b flex items-center justify-between">
                          <h3 className="font-semibold text-sm">
                            🏪 {storeName} ({supplierItems.length} item)
                          </h3>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleAddItemToSupplier(supplierId)}
                            className="h-8"
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Bahan Baku
                          </Button>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-muted">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium w-12">
                                  No
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium min-w-[200px]">
                                  Bahan Baku
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium min-w-[150px]">
                                  Jumlah Pesanan
                                </th>
                                <th className="px-4 py-3 text-center text-sm font-medium w-20 sticky right-0">
                                  Aksi
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {supplierItems.map((supplierItem, idx) => {
                                // FIX: Find current index using stable field.id instead of stale originalIndex
                                const index = fields.findIndex(
                                  (f) => f.id === supplierItem.fieldId,
                                );

                                // Safety check: skip if field not found
                                if (index === -1) return null;

                                const field = fields[index];
                                const currentDetail =
                                  watchDetails?.[index] || {};
                                const selectedItem = currentDetail.itemId
                                  ? items.find(
                                      (i) => i.idItem === currentDetail.itemId,
                                    )
                                  : null;

                                // Use helper function to reduce nesting
                                const availableItems = getAvailableItems(
                                  items,
                                  watchDetails,
                                  index,
                                );

                                return (
                                  <tr
                                    key={field.id}
                                    className="hover:bg-muted/30 transition-colors"
                                  >
                                    {/* No */}
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                      {idx + 1}
                                    </td>

                                    {/* Bahan Baku */}
                                    <td className="px-4 py-3">
                                      <CustomSelect
                                        name={`detail.${index}.itemId`}
                                        label=""
                                        control={form.control}
                                        data={availableItems}
                                        valueKey="idItem"
                                        labelKey="nameItem"
                                      />
                                      {/* Hidden supplier field - moved inside td */}
                                      <FormField
                                        control={form.control}
                                        name={`detail.${index}.supplierId`}
                                        render={({ field }) => (
                                          <input type="hidden" {...field} />
                                        )}
                                      />
                                    </td>

                                    {/* Quantity */}
                                    <td className="px-4 py-3">
                                      <FormField
                                        control={form.control}
                                        name={`detail.${index}.quantityDetailTransaction`}
                                        render={({ field: qtyField }) => (
                                          <FormItem>
                                            <div className="flex items-center gap-2">
                                              <FormControl>
                                                <Input
                                                  type="number"
                                                  step="0.01"
                                                  {...qtyField}
                                                  value={qtyField.value ?? ""}
                                                  onChange={(e) => {
                                                    const raw = e.target.value;
                                                    if (raw === "") {
                                                      qtyField.onChange(null);
                                                      return;
                                                    }
                                                    qtyField.onChange(
                                                      Number.parseFloat(raw) ||
                                                        0,
                                                    );
                                                  }}
                                                  className="h-9"
                                                />
                                              </FormControl>
                                              {selectedItem && (
                                                <span className="text-xs text-muted-foreground min-w-10 capitalize">
                                                  {selectedItem.nameUnit}
                                                </span>
                                              )}
                                            </div>
                                            <FormMessage className="text-xs" />
                                          </FormItem>
                                        )}
                                      />
                                    </td>

                                    {/* Action */}
                                    <td className="px-4 py-3 text-center sticky right-0 bg-background">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemove(index)}
                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  },
                )}

                {/* Global Error */}
                {form.formState.errors.detail?.message && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.detail.message}
                  </p>
                )}
              </div>
            )}

            {/* Transaction Details - Regular Table for OUT/CHECK */}
            {watchType !== "IN" && fields.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Detail Transaksi ({fields.length} item)</FormLabel>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-muted sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium w-12">
                            No
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium min-w-[200px]">
                            Bahan Baku
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium min-w-[150px]">
                            {labelMap[watchType]?.quantityDetailTransaction ??
                              "Quantity"}
                          </th>
                          {watchType === "CHECK" && (
                            <>
                              <th className="px-4 py-3 text-left text-sm font-medium min-w-[150px]">
                                {labelMap[watchType]?.quantityCheck ??
                                  "Qty Fisik"}
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium min-w-[150px]">
                                {labelMap[watchType]?.quantityDifference ??
                                  "Selisih"}
                              </th>
                            </>
                          )}
                          <th className="px-4 py-3 text-left text-sm font-medium min-w-[200px]">
                            Note
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-medium w-20 sticky right-0 bg-muted">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {fields.map((field, index) => {
                          const currentDetail = watchDetails?.[index] || {};
                          const selectedItem = currentDetail.itemId
                            ? items.find(
                                (i) => i.idItem === currentDetail.itemId,
                              )
                            : null;
                          const isDisable = watchType === "CHECK";

                          return (
                            <tr
                              key={field.id}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              {/* No */}
                              <td className="px-4 py-3 text-sm text-muted-foreground">
                                {index + 1}
                              </td>

                              {/* Bahan Baku */}
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">
                                    {selectedItem?.nameItem || "-"}
                                  </span>
                                  {watchType === "OUT" && selectedItem && (
                                    <span className="text-xs text-muted-foreground">
                                      (Stok: {selectedItem.qty})
                                    </span>
                                  )}
                                </div>
                                <FormField
                                  control={form.control}
                                  name={`detail.${index}.itemId`}
                                  render={({ field }) => (
                                    <input type="hidden" {...field} />
                                  )}
                                />
                              </td>

                              {/* Quantity Detail */}
                              <td className="px-4 py-3">
                                <FormField
                                  control={form.control}
                                  name={`detail.${index}.quantityDetailTransaction`}
                                  render={({ field: qtyField }) => (
                                    <FormItem>
                                      <div className="flex items-center gap-2">
                                        <FormControl>
                                          <Input
                                            type="number"
                                            step="0.01"
                                            {...qtyField}
                                            value={qtyField.value ?? ""}
                                            onChange={(e) => {
                                              const raw = e.target.value;
                                              if (raw === "") {
                                                qtyField.onChange(null);
                                                return;
                                              }
                                              qtyField.onChange(
                                                Number.parseFloat(raw) || 0,
                                              );
                                            }}
                                            disabled={isDisable}
                                            className="h-9"
                                          />
                                        </FormControl>
                                        {selectedItem && (
                                          <span className="text-xs text-muted-foreground min-w-10 capitalize">
                                            {selectedItem.nameUnit}
                                          </span>
                                        )}
                                      </div>
                                      <FormMessage className="text-xs" />
                                    </FormItem>
                                  )}
                                />
                              </td>

                              {/* Quantity Check */}
                              {watchType === "CHECK" && (
                                <td className="px-4 py-3">
                                  <FormField
                                    control={form.control}
                                    name={`detail.${index}.quantityCheck`}
                                    render={({ field: checkField }) => (
                                      <FormItem>
                                        <div className="flex items-center gap-2">
                                          <FormControl>
                                            <Input
                                              type="number"
                                              step="0.01"
                                              {...checkField}
                                              value={checkField.value ?? ""}
                                              onChange={(e) => {
                                                const raw = e.target.value;
                                                if (raw === "") {
                                                  checkField.onChange(null);
                                                  form.setValue(
                                                    `detail.${index}.quantityDifference`,
                                                    0,
                                                    { shouldDirty: true },
                                                  );
                                                  return;
                                                }
                                                const checkVal =
                                                  Number.parseFloat(raw) || 0;
                                                checkField.onChange(checkVal);
                                                const transQty =
                                                  form.getValues(
                                                    `detail.${index}.quantityDetailTransaction`,
                                                  ) || 0;
                                                const diff =
                                                  checkVal - transQty;
                                                form.setValue(
                                                  `detail.${index}.quantityDifference`,
                                                  diff,
                                                  { shouldDirty: true },
                                                );
                                              }}
                                              className="h-9"
                                            />
                                          </FormControl>
                                          {selectedItem && (
                                            <span className="text-xs text-muted-foreground min-w-10 capitalize">
                                              {selectedItem.nameUnit}
                                            </span>
                                          )}
                                        </div>
                                        <FormMessage className="text-xs" />
                                      </FormItem>
                                    )}
                                  />
                                </td>
                              )}

                              {/* Quantity Difference */}
                              {watchType === "CHECK" && (
                                <td className="px-4 py-3">
                                  <FormField
                                    control={form.control}
                                    name={`detail.${index}.quantityDifference`}
                                    render={({ field: diffField }) => (
                                      <FormItem>
                                        <div className="flex items-center gap-2">
                                          <FormControl>
                                            <Input
                                              type="number"
                                              step="0.01"
                                              {...diffField}
                                              className="h-9 bg-muted font-medium"
                                              readOnly
                                              disabled
                                            />
                                          </FormControl>
                                          {selectedItem && (
                                            <span className="text-xs text-muted-foreground min-w-10 capitalize">
                                              {selectedItem.nameUnit}
                                            </span>
                                          )}
                                          <p
                                            className={cn(
                                              "text-xs mt-0 font-medium",
                                              diffField.value > 0
                                                ? "text-green-600"
                                                : diffField.value < 0
                                                  ? "text-red-600"
                                                  : "text-muted-foreground",
                                            )}
                                          >
                                            {diffField.value > 0
                                              ? `+${diffField.value} lebih`
                                              : diffField.value < 0
                                                ? `${diffField.value} kurang`
                                                : "cocok"}
                                          </p>
                                        </div>

                                        <FormMessage className="text-xs" />
                                      </FormItem>
                                    )}
                                  />
                                </td>
                              )}

                              {/* Note */}
                              <td className="px-4 py-3">
                                <FormField
                                  control={form.control}
                                  name={`detail.${index}.note`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Textarea
                                          {...field}
                                          className="h-20 min-h-9"
                                          rows={1}
                                        />
                                      </FormControl>
                                      <FormMessage className="text-xs" />
                                    </FormItem>
                                  )}
                                />
                              </td>

                              {/* Action */}
                              <td className="px-4 py-3 text-center sticky right-0 bg-background">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemove(index)}
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Global Error */}
                {form.formState.errors.detail?.message && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.detail.message}
                  </p>
                )}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={isPending || fields.length === 0}
            >
              {isPending ? "Loading..." : "Buat Transaksi"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function DeleteTransactionForm({
  onSuccess,
  data,
}: Readonly<IDeleteTransactionForm>) {
  const [isPending, startTransition] = React.useTransition();

  const { fetchNotifications } = useNotiSideStore();

  const form = useForm<z.infer<typeof DeleteTransactionSchema>>({
    resolver: zodResolver(DeleteTransactionSchema),
    defaultValues: {
      idTransaction: data.idTransaction,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof DeleteTransactionSchema>) => {
    startTransition(() => {
      deleteTransaction(values).then((data) => {
        if (data.ok) {
          form.reset();
          onSuccess?.();
          fetchNotifications();
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <FormItem>
            <FormLabel>No Transaksi</FormLabel>
            <div className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-muted/20">
              {data.idTransaction}
            </div>
          </FormItem>
        </div>
        <div className="space-y-2">
          <FormItem>
            <FormLabel>Dibuat Oleh</FormLabel>
            <div className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-muted/20">
              {data.nameUser}
            </div>
          </FormItem>
        </div>
        <div className="space-y-2">
          <FormItem>
            <FormLabel>Total Bahan Baku</FormLabel>
            <div className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-muted/20">
              {data.totalItems}
            </div>
          </FormItem>
        </div>
        <Button
          type="submit"
          variant="destructive"
          className="w-full mt-2"
          disabled={isPending}
        >
          {isPending ? "Loading..." : "Delete"}
        </Button>
      </form>
    </Form>
  );
}

function UpdateTransactionForm({ data }: Readonly<IDeleteTransactionForm>) {
  const [isPending, startTransition] = React.useTransition();
  const { fetchNotifications } = useNotiSideStore();

  const valueSelect = React.useMemo(() => {
    const STATUS_ORDER_IN = ["PENDING", "ORDERED", "RECEIVED", "COMPLETED"];

    if (data.typeTransaction !== "IN") {
      return STATUS_TRANSACTION.filter((s) => s.value === "COMPLETED");
    }

    const currentIndex = STATUS_ORDER_IN.indexOf(data.statusTransaction);
    const nextStatus = STATUS_ORDER_IN[currentIndex + 1];

    return STATUS_TRANSACTION.filter((s) => {
      if (s.value === "CANCELLED") return data.statusTransaction === "PENDING";
      return s.value === nextStatus;
    });
  }, [data.typeTransaction, data.statusTransaction]);

  const handleClick = (status: string) => {
    startTransition(() => {
      updateTransaction({
        idTransaction: data.idTransaction,
        typeTransaction: data.typeTransaction,
        statusTransaction: status as statusTransactionType,
      }).then((res) => {
        if (res.ok) {
          fetchNotifications();
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      });
    });
  };

  return (
    <div className="flex flex-col flex-wrap gap-2">
      {valueSelect.map((s) => (
        <Button
          key={s.value}
          type="button"
          variant="outline"
          disabled={isPending}
          className={cn(statusColor[s.value])}
          onClick={() => handleClick(s.value)}
        >
          {isPending ? "Loading..." : s.name}
        </Button>
      ))}
    </div>
  );
}

function AddDetailTransactionForm({
  onSuccess,
  data,
  items,
  supplier,
}: Readonly<IAddDetailTransactionForm>) {
  const [isPending, startTransition] = React.useTransition();

  const schema = AddTransactionDetailSchema(items);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      idTransaction: data.idTransaction,
      typeTransaction: data.typeTransaction,
      detail: [
        {
          itemId: "",
          supplierId: "",
          quantityDetailTransaction: 0,
          quantityCheck: 0,
          quantityDifference: 0,
          note: "",
        },
      ],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "detail",
  });

  React.useEffect(() => {
    if (data.typeTransaction !== "CHECK") return;

    const subscription = form.watch((value, { name }) => {
      if (!name) return;

      const match = name.match(/^detail\.(\d+)\.(itemId|quantityCheck)$/);
      if (!match) return;

      const index = parseInt(match[1], 10);

      // Gunakan setTimeout 0 supaya masuk ke queue setelah semua update selesai
      setTimeout(() => {
        const itemId = form.getValues(`detail.${index}.itemId`);
        const qtyCheck = form.getValues(`detail.${index}.quantityCheck`) ?? 0;

        const selectedItem = itemId
          ? items.find((i) => i.idItem === itemId)
          : null;
        const qtySystem = selectedItem?.qty ?? 0;

        // Update stok sistem
        form.setValue(`detail.${index}.quantityDetailTransaction`, qtySystem, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });

        // Update selisih
        form.setValue(
          `detail.${index}.quantityDifference`,
          qtyCheck - qtySystem,
        );
      }, 0);
    });

    return () => subscription.unsubscribe();
  }, [form, items, data.typeTransaction]);

  const onSubmit = (values: z.infer<typeof schema>) => {
    startTransition(() => {
      addDetailTransaction(values).then((data) => {
        if (data.ok) {
          form.reset();
          onSuccess?.();
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
    });
  };

  const handleRemove = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      form.setError("detail", {
        type: "manual",
        message: "At least one transaction detail is required.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* DETAIL TRANSACTION */}
        <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
          <FormLabel>Detail Transaksi</FormLabel>

          {fields.map((field, index) => {
            const itemId = form.getValues(`detail.${index}.itemId`);
            const selectedItem = items.find((it) => it.idItem === itemId);

            return (
              <Card key={field.id}>
                <CardHeader className="font-medium text-gray-700">
                  Data #{index + 1}
                </CardHeader>
                <CardContent className="space-y-4">
                  <CustomSelect
                    name={`detail.${index}.itemId`}
                    label="Bahan Baku"
                    control={form.control}
                    data={items}
                    valueKey="idItem"
                    labelKey="nameItem"
                    required
                  />
                  {data.typeTransaction === "IN" && (
                    <CustomSelect
                      name={`detail.${index}.supplierId`}
                      label="Toko"
                      control={form.control}
                      data={supplier}
                      valueKey="idSupplier"
                      labelKey="store_name"
                      required
                    />
                  )}

                  <FormField
                    control={form.control}
                    name={`detail.${index}.quantityDetailTransaction`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {" "}
                          {labelMap[data.typeTransaction]
                            ?.quantityDetailTransaction ?? "Quantity"}
                        </FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={isNaN(field.value) ? "" : field.value}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                              disabled={data.typeTransaction === "CHECK"}
                            />
                          </FormControl>
                          {selectedItem && (
                            <span className="capitalize text-sm min-w-10">
                              {selectedItem.nameUnit}
                            </span>
                          )}
                        </div>
                        <FormMessage />
                        {selectedItem && (
                          <FormDescription>
                            Stok Saat Ini: {selectedItem.qty}
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />

                  {data.typeTransaction === "CHECK" && (
                    <FormField
                      control={form.control}
                      name={`detail.${index}.quantityCheck`}
                      render={({ field: checkField }) => (
                        <FormItem>
                          <FormLabel>
                            {labelMap[data.typeTransaction]?.quantityCheck ??
                              "Quantity Fisik"}
                          </FormLabel>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input
                                type="number"
                                {...checkField}
                                value={
                                  checkField.value === null
                                    ? ""
                                    : checkField.value
                                }
                                onChange={(e) => {
                                  const raw = e.target.value;

                                  // Jika kosong → set null agar field bisa dikosongkan
                                  if (raw === "") {
                                    checkField.onChange(null);

                                    // Set diff juga kosong (atau nol, sesuai kebutuhan)
                                    form.setValue(
                                      `detail.${index}.quantityDifference`,
                                      0,
                                      {
                                        shouldDirty: true,
                                      },
                                    );

                                    return;
                                  }

                                  // Convert ke number kalau tidak kosong
                                  const checkVal = e.target.valueAsNumber;
                                  checkField.onChange(checkVal);

                                  // Ambil qty system
                                  const transQty =
                                    form.getValues(
                                      `detail.${index}.quantityDetailTransaction`,
                                    ) || 0;

                                  // Hitung selisih
                                  const diff = checkVal - transQty;

                                  form.setValue(
                                    `detail.${index}.quantityDifference`,
                                    diff,
                                    {
                                      shouldDirty: true,
                                    },
                                  );
                                }}
                              />
                            </FormControl>
                            {selectedItem && (
                              <span className="text-sm min-w-10 capitalize">
                                {selectedItem.nameUnit}
                              </span>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {data.typeTransaction === "CHECK" && (
                    <FormField
                      control={form.control}
                      name={`detail.${index}.quantityDifference`}
                      render={({ field: diffField }) => (
                        <FormItem>
                          <FormLabel>
                            {labelMap[data.typeTransaction]
                              ?.quantityDifference ?? "Selisih"}
                          </FormLabel>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input
                                type="number"
                                {...diffField}
                                className="bg-muted font-medium"
                                readOnly
                                disabled
                              />
                            </FormControl>
                            {selectedItem && (
                              <span className="text-sm min-w-10 capitalize">
                                {selectedItem.nameUnit}
                              </span>
                            )}
                          </div>
                          <FormDescription
                            className={cn(
                              diffField.value > 0
                                ? "text-green-600"
                                : diffField.value < 0
                                  ? "text-red-600"
                                  : "text-muted-foreground",
                            )}
                          >
                            {diffField.value > 0
                              ? `+${diffField.value} lebih`
                              : diffField.value < 0
                                ? `${diffField.value} kurang`
                                : "cocok"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {data.typeTransaction !== "IN" && (
                    <FormField
                      control={form.control}
                      name={`detail.${index}.note`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Note</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemove(index)}
                      disabled={fields.length === 1}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Error global untuk detail array */}
          {form.formState.errors.detail && (
            <p className="text-sm text-red-500">
              {form.formState.errors.detail.message?.toString()}
            </p>
          )}

          <Button
            type="button"
            className="w-full"
            variant="secondary"
            onClick={() => {
              if (fields.length >= 20) {
                form.setError("detail", {
                  message: "Maximum 20 items allowed.",
                });
                return;
              }

              append({
                itemId: "",
                supplierId: "",
                quantityDetailTransaction: 0,
                quantityCheck: 0,
                quantityDifference: 0,
                note: "",
              });
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Detail
          </Button>
        </div>

        <Button type="submit" className="w-full mt-2" disabled={isPending}>
          {isPending ? "Loading..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}

function UpdateStatusDetailTransactionForm({
  onSuccess,
  data,
}: Readonly<IUpdateStatusDetailTransactionForm>) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof UpdateTrxDetailStatusSchema>>({
    resolver: zodResolver(UpdateTrxDetailStatusSchema),
    defaultValues: {
      idDetailTransaction: data.idDetailTransaction,
      statusDetailTransaction: data.statusDetailTransaction,
    },
    mode: "onChange",
  });

  const valueSelect =
    data.typeTransaction === "IN"
      ? STATUS_TRANSACTION
      : STATUS_TRANSACTION.filter((s) =>
          ["COMPLETED", "CANCELLED"].includes(s.value),
        );

  const onSubmit = (values: z.infer<typeof UpdateTrxDetailStatusSchema>) => {
    startTransition(() => {
      updateDetailTrxStatus(values).then((data) => {
        if (data.ok) {
          form.reset();
          onSuccess?.();
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="statusDetailTransaction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Detail Transaksi</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {valueSelect.map((item, index) => (
                      <SelectItem
                        key={index}
                        className={statusColor[item.value]}
                        value={item.value}
                      >
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full mt-2" disabled={isPending}>
          {isPending ? "Loading..." : "Update"}
        </Button>
      </form>
    </Form>
  );
}

function UpdateDetailTransactionForm({
  onSuccess,
  data,
  items,
  suppliers,
}: Readonly<IUpdateDetailTransactionForm>) {
  const [isPending, startTransition] = React.useTransition();

  const schema = UpdateTransactionDetailSchema(items);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      idDetailTransaction: data.idDetailTransaction,
      typeTransaction: data.typeTransaction,
      statusTransaction: data.statusDetailTransaction,
      itemId: data.itemId,
      supplierId: data.supplierId ?? "",
      quantityDetailTransaction: data.quantityDetailTransaction,
      quantityCheck: data.quantityCheck ?? 0,
      quantityDifference: data.quantityDifference ?? 0,
      note: data.note ?? "",
    },
    mode: "onChange",
  });

  const allowStatuses = ["PENDING", "ORDERED"];

  const isDisable =
    data.typeTransaction === "CHECK" ||
    !allowStatuses.includes(data.statusDetailTransaction);

  const selectedItemId = useWatch({
    control: form.control,
    name: "itemId",
  });

  const selectedItem = items.find((i) => i.idItem === selectedItemId);

  useEffect(() => {
    if (isDisable) {
      const qtyDetail = form.getValues("quantityDetailTransaction");
      const qtyCheck = form.getValues("quantityCheck");

      if (qtyCheck === 0) {
        form.setValue("quantityCheck", qtyDetail);
      }
    }
  }, [isDisable, form]);

  const onSubmit = (values: z.infer<typeof schema>) => {
    startTransition(() => {
      updateDetailTransaction(values).then((data) => {
        if (data.ok) {
          form.reset();
          onSuccess?.();
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomSelect
          name="itemId"
          label="Bahan Baku"
          control={form.control}
          data={items}
          valueKey="idItem"
          labelKey="nameItem"
          disabled={isDisable}
          required={!isDisable}
        />
        {data.typeTransaction === "IN" && (
          <CustomSelect
            name="supplierId"
            label="Toko"
            control={form.control}
            data={suppliers}
            valueKey="idSupplier"
            labelKey="store_name"
            disabled={isDisable}
            required={!isDisable}
          />
        )}
        <FormField
          control={form.control}
          name="quantityDetailTransaction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {labelMap[data.typeTransaction]?.quantityDetailTransaction ??
                  "Quantity"}
              </FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={Number.isNaN(field.value) ? "" : field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      disabled={isDisable}
                    />
                  </FormControl>
                  {selectedItem && (
                    <span className="capitalize text-sm min-w-10">
                      {selectedItem.nameUnit}
                    </span>
                  )}
                </div>
              </FormControl>
              <FormMessage />
              {selectedItem && (
                <FormDescription>
                  Stok Saat ini: {selectedItem.qty}
                </FormDescription>
              )}
            </FormItem>
          )}
        />
        {isDisable && (
          <>
            <FormField
              control={form.control}
              name="quantityCheck"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {labelMap[data.typeTransaction]?.quantityCheck ??
                      "Good Quantity"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={Number.isNaN(field.value) ? "" : field.value}
                      onChange={(e) => {
                        const qtyCheck = e.target.valueAsNumber;
                        field.onChange(qtyCheck);

                        // Ambil qtyDetail dari form (sudah di-load dari data)
                        const qtyDetail = form.getValues(
                          "quantityDetailTransaction",
                        );

                        // Hitung selisih
                        const diff = qtyCheck - qtyDetail;

                        // Set hasilnya ke quantityDifference
                        form.setValue(
                          "quantityDifference",
                          Number.isNaN(diff) ? 0 : diff,
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantityDifference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {labelMap[data.typeTransaction]?.quantityDifference ??
                      "Damaged Quantity"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={Number.isNaN(field.value) ? "" : field.value}
                      disabled
                    />
                  </FormControl>
                  <FormDescription
                    className={cn(
                      field.value > 0
                        ? "text-green-600"
                        : field.value < 0
                          ? "text-red-600"
                          : "text-muted-foreground",
                    )}
                  >
                    {field.value > 0
                      ? `+${field.value} lebih`
                      : field.value < 0
                        ? `${field.value} kurang`
                        : "cocok"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {data.typeTransaction !== "IN" && (
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {data.statusDetailTransaction !== "COMPLETED" && (
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Loading..." : "Update"}
          </Button>
        )}
      </form>
    </Form>
  );
}

function DeleteDetailTransactionForm({
  onSuccess,
  data,
}: Readonly<IDeleteDetailTransactionForm>) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof DeleteTransactionDetailSchema>>({
    resolver: zodResolver(DeleteTransactionDetailSchema),
    defaultValues: {
      idDetailTransaction: data.idDetailTransaction,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof DeleteTransactionDetailSchema>) => {
    startTransition(() => {
      deleteDetailTransaction(values).then((data) => {
        if (data.ok) {
          form.reset();
          onSuccess?.();
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <FormItem>
            <FormLabel>Bahan Baku</FormLabel>
            <div className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-muted/20">
              {data.nameItem}
            </div>
          </FormItem>
        </div>
        {data.typeTransaction === "IN" && (
          <div className="space-y-2">
            <FormItem>
              <FormLabel>Toko</FormLabel>
              <div className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-muted/20">
                {data.store_name}
              </div>
            </FormItem>
          </div>
        )}
        <div className="space-y-2">
          <FormItem>
            <FormLabel>Qyt</FormLabel>
            <div className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-muted/20">
              {data.quantityDetailTransaction} / {data.nameUnit}
            </div>
          </FormItem>
        </div>
        {["CHECK", "OUT"].includes(data.typeTransaction) && (
          <div className="space-y-2">
            <FormItem>
              <FormLabel>Note</FormLabel>
              <div className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-muted/20">
                {data.note}
              </div>
            </FormItem>
          </div>
        )}
        <Button
          type="submit"
          variant="destructive"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "Loading..." : "Delete"}
        </Button>
      </form>
    </Form>
  );
}

export {
  CreateTransactionForm,
  DeleteTransactionForm,
  UpdateTransactionForm,
  AddDetailTransactionForm,
  UpdateStatusDetailTransactionForm,
  UpdateDetailTransactionForm,
  DeleteDetailTransactionForm,
};
