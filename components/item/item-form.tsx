"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { CreateItemSchema, UpdateItemSchema } from "@/lib/schema-validation";
import FormDialog from "../ui/form-dialog";
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
import { createItem, updateItem } from "@/lib/server/actions/action-item";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Pencil } from "lucide-react";

interface ICreateItemForm {
  unit: TUnit[];
  category: TCategory[];
}

function CreateItemForm({ unit, category }: ICreateItemForm) {
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
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
    });
  };
  return (
    <FormDialog
      buttonLabel="Create Item"
      title="Create New Item"
      className="h-fit"
    >
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
    </FormDialog>
  );
}

interface IUpdateItemForm {
  data: TItem;
  categorys: TCategory[];
  units: TUnit[];
}

function UpdateItemForm({ data, categorys, units }: IUpdateItemForm) {
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
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="w-full">
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Update item, then click <strong>Update</strong> to confirm.
          </DialogDescription>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
}

export { CreateItemForm, UpdateItemForm };
