"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TLowItem } from "@/lib/type-data";
import {
  AlertTriangle,
  CheckCircle2,
  Minus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const ITEMS_PER_PAGE = 5;

export default function LowItemCard({ data }: Readonly<{ data: TLowItem[] }>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <Card className="rounded-2xl shadow-sm border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-semibold">
          Persediaan Bahan Baku Rendah
        </CardTitle>
        <div className="flex items-center gap-2">
          {data.length > 0 && (
            <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded-full">
              {data.length} item
            </span>
          )}
          <AlertTriangle className="h-6 w-6" />
        </div>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <ItemList data={paginatedData} />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={data.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------
// Empty state
// ----------------------------------------------------

function EmptyState() {
  return (
    <div className="py-6 text-center">
      <CheckCircle2 className="h-8 w-8 mx-auto text-green-500 mb-2" />
      <p className="text-sm text-muted-foreground">
        Semua bahan baku tersedia dalam jumlah yang cukup.
      </p>
    </div>
  );
}

// ----------------------------------------------------
// Item List
// ----------------------------------------------------

function ItemList({ data }: Readonly<{ data: TLowItem[] }>) {
  return (
    <div className="space-y-3">
      {data.map((item) => {
        const status =
          item.stockQuantity < item.minStock
            ? "LOW"
            : item.stockQuantity === item.minStock
              ? "WARN"
              : "SAFE";

        const statusColor =
          status === "LOW"
            ? "text-red-500"
            : status === "WARN"
              ? "text-yellow-500"
              : "text-green-500";

        const statusIcon =
          status === "LOW" ? (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          ) : status === "WARN" ? (
            <Minus className="h-4 w-4 text-yellow-500" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          );

        const percent = Math.min(
          (item.stockQuantity / item.minStock) * 100,
          100,
        );

        return (
          <div
            key={item.idItem}
            className="border rounded-xl p-3 shadow-sm hover:shadow-md transition-all bg-white"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium">{item.nameItem}</p>
              </div>

              <div className="flex items-center gap-1">
                {statusIcon}
                <span className={cn("text-xs font-semibold", statusColor)}>
                  {status}
                </span>
              </div>
            </div>

            {/* Quantity Info */}
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">
                Persediaan: {item.stockQuantity} {item.nameUnit ?? "-"}
              </span>
              <span className="text-muted-foreground">
                Min: {item.minStock} {item.nameUnit ?? "-"}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all",
                  status === "LOW"
                    ? "bg-red-500"
                    : status === "WARN"
                      ? "bg-yellow-500"
                      : "bg-green-500",
                )}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ----------------------------------------------------
// Pagination
// ----------------------------------------------------

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: Readonly<PaginationProps>) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show (max 5 pages at a time)
  const getPageNumbers = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | "...")[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) rangeWithDots.push(1, "...");
    else rangeWithDots.push(1);

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1)
      rangeWithDots.push("...", totalPages);
    else if (totalPages > 1) rangeWithDots.push(totalPages);

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
      {/* Info */}
      <p className="text-xs text-muted-foreground">
        {startItem}–{endItem} dari {totalItems} item
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span
              key={`dots-${idx}`}
              className="px-1 text-xs text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={cn(
                "min-w-7 h-7 text-xs rounded-lg transition-colors px-1",
                currentPage === page
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "hover:bg-gray-100 text-muted-foreground",
              )}
            >
              {page}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Halaman berikutnya"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
