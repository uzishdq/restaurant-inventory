"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { CreateUnitSchema, UpdateUnitSchema } from "@/lib/schema-validation";
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
import { createUnit, updateUnit } from "@/lib/server/actions/action-unit";
import { toast } from "sonner";
import { TUnit } from "@/lib/type-data";

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
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Loading..." : "Create"}
          </Button>
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

export { CreateUnitForm, UpdateUnitForm };
