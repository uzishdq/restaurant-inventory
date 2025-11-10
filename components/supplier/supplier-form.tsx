"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  CreateSupplierSchema,
  DeleteUUIDSchema,
  UpdateSupplierSchema,
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
import { TSupplier } from "@/lib/type-data";
import { Textarea } from "../ui/textarea";
import {
  createSupplier,
  deleteSupplier,
  updateSupplier,
} from "@/lib/server/actions/action-supplier";

function CreateSupplierForm() {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof CreateSupplierSchema>>({
    resolver: zodResolver(CreateSupplierSchema),
    defaultValues: {
      store_name: "",
      addressSupplier: "",
      nameSupplier: "",
      phoneSupplier: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof CreateSupplierSchema>) => {
    startTransition(() => {
      createSupplier(values).then((data) => {
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
      buttonLabel="Create Supplier"
      title="Create New Supplier"
      className="h-fit"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="store_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="addressSupplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="nameSupplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="phoneSupplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
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

interface IUpdateSupplierForm {
  data: TSupplier;
}

function UpdateSupplierForm({ data }: IUpdateSupplierForm) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof UpdateSupplierSchema>>({
    resolver: zodResolver(UpdateSupplierSchema),
    defaultValues: {
      idSupplier: data.idSupplier,
      store_name: data.store_name,
      addressSupplier: data.addressSupplier,
      nameSupplier: data.nameSupplier,
      phoneSupplier: data.phoneSupplier,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof UpdateSupplierSchema>) => {
    startTransition(() => {
      updateSupplier(values).then((data) => {
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
            name="store_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="addressSupplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="nameSupplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="phoneSupplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
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

function DeleteSupplierForm({ data }: IUpdateSupplierForm) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof DeleteUUIDSchema>>({
    resolver: zodResolver(DeleteUUIDSchema),
    defaultValues: {
      id: data.idSupplier,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof DeleteUUIDSchema>) => {
    startTransition(() => {
      deleteSupplier(values).then((data) => {
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
            <FormLabel>Store</FormLabel>
            <div className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-muted/20">
              {data.store_name}
            </div>
          </FormItem>
        </div>
        <div className="space-y-2">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <div className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-muted/20">
              {data.nameSupplier}
            </div>
          </FormItem>
        </div>
        <Button
          type="submit"
          className="w-full"
          variant="destructive"
          disabled={isPending}
        >
          {isPending ? "Loading..." : "Delete"}
        </Button>
      </form>
    </Form>
  );
}

export { CreateSupplierForm, UpdateSupplierForm, DeleteSupplierForm };
