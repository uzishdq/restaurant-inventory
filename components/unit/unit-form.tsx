"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  CreateUnitSchema,
  DeleteUUIDSchema,
  UpdateUnitSchema,
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
import {
  createUnit,
  deleteUnit,
  updateUnit,
} from "@/lib/server/actions/action-unit";
import { toast } from "sonner";
import { TUnit } from "@/lib/type-data";
import { DialogFooter } from "../ui/dialog";

function CreateUnitForm() {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof CreateUnitSchema>>({
    resolver: zodResolver(CreateUnitSchema),
    defaultValues: {
      nameUnit: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof CreateUnitSchema>) => {
    startTransition(() => {
      createUnit(values).then((data) => {
        if (data.ok) {
          toast.success(data.message);
          form.reset();
        } else {
          toast.error(data.message);
        }
      });
    });
  };
  return (
    <FormDialog
      buttonLabel="Create Unit"
      title="Create New Unit"
      className="h-fit"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="nameUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name Unit</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Loading..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </FormDialog>
  );
}

interface IUpdateUnitForm {
  data: TUnit;
}

function UpdateUnitForm({ data }: IUpdateUnitForm) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof UpdateUnitSchema>>({
    resolver: zodResolver(UpdateUnitSchema),
    defaultValues: {
      idUnit: data.idUnit,
      nameUnit: data.nameUnit,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof UpdateUnitSchema>) => {
    startTransition(() => {
      updateUnit(values).then((data) => {
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
            name="nameUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name Unit</FormLabel>
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

function DeleteUnitForm({ data }: IUpdateUnitForm) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof DeleteUUIDSchema>>({
    resolver: zodResolver(DeleteUUIDSchema),
    defaultValues: {
      id: data.idUnit,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof DeleteUUIDSchema>) => {
    startTransition(() => {
      deleteUnit(values).then((data) => {
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
            <FormLabel>Name Unit</FormLabel>
            <div className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-muted/20">
              {data.nameUnit}
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

export { CreateUnitForm, UpdateUnitForm, DeleteUnitForm };
