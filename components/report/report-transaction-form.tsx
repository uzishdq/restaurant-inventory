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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { createCategory } from "@/lib/server/actions/action-category";
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

export default function ReportTransactionForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof ReportTransactionSchema>>({
    resolver: zodResolver(ReportTransactionSchema),
    defaultValues: {
      type: undefined,
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
          router.push(ROUTES.AUTH.REPORT.FIND_LAPORAN(query));
        } else {
          toast.error(data.message);
        }
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Transaction Report</CardTitle>
        <CardDescription className="text-base">
          Select the transaction type (Stock In, Out, or Check) to generate
          transaction report.
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
                  <FormLabel>Transaction Type</FormLabel>
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
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Loading..." : "View Report"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
