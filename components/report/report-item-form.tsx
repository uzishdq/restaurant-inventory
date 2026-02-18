"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ReportItemSchema } from "@/lib/schema-validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constant";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { findReportItem } from "@/lib/server/actions/action-report";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";

export default function ReportItemForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);

  const form = useForm<z.infer<typeof ReportItemSchema>>({
    resolver: zodResolver(ReportItemSchema),
    defaultValues: {
      startDate: startDate.toISOString().slice(0, 10),
      endDate: now.toISOString().slice(0, 10),
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof ReportItemSchema>) => {
    startTransition(() => {
      findReportItem(values).then((data) => {
        if (data.ok) {
          form.reset();
          toast.success(data.message);
          const query = new URLSearchParams(values).toString();
          router.push(ROUTES.AUTH.REPORT.FIND_LAPORAN_ITEM(query));
        } else {
          toast.error(data.message);
        }
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Laporan Bahan Baku</CardTitle>
        <CardDescription className="text-base">
          Tentukan rentang tanggal untuk menampilkan laporan bahan baku sesuai
          periode yang diinginkan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Awal</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Akhir</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Loading..." : "Cari Laporan"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
