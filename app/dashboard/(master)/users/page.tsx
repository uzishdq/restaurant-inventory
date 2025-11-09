import { CreateAccountForm } from "@/components/account/account-form";
import { columnUsers } from "@/components/columns/column-user";
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
import { getUsers } from "@/lib/server/data/data-user";
import { UserCheck } from "lucide-react";
import React from "react";

export default async function UserPage() {
  const [users] = await Promise.all([getUsers()]);

  if (!users.ok || !users.data) {
    return RenderError(LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className=" space-y-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {users.data.length}
          </CardTitle>
          <CardAction>
            <UserCheck className="h-5 w-5 text-muted-foreground" />
          </CardAction>
        </CardHeader>
      </Card>
      <TableDateWrapper
        header="Users"
        description="User accounts and profile information for the inventory management platform"
        searchBy="nameUser"
        labelSearch="name"
        isFilterDate={true}
        filterDate="created_at"
        data={users.data}
        columns={columnUsers}
      >
        <CreateAccountForm />
      </TableDateWrapper>
    </div>
  );
}
