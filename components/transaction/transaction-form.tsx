"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

import {
  CreateTransactionSchema,
  DeleteTransactionSchema,
} from "@/lib/schema-validation";
import {
  Form,
  FormControl,
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
import { TYPE_TRANSACTION } from "@/lib/constant";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { TItemTrx, TSupplierTrx, TTransaction } from "@/lib/type-data";
import CustomSelect from "../ui/custom-select";
import {
  createTransaction,
  deleteTransaction,
} from "@/lib/server/actions/action-transaction";

interface ICreateTransactionForm {
  items: TItemTrx[];
  supplier: TSupplierTrx[];
}

function CreateTransactionForm({ items, supplier }: ICreateTransactionForm) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof CreateTransactionSchema>>({
    resolver: zodResolver(CreateTransactionSchema),
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

  const onSubmit = (values: z.infer<typeof CreateTransactionSchema>) => {
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
          and adding at least one product detail below.
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
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <CardHeader className="p-0 font-medium text-gray-700">
                    Item #{index + 1}
                  </CardHeader>
                  <CardContent className="grid p-0 grid-cols-1 gap-4 md:grid-cols-3">
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
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={isNaN(field.value) ? "" : field.value}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                          <FormMessage />
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
              ))}

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
                onClick={() =>
                  append({
                    itemId: "",
                    supplierId: "",
                    quantityDetailTransaction: 0,
                  })
                }
              >
                + Add Item
              </Button>
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

interface IDeleteTransactionForm {
  data: TTransaction;
}

function DeleteTransactionForm({ data }: IDeleteTransactionForm) {
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

export { CreateTransactionForm, DeleteTransactionForm };
