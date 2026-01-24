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
  TDetailTransaction,
  TItemTrx,
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
import { Plus } from "lucide-react";
import { Textarea } from "../ui/textarea";

interface ICreateTransactionForm {
  items: TItemTrx[];
  supplier: TSupplierTrx[];
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
    quantityDetailTransaction: "Jumlah Dipesan",
    quantityCheck: "Jumlah Baik",
    quantityDifference: "Jumlah Rusak",
  },
} as const;

function CreateTransactionForm({
  items,
  supplier,
}: Readonly<ICreateTransactionForm>) {
  const [isPending, startTransition] = React.useTransition();

  const schema = CreateTransactionTestSchema(items);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      typeTransaction: "IN",
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

  const watchType = useWatch({
    control: form.control,
    name: "typeTransaction",
  });

  // Watch SEMUA detail sekaligus → ini kunci performa + stabilitas
  const watchDetails = useWatch({
    control: form.control,
    name: "detail",
  });

  const prevTypeRef = useRef<string | undefined>(undefined);

  React.useEffect(() => {
    // Pertama kali render → inisialisasi
    if (prevTypeRef.current === undefined) {
      prevTypeRef.current = watchType;
      return;
    }

    // Jika tipe tidak berubah → skip
    if (!watchType || watchType === prevTypeRef.current) {
      prevTypeRef.current = watchType;
      return;
    }

    // Ambil data saat ini
    const currentDetails = form.getValues("detail") || [];

    // === Cek apakah ada data yang benar-benar diisi ===
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasFilledData = currentDetails.some((item: any) => {
      return (
        item?.itemId ||
        item?.supplierId ||
        (item?.quantityDetailTransaction ?? 0) > 0 ||
        (item?.quantityCheck ?? 0) > 0 ||
        (item?.note?.trim() ?? "") !== ""
      );
    });

    // Jika belum ada data penting → langsung ganti tanpa drama
    if (!hasFilledData) {
      prevTypeRef.current = watchType;
      return;
    }

    // === ADA DATA PENTING → simpan dulu, jangan langsung reset! ===
    const oldType = prevTypeRef.current as typeTransactionType;
    const oldDetails = structuredClone(currentDetails); // deep clone aman

    // Kembalikan tipe sementara (biar UI tidak langsung berubah)
    form.setValue("typeTransaction", oldType, { shouldValidate: false });

    // Tampilkan toast Sonner dengan Undo + Lanjutkan
    toast("Jenis Transaksi Change", {
      description: "All detail data will be reset if you proceed.",
      duration: 15000,
      action: {
        label: "Undo",
        onClick: () => {
          form.setValue("typeTransaction", oldType);
          form.setValue("detail", oldDetails);
          prevTypeRef.current = oldType;
          toast.success("Changes reverted.");
        },
      },
      cancel: {
        label: "Ok",
        onClick: () => {
          prevTypeRef.current = watchType;
          form.setValue("typeTransaction", watchType);
          form.setValue("detail", [
            {
              itemId: "",
              supplierId: "",
              quantityDetailTransaction: 0,
              quantityCheck: 0,
              quantityDifference: 0,
              note: "",
            },
          ]);
          toast.success("Jenis Transaksi updated. Details have been reset.");
        },
      },
    });
  }, [watchType, form, watchDetails]);

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

      // Hanya update jika ada perubahan → hindari infinite loop
      const currentQtySystem = form.getValues(
        `detail.${index}.quantityDetailTransaction`
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
  }, [watchType, watchDetails, items, form]); // watchDetails berubah → trigger effect

  // Jangan reset detail saat ganti type! Hanya set default saat pertama kali mount
  React.useEffect(() => {
    const currentDetails = form.getValues("detail");
    if (!currentDetails || currentDetails.length === 0) {
      form.setValue("detail", [
        {
          itemId: "",
          supplierId: "",
          quantityDetailTransaction: 0,
          quantityCheck: 0,
          quantityDifference: 0,
          note: "",
        },
      ]);
    }
  }, [form]); // Hanya sekali saat mount

  // --- Handlers ---
  const handleAddItem = useCallback(() => {
    if (fields.length >= 20) {
      form.setError("detail", { message: "Maximum 20 data allowed." });
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
  }, [fields.length, append, form]);

  const handleRemove = useCallback(
    (index: number) => {
      if (fields.length > 1) remove(index);
    },
    [fields.length, remove]
  );

  const onSubmit = (values: z.infer<typeof schema>) => {
    startTransition(() => {
      createTransaction(values).then((data) => {
        if (data.ok) {
          form.reset();
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Buat Transaksi</CardTitle>
        <CardDescription className="text-base">
          Pilih jenis transaksi (Cek, Pemesanan atau bahan baku keluar) lalu
          tambahkan minimal satu bahan baku.
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
                        <SelectValue placeholder="Select type" />
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

            {/* Transaction Details */}
            <div className="space-y-4">
              <FormLabel>Detail Transaksi</FormLabel>

              {fields.map((field, index) => {
                // const itemId = form.getValues(`detail.${index}.itemId`);
                // const selectedItem = items.find((i) => i.idItem === itemId);

                const currentDetail = watchDetails?.[index] || {};
                const selectedItem = currentDetail.itemId
                  ? items.find((i) => i.idItem === currentDetail.itemId)
                  : null;
                const isDisable = watchType === "CHECK";

                return (
                  <Card key={field.id} className="p-4">
                    <CardHeader className="p-0 font-medium text-gray-700">
                      Data #{index + 1}
                    </CardHeader>
                    <CardContent>
                      <div
                        className={cn(
                          "grid p-0 grid-cols-1 gap-4",
                          watchType === "IN" && "md:grid-cols-3 mb-4",
                          watchType === "OUT" && "md:grid-cols-2 mb-4",
                          watchType === "CHECK" && "md:grid-cols-4 mb-2"
                        )}
                      >
                        {/* Item Select */}
                        <CustomSelect
                          name={`detail.${index}.itemId`}
                          label="Bahan Baku"
                          control={form.control}
                          data={items}
                          valueKey="idItem"
                          labelKey="nameItem"
                          required
                        />

                        {/* Supplier (only IN) */}
                        {watchType === "IN" && (
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

                        {/* Quantity Detail */}
                        <div className="space-y-2">
                          <FormField
                            control={form.control}
                            name={`detail.${index}.quantityDetailTransaction`}
                            render={({ field: qtyField }) => (
                              <FormItem>
                                <FormLabel>
                                  {labelMap[watchType]
                                    ?.quantityDetailTransaction ?? "Quantity"}
                                </FormLabel>
                                <div className="flex items-center gap-2">
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...qtyField}
                                      value={
                                        qtyField.value === null
                                          ? ""
                                          : qtyField.value
                                      }
                                      onChange={(e) => {
                                        const raw = e.target.value;

                                        // jika kosong → jadikan null (bukan 0)
                                        if (raw === "") {
                                          qtyField.onChange(null);
                                          return;
                                        }

                                        // selain itu → number
                                        qtyField.onChange(
                                          e.target.valueAsNumber
                                        );
                                      }}
                                      disabled={isDisable}
                                    />
                                  </FormControl>
                                  {selectedItem && (
                                    <span className="text-sm min-w-10 capitalize">
                                      {selectedItem.nameUnit}
                                    </span>
                                  )}
                                </div>
                                {isDisable ||
                                  (watchType === "OUT" && selectedItem && (
                                    <p className="text-xs text-muted-foreground">
                                      Stok Saat Ini: {selectedItem.qty}
                                    </p>
                                  ))}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Quantity Check */}
                        {isDisable && (
                          <div className="space-y-2">
                            <FormField
                              control={form.control}
                              name={`detail.${index}.quantityCheck`}
                              render={({ field: checkField }) => (
                                <FormItem>
                                  <FormLabel>
                                    {labelMap[watchType]?.quantityCheck ??
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
                                              }
                                            );

                                            return;
                                          }

                                          // Convert ke number kalau tidak kosong
                                          const checkVal =
                                            e.target.valueAsNumber;
                                          checkField.onChange(checkVal);

                                          // Ambil qty system
                                          const transQty =
                                            form.getValues(
                                              `detail.${index}.quantityDetailTransaction`
                                            ) || 0;

                                          // Hitung selisih
                                          const diff = checkVal - transQty;

                                          form.setValue(
                                            `detail.${index}.quantityDifference`,
                                            diff,
                                            {
                                              shouldDirty: true,
                                            }
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
                          </div>
                        )}

                        {/* Quantity Difference */}
                        {isDisable && (
                          <div className="space-y-2">
                            <FormField
                              control={form.control}
                              name={`detail.${index}.quantityDifference`}
                              render={({ field: diffField }) => (
                                <FormItem>
                                  <FormLabel>
                                    {labelMap[watchType]?.quantityDifference ??
                                      "Selisih"}
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
                                        : "text-muted-foreground"
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
                          </div>
                        )}
                      </div>
                      {watchType !== "IN" && (
                        <div className="space-y-2">
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
                        </div>
                      )}
                    </CardContent>
                    <CardDescription className="w-full">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => handleRemove(index)}
                        disabled={fields.length === 1}
                      >
                        Delete
                      </Button>
                    </CardDescription>
                  </Card>
                );
              })}

              {/* Global Error */}
              {form.formState.errors.detail?.message && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.detail.message}
                </p>
              )}

              {/* Add Item */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleAddItem}
                disabled={fields.length >= 20}
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Detail
              </Button>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating..." : "Create Transaction"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function DeleteTransactionForm({ onSuccess, data }: IDeleteTransactionForm) {
  const [isPending, startTransition] = React.useTransition();

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

function UpdateTransactionForm({ onSuccess, data }: IDeleteTransactionForm) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof UpdateTransactionSchema>>({
    resolver: zodResolver(UpdateTransactionSchema),
    defaultValues: {
      idTransaction: data.idTransaction,
      typeTransaction: data.typeTransaction,
      statusTransaction: undefined,
    },
    mode: "onChange",
  });

  const valueSelect =
    data.typeTransaction === "IN"
      ? STATUS_TRANSACTION
      : STATUS_TRANSACTION.filter((s) =>
          ["COMPLETED", "CANCELLED"].includes(s.value)
        );

  const onSubmit = (values: z.infer<typeof UpdateTransactionSchema>) => {
    startTransition(() => {
      updateTransaction(values).then((data) => {
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
            name="statusTransaction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Transaksi</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString() ?? ""}
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

function AddDetailTransactionForm({
  onSuccess,
  data,
  items,
  supplier,
}: IAddDetailTransactionForm) {
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
          qtyCheck - qtySystem
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
                                      }
                                    );

                                    return;
                                  }

                                  // Convert ke number kalau tidak kosong
                                  const checkVal = e.target.valueAsNumber;
                                  checkField.onChange(checkVal);

                                  // Ambil qty system
                                  const transQty =
                                    form.getValues(
                                      `detail.${index}.quantityDetailTransaction`
                                    ) || 0;

                                  // Hitung selisih
                                  const diff = checkVal - transQty;

                                  form.setValue(
                                    `detail.${index}.quantityDifference`,
                                    diff,
                                    {
                                      shouldDirty: true,
                                    }
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
                                : "text-muted-foreground"
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
}: IUpdateStatusDetailTransactionForm) {
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
          ["COMPLETED", "CANCELLED"].includes(s.value)
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
}: IUpdateDetailTransactionForm) {
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
                      value={isNaN(field.value) ? "" : field.value}
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
                      value={isNaN(field.value) ? "" : field.value}
                      onChange={(e) => {
                        const qtyCheck = e.target.valueAsNumber;
                        field.onChange(qtyCheck);

                        // Ambil qtyDetail dari form (sudah di-load dari data)
                        const qtyDetail = form.getValues(
                          "quantityDetailTransaction"
                        );

                        // Hitung selisih
                        const diff = qtyCheck - qtyDetail;

                        // Set hasilnya ke quantityDifference
                        form.setValue(
                          "quantityDifference",
                          isNaN(diff) ? 0 : diff
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
                      value={isNaN(field.value) ? "" : field.value}
                      disabled
                    />
                  </FormControl>
                  <FormDescription
                    className={cn(
                      field.value > 0
                        ? "text-green-600"
                        : field.value < 0
                        ? "text-red-600"
                        : "text-muted-foreground"
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
}: IDeleteDetailTransactionForm) {
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
