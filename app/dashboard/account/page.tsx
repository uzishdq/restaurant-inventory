import {
  AccountForm,
  AccountResetPassword,
  AccountResetUsername,
} from "@/components/account/account-form";
import RenderError from "@/components/ui/render-error";
import { auth } from "@/lib/auth";
import { LABEL } from "@/lib/constant";
import { getAccount } from "@/lib/server/data/data-user";
import React from "react";

export default async function AccountPage() {
  const session = await auth();
  const idUser = session?.user?.id;

  if (!idUser) {
    return RenderError(LABEL.ERROR.NOT_LOGIN);
  }

  const [profile] = await Promise.all([getAccount(idUser)]);

  const isDataInvalid = !profile.ok || !profile.data;

  if (isDataInvalid) {
    return RenderError(LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className="space-y-4">
      <AccountForm data={profile.data} />
      <AccountResetUsername />
      <AccountResetPassword />
    </div>
  );
}
