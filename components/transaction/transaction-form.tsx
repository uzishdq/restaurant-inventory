"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import {
  AddTransactionDetailSchema,
  CreateTransactionTestSchema,
  DeleteTransactionDetailSchema,
  DeleteTransactionSchema,
  PurchaseRequestSchema,
  UpdateTransactionDetailSchema,
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
import { STATUS_TRANSACTION, TYPE_TRANSACTION } from "@/lib/constant";
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
  updatePurchaseRequest,
} from "@/lib/server/actions/action-transaction";
import { cn } from "@/lib/utils";

interface ICreateTransactionForm {
  items: TItemTrx[];
  supplier: TSupplierTrx[];
}

function CreateTransactionForm({ items, supplier }: ICreateTransactionForm) {
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

  const watchedDetails = useWatch({ control: form.control, name: "detail" });

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
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Create Transaction</CardTitle>
        <CardDescription className="text-base">
          Create a new transaction by choosing the type (Stock In or Stock Out)
          and adding at least one item detail below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="typeTransaction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Transaction" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TYPE_TRANSACTION.map((item, index) => (
                          <SelectItem key={index} value={item.value}>
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
            {/* DETAIL TRANSACTION */}
            <div className="space-y-4">
              <FormLabel>Transaction Details</FormLabel>

              {fields.map((field, index) => {
                const selectedItem = items.find(
                  (it) => it.idItem === watchedDetails?.[index]?.itemId
                );

                return (
                  <Card key={field.id} className="p-4">
                    <CardHeader className="p-0 font-medium text-gray-700">
                      Item #{index + 1}
                    </CardHeader>
                    <CardContent
                      className={cn(
                        "grid p-0 grid-cols-1 gap-4",
                        watchType === "IN" ? "md:grid-cols-3" : "md:grid-cols-2"
                      )}
                    >
                      <CustomSelect
                        name={`detail.${index}.itemId`}
                        label="Item"
                        control={form.control}
                        data={items}
                        valueKey="idItem"
                        labelKey="nameItem"
                        required
                      />
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
                            {watchType === "OUT" && selectedItem && (
                              <FormDescription>
                                Current Stock: {selectedItem.qty}
                              </FormDescription>
                            )}
                          </FormItem>
                        )}
                      />
                    </CardContent>

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
                  </Card>
                );
              })}

              {/* Error global untuk detail array */}
              {form.formState.errors.detail && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.detail.message?.toString()}
                </p>
              )}
              {fields.length <= 20 && (
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
                    });
                  }}
                >
                  + Add Item
                </Button>
              )}
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isPending}>
              {isPending ? "Loading..." : "Create"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

interface IAddDetailTransactionForm {
  onSuccess?: () => void;
  data: TDetailTransaction;
  items: TItemTrx[];
  supplier: TSupplierTrx[];
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

interface IDeleteTransactionForm {
  onSuccess?: () => void;
  data: TTransaction;
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

function PurchaseRequestForm({ onSuccess, data }: IDeleteTransactionForm) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof PurchaseRequestSchema>>({
    resolver: zodResolver(PurchaseRequestSchema),
    defaultValues: {
      idTransaction: data.idTransaction,
      statusTransaction: "ORDERED",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof PurchaseRequestSchema>) => {
    startTransition(() => {
      updatePurchaseRequest(values).then((data) => {
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
                    {STATUS_TRANSACTION.map((item, index) => (
                      <SelectItem key={index} value={item.value}>
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

interface IUpdateDetailTransactionForm {
  onSuccess?: () => void;
  data: TDetailTransaction;
  items: TItemTrx[];
  suppliers: TSupplierTrx[];
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

interface IDeleteDetailTransactionForm {
  onSuccess?: () => void;
  data: TDetailTransaction;
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
  PurchaseRequestForm,
  AddDetailTransactionForm,
  UpdateDetailTransactionForm,
  DeleteDetailTransactionForm,
};
