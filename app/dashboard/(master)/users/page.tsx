import { CreateAccountForm } from "@/components/account/account-form";
import { columnUsers } from "@/components/columns/column-user";
import SectionCard from "@/components/section/section-card";
import TableDateWrapper from "@/components/table/table-wrapper";
import FormDialog from "@/components/ui/form-dialog";
import RenderError from "@/components/ui/render-error";
import { LABEL } from "@/lib/constant";
import { getUsers } from "@/lib/server/data/data-user";
import { UserCheck } from "lucide-react";

export default async function UserPage() {
  const [users] = await Promise.all([getUsers()]);

  if (!users.ok || !users.data) {
    return RenderError(LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className=" space-y-4">
      <SectionCard
        title="Total Users"
        value={users.data.length}
        Icon={UserCheck}
      />
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
        <FormDialog type="create" title="Create User">
          <CreateAccountForm />
        </FormDialog>
      </TableDateWrapper>
    </div>
  );
}
