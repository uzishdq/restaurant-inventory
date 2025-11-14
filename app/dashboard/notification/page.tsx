import NotificationCard from "@/components/ui/notification-card";
import RenderError from "@/components/ui/render-error";
import { auth } from "@/lib/auth";
import { LABEL } from "@/lib/constant";
import { getNotification } from "@/lib/server/data/data-notifikasi";

export default async function NotificationPage() {
  const session = await auth();
  const idUser = session?.user?.id;

  if (!idUser) {
    return RenderError(LABEL.ERROR.NOT_LOGIN);
  }

  const [notifications] = await Promise.all([getNotification(idUser)]);

  if (!notifications.ok || !notifications.data) {
    return RenderError(LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className="space-y-4">
      {notifications.data.map((notif) => (
        <NotificationCard
          key={notif.idNotification}
          date={notif.tanggalNotification}
          message={notif.messageNotification}
          status={notif.statusNotification}
        />
      ))}
    </div>
  );
}
