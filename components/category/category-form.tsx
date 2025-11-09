"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from "@/lib/schema-validation";
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
import {
  createCategory,
  updateCategory,
} from "@/lib/server/actions/action-category";
import { TCategory } from "@/lib/type-data";

function CreateCategoryForm() {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof CreateCategorySchema>>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      nameCategory: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof CreateCategorySchema>) => {
    startTransition(() => {
      createCategory(values).then((data) => {
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
      buttonLabel="Create Category"
      title="Create New Category"
      className="h-fit"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="nameCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name Category</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Loading..." : "Create"}
          </Button>
        </form>
      </Form>
    </FormDialog>
  );
}

interface IUpdateCategoryForm {
  data: TCategory;
}

function UpdateCategoryForm({ data }: IUpdateCategoryForm) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof UpdateCategorySchema>>({
    resolver: zodResolver(UpdateCategorySchema),
    defaultValues: {
      idCategory: data.idCategory,
      nameCategory: data.nameCategory,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof UpdateCategorySchema>) => {
    startTransition(() => {
      updateCategory(values).then((data) => {
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
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="nameCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name Category</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Loading..." : "Update"}
        </Button>
      </form>
    </Form>
  );
}

export { CreateCategoryForm, UpdateCategoryForm };
