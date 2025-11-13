"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  CreateItemSchema,
  DeleteItemSchema,
  UpdateItemSchema,
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
import { TCategory, TItem, TUnit } from "@/lib/type-data";
import CustomSelect from "../ui/custom-select";
import {
  createItem,
  deleteItem,
  updateItem,
} from "@/lib/server/actions/action-item";

interface ICreateItemForm {
  onSuccess?: () => void;
  unit: TUnit[];
  category: TCategory[];
}

function CreateItemForm({ onSuccess, unit, category }: ICreateItemForm) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof CreateItemSchema>>({
    resolver: zodResolver(CreateItemSchema),
    defaultValues: {
      nameItem: "",
      minStock: 0,
      unitId: "",
      categoryId: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof CreateItemSchema>) => {
    startTransition(() => {
      createItem(values).then((data) => {
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
            name="nameItem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name Item</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <CustomSelect
          name="categoryId"
          label="Category"
          control={form.control}
          data={category}
          valueKey="idCategory"
          labelKey="nameCategory"
          required
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="minStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Stock</FormLabel>
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
        </div>

        <CustomSelect
          name="unitId"
          label="Unit"
          control={form.control}
          data={unit}
          valueKey="idUnit"
          labelKey="nameUnit"
          required
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Loading..." : "Create"}
        </Button>
      </form>
    </Form>
  );
}

interface IUpdateItemForm {
  onSuccess?: () => void;
  data: TItem;
  categorys: TCategory[];
  units: TUnit[];
}

function UpdateItemForm({
  onSuccess,
  data,
  categorys,
  units,
}: IUpdateItemForm) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof UpdateItemSchema>>({
    resolver: zodResolver(UpdateItemSchema),
    defaultValues: {
      idItem: data.idItem,
      nameItem: data.nameItem,
      minStock: data.minStock,
      unitId: data.unitId,
      categoryId: data.categoryId,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof UpdateItemSchema>) => {
    startTransition(() => {
      updateItem(values).then((data) => {
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
            name="nameItem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name Item</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <CustomSelect
          name="categoryId"
          label="Category"
          control={form.control}
          data={categorys}
          valueKey="idCategory"
          labelKey="nameCategory"
          required
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="minStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Stock</FormLabel>
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
        </div>

        <CustomSelect
          name="unitId"
          label="Unit"
          control={form.control}
          data={units}
          valueKey="idUnit"
          labelKey="nameUnit"
          required
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Loading..." : "Update"}
        </Button>
      </form>
    </Form>
  );
}

interface IDeleteItemForm {
  data: TItem;
}

function DeleteItemForm({ data }: IDeleteItemForm) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof DeleteItemSchema>>({
    resolver: zodResolver(DeleteItemSchema),
    defaultValues: {
      idItem: data.idItem,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof DeleteItemSchema>) => {
    startTransition(() => {
      deleteItem(values).then((data) => {
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
            <FormLabel>Name Item</FormLabel>
            <div className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-muted/20">
              {data.nameItem}
            </div>
          </FormItem>
        </div>
        <div className="space-y-2">
          <FormItem>
            <FormLabel>Category</FormLabel>
            <div className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-muted/20">
              {data.nameCategory}
            </div>
          </FormItem>
        </div>
        <Button
          type="submit"
          className="w-full"
          variant="destructive"
          disabled={isPending}
        >
          {isPending ? "Loading..." : "Detele"}
        </Button>
      </form>
    </Form>
  );
}

export { CreateItemForm, UpdateItemForm, DeleteItemForm };
