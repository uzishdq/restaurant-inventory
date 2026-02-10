"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TItemMovementChart } from "@/lib/type-data";

const chartConfig = {
  item: {
    label: "Item Movement",
  },
  incoming: {
    label: "Masuk",
    color: "var(--chart-2)",
  },
  outgoing: {
    label: "Keluar",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({
  data,
}: Readonly<{ data: TItemMovementChart[] }>) {
  const [open, setOpen] = React.useState(false);
  const [selectedItemId, setSelectedItemId] = React.useState<string>("");

  // Set default item saat data pertama kali dimuat
  React.useEffect(() => {
    if (data && data.length > 0 && !selectedItemId) {
      setSelectedItemId(data[0].idItem);
    }
  }, [data, selectedItemId]);

  // Ambil data item yang dipilih (with memoization)
  const selectedItemData = React.useMemo(() => {
    return data.find((item) => item.idItem === selectedItemId);
  }, [data, selectedItemId]);

  // Data untuk chart (with memoization)
  const chartData = React.useMemo(() => {
    if (!selectedItemData) return [];

    // Sort by date untuk memastikan urutan yang benar
    return [...selectedItemData.result].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [selectedItemData]);

  // Hitung total untuk statistik (with memoization)
  const totals = React.useMemo(() => {
    return chartData.reduce(
      (acc, curr) => ({
        incoming: acc.incoming + curr.incoming,
        outgoing: acc.outgoing + curr.outgoing,
      }),
      { incoming: 0, outgoing: 0 },
    );
  }, [chartData]);

  // Hitung net movement (selisih)
  const netMovement = React.useMemo(() => {
    return totals.incoming - totals.outgoing;
  }, [totals]);

  // Get selected item name
  const selectedItemName = React.useMemo(() => {
    return selectedItemData?.name || "Pilih Item";
  }, [selectedItemData]);

  // Format bulan untuk deskripsi
  const currentMonth = React.useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  }, []);

  if (!data || data.length === 0) {
    return (
      <Card className="pt-0">
        <CardHeader>
          <CardTitle className="text-lg">Transaksi Bahan Baku</CardTitle>
          <CardDescription>Tidak ada data tersedia</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-lg">Transaksi Bahan Baku</CardTitle>
          <CardDescription>Aktivitas stok bulan {currentMonth}</CardDescription>
        </div>

        {/* Searchable Select */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-fit justify-between"
            >
              <span className="truncate">{selectedItemName}</span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-0" align="end">
            <Command>
              <CommandInput placeholder="Cari item..." className="h-9" />
              <CommandList>
                <CommandEmpty>Tidak ada item ditemukan.</CommandEmpty>
                <CommandGroup>
                  {data.map((item) => (
                    <CommandItem
                      key={item.idItem}
                      value={item.name}
                      onSelect={() => {
                        setSelectedItemId(item.idItem);
                        setOpen(false);
                      }}
                    >
                      {item.name}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedItemId === item.idItem
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Masuk</p>
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--chart-2)" }}
            >
              {totals.incoming.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Keluar</p>
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--chart-1)" }}
            >
              {totals.outgoing.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Selisih</p>
            <p
              className={cn(
                "text-2xl font-bold",
                netMovement >= 0 ? "text-green-600" : "text-red-600",
              )}
            >
              {netMovement >= 0 ? "+" : ""}
              {netMovement.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[300px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillIncoming" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-incoming)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-incoming)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillOutgoing" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-outgoing)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-outgoing)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  });
                }}
              />
              <ChartTooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="incoming"
                type="monotone"
                fill="url(#fillIncoming)"
                stroke="var(--color-incoming)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Area
                dataKey="outgoing"
                type="monotone"
                fill="url(#fillOutgoing)"
                stroke="var(--color-outgoing)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] border rounded-lg bg-muted/10">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground font-medium">
                Tidak ada data transaksi
              </p>
              <p className="text-sm text-muted-foreground">
                Belum ada aktivitas untuk{" "}
                <span className="font-semibold">{selectedItemName}</span> di
                bulan {currentMonth}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
