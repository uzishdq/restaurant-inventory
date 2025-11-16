"use client";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
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
} from "@/lib/type-data";
import CustomSelect from "../ui/custom-select";
import {
  addDetailTransaction,
  createTransaction,
  deleteDetailTransaction,
  deleteTransaction,
  updateDetailTransaction,
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

interface IDeleteDetailTransactionForm {
  onSuccess?: () => void;
  data: TDetailTransaction;
}

function CreateTransactionForm({ items, supplier }: ICreateTransactionForm) {
  const [isPending, startTransition] = React.useTransition();

  const schema = CreateTransactionTestSchema(items);
  type FormValues = z.infer<typeof schema>;

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

  const watchDetails = useWatch({ control: form.control, name: "detail" });

  useEffect(() => {
    form.reset({
      typeTransaction: watchType,
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
    });
  }, [watchType, form.reset, form]);

  // --- Memo: Map selected items ---
  const selectedItemsMap = useMemo(() => {
    const map = new Map<string, TItemTrx>();
    watchDetails?.forEach((detail, index) => {
      if (detail?.itemId) {
        const item = items.find((i) => i.idItem === detail.itemId);
        if (item) map.set(`${index}`, item);
      }
    });
    return map;
  }, [watchDetails, items]);

  // --- Auto-fill & Auto-calculate (IN & OUT) ---
  const prevDetailsRef = useRef<FormValues["detail"]>([]);

  useEffect(() => {
    if (!watchDetails || watchDetails.length === 0) {
      prevDetailsRef.current = watchDetails;
      return;
    }

    let hasChanges = false;
    const newValues: typeof watchDetails = [...watchDetails];

    watchDetails.forEach((detail, index) => {
      const selectedItem = items.find((i) => i.idItem === detail.itemId);
      if (!selectedItem) return;

      const qtyDetail = detail.quantityDetailTransaction ?? 0;
      const qtyCheck = detail.quantityCheck ?? 0;
      const currentDiff = detail.quantityDifference ?? 0;

      // Auto-fill quantityDetailTransaction hanya jika 0 dan tipe OUT
      if (watchType === "CHECK") {
        newValues[index] = {
          ...newValues[index],
          quantityDetailTransaction: selectedItem.qty,
        };
        hasChanges = true;
      }

      // Auto-calculate difference: quantityDetailTransaction - quantityCheck
      const expectedDiff = qtyCheck - qtyDetail;
      if (currentDiff !== expectedDiff) {
        newValues[index] = {
          ...newValues[index],
          quantityDifference: expectedDiff,
        };
        hasChanges = true;
      }
    });

    if (hasChanges) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const safeStringify = (obj: any) =>
        JSON.stringify(obj, (_, v) => (v === undefined ? null : v));

      if (safeStringify(newValues) !== safeStringify(prevDetailsRef.current)) {
        newValues.forEach((val, idx) => {
          form.setValue(
            `detail.${idx}.quantityDetailTransaction`,
            val.quantityDetailTransaction!,
            {
              shouldValidate: false,
              shouldDirty: true,
            }
          );
          form.setValue(
            `detail.${idx}.quantityDifference`,
            val.quantityDifference!,
            {
              shouldValidate: false,
              shouldDirty: true,
            }
          );
        });
        prevDetailsRef.current = newValues;
      }
    }
  }, [watchType, watchDetails, form, items]);

  // --- Handlers ---
  const handleAddItem = useCallback(() => {
    if (fields.length >= 20) {
      form.setError("detail", { message: "Maximum 20 items allowed." });
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
        <CardTitle className="text-xl">Create Transaction</CardTitle>
        <CardDescription className="text-base">
          Create a new transaction by choosing type (Stock In, Stock Out or
          Stock Check) and adding at least one item detail below.
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
                  <FormLabel>Transaction Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
              <FormLabel>Transaction Details</FormLabel>

              {fields.map((field, index) => {
                const selectedItem = selectedItemsMap.get(`${index}`);
                const isDisable = watchType === "CHECK";

                return (
                  <Card key={field.id} className="p-4">
                    <CardHeader className="p-0 font-medium text-gray-700">
                      Item #{index + 1}
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
                          label="Item"
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
                            label="Store"
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
                                <FormLabel>Quantity</FormLabel>
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
                                      Stock: {selectedItem.qty}
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
                                  <FormLabel>Quantity Check</FormLabel>
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
                                  <FormLabel>Difference</FormLabel>
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
                                      ? `+${diffField.value} excess`
                                      : diffField.value < 0
                                      ? `${diffField.value} shortage`
                                      : "Matched"}
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
                    <CardDescription className="flex justify-end mr-5">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemove(index)}
                        disabled={fields.length === 1}
                      >
                        Remove
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
                Add Item
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
            <FormLabel>Transaction</FormLabel>
            <div className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-muted/20">
              {data.idTransaction}
            </div>
          </FormItem>
        </div>
        <div className="space-y-2">
          <FormItem>
            <FormLabel>Created By</FormLabel>
            <div className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-muted/20">
              {data.nameUser}
            </div>
          </FormItem>
        </div>
        <div className="space-y-2">
          <FormItem>
            <FormLabel>Total Item</FormLabel>
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
      statusTransaction: "CANCELLED",
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
                <FormLabel>Status Transaction</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Status" />
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

  const form = useForm<z.infer<typeof AddTransactionDetailSchema>>({
    resolver: zodResolver(AddTransactionDetailSchema),
    defaultValues: {
      idTransaction: data.idTransaction,
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

  const watchedDetails = useWatch({ control: form.control, name: "detail" });

  const onSubmit = (values: z.infer<typeof AddTransactionDetailSchema>) => {
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
          <FormLabel>Transaction Details</FormLabel>

          {fields.map((field, index) => {
            const selectedItem = items.find(
              (it) => it.idItem === watchedDetails?.[index]?.itemId
            );

            return (
              <Card key={field.id}>
                <CardHeader className="font-medium text-gray-700">
                  Item #{index + 1}
                </CardHeader>
                <CardContent className="space-y-4">
                  <CustomSelect
                    name={`detail.${index}.itemId`}
                    label="Item"
                    control={form.control}
                    data={items}
                    valueKey="idItem"
                    labelKey="nameItem"
                    required
                  />

                  <CustomSelect
                    name={`detail.${index}.supplierId`}
                    label="Store"
                    control={form.control}
                    data={supplier}
                    valueKey="idSupplier"
                    labelKey="store_name"
                    required
                  />

                  <FormField
                    control={form.control}
                    name={`detail.${index}.quantityDetailTransaction`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={isNaN(field.value) ? "" : field.value}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                              placeholder="Enter quantity"
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
                            Current Stock: {selectedItem.qty}
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemove(index)}
                      disabled={fields.length === 1}
                    >
                      Remove
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
            + Add Item
          </Button>
        </div>

        <Button type="submit" className="w-full mt-2" disabled={isPending}>
          {isPending ? "Loading..." : "Save"}
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

  const form = useForm<z.infer<typeof UpdateTransactionDetailSchema>>({
    resolver: zodResolver(UpdateTransactionDetailSchema),
    defaultValues: {
      idDetailTransaction: data.idDetailTransaction,
      itemId: data.itemId,
      supplierId: data.supplierId,
      quantityDetailTransaction: data.quantityDetailTransaction,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof UpdateTransactionDetailSchema>) => {
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
          label="Item"
          control={form.control}
          data={items}
          valueKey="idItem"
          labelKey="nameItem"
          required
        />
        <CustomSelect
          name="supplierId"
          label="Store"
          control={form.control}
          data={suppliers}
          valueKey="idSupplier"
          labelKey="store_name"
          required
        />
        <FormField
          control={form.control}
          name="quantityDetailTransaction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={isNaN(field.value) ? "" : field.value}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Loading..." : "Update"}
        </Button>
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
            <FormLabel>Item</FormLabel>
            <div className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-muted/20">
              {data.nameItem}
            </div>
          </FormItem>
        </div>
        <div className="space-y-2">
          <FormItem>
            <FormLabel>Store</FormLabel>
            <div className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-muted/20">
              {data.store_name}
            </div>
          </FormItem>
        </div>
        <div className="space-y-2">
          <FormItem>
            <FormLabel>Qyt</FormLabel>
            <div className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-muted/20">
              {data.quantityDetailTransaction} / {data.nameUnit}
            </div>
          </FormItem>
        </div>
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
  UpdateDetailTransactionForm,
  DeleteDetailTransactionForm,
};
