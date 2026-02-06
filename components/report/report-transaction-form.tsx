"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ReportTransactionSchema } from "@/lib/schema-validation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ROUTES, TYPE_TRANSACTION } from "@/lib/constant";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { findReportTransaction } from "@/lib/server/actions/action-report";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";

export default function ReportTransactionForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);

  const form = useForm<z.infer<typeof ReportTransactionSchema>>({
    resolver: zodResolver(ReportTransactionSchema),
    defaultValues: {
      type: undefined,
      startDate: startDate.toISOString().slice(0, 10),
      endDate: now.toISOString().slice(0, 10),
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof ReportTransactionSchema>) => {
    startTransition(() => {
      findReportTransaction(values).then((data) => {
        if (data.ok) {
          form.reset();
          toast.success(data.message);
          const query = new URLSearchParams(values).toString();
          router.push(ROUTES.AUTH.REPORT.FIND_LAPORAN_TRANSACTION(query));
        } else {
          toast.error(data.message);
        }
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Laporan Transaksi</CardTitle>
        <CardDescription className="text-base">
          Pilih jenis transaksi (Cek, Pengadaan, atau Keluar) untuk menghasilkan
          laporan transaksi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Transaksi</FormLabel>
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
              {isPending ? "Loading..." : "View Report"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
