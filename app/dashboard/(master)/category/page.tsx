import { CreateCategoryForm } from "@/components/category/category-form";
import { columnCategory } from "@/components/columns/column-category";
import TableDateWrapper from "@/components/table/table-wrapper";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RenderError from "@/components/ui/render-error";
import { LABEL } from "@/lib/constant";
import { getCategory } from "@/lib/server/data/data-category";
import { Blocks } from "lucide-react";
import React from "react";

export default async function CategoryPage() {
  const [category] = await Promise.all([getCategory()]);

  if (!category.ok || !category.data) {
    return RenderError(LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className=" space-y-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Category</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {category.data.length}
          </CardTitle>
          <CardAction>
            <Blocks className="h-5 w-5 text-muted-foreground" />
          </CardAction>
        </CardHeader>
      </Card>
      <TableDateWrapper
        header="Category"
        description="A collection of item categories used to organize products by type, such as vegetables, meat, or spices"
        searchBy="nameCategory"
        labelSearch="name"
        isFilterDate={false}
        filterDate=""
        data={category.data}
        columns={columnCategory}
      >
        <CreateCategoryForm />
      </TableDateWrapper>
    </div>
  );
}
