"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { TItemMovementChart } from "@/lib/type-data";

const chartConfig = {
  incoming: {
    label: "Masuk",
    color: "var(--chart-2)",
  },
  outgoing: {
    label: "Keluar",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function ChartBarMultiple({
  data,
}: Readonly<{ data: TItemMovementChart[] }>) {
  const chartData = data.map((item) => ({
    ...item,
    date: new Date(item.month).toLocaleDateString("id-ID", {
      month: "short",
      year: "numeric",
    }),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Transaksi Bahan Baku</CardTitle>
        <CardDescription>
          Melacak total aktivitas stok masuk dan keluar selama tiga bulan
          terakhir
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="incoming" fill="var(--color-incoming)" radius={4} />
            <Bar dataKey="outgoing" fill="var(--color-outgoing)" radius={4} />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
