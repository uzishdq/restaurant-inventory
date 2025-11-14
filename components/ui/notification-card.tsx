import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { statusNotificationType } from "@/lib/type-data";
import { extractNotification } from "@/lib/helper";
import { formatDateToIndo } from "@/lib/utils";

interface NotificationMessageCardProps {
  date: string | Date;
  message: string;
  status: statusNotificationType;
}

export default function NotificationCard({
  date,
  message,
  status = "PENDING",
}: NotificationMessageCardProps) {
  const { body, header } = extractNotification(message);
  return (
    <Card className="w-full rounded-xl shadow-sm border">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold">{header}</CardTitle>

            {date && (
              <p className="text-xs text-muted-foreground mt-1">
                {formatDateToIndo(date)}
              </p>
            )}
          </div>

          {status === "PENDING" && (
            <Badge
              className="bg-yellow-50 text-yellow-700 border-yellow-300"
              variant="outline"
            >
              Pending
            </Badge>
          )}
          {status === "SENT" && (
            <Badge
              className="bg-green-50 text-green-700 border-green-300"
              variant="outline"
            >
              Sent
            </Badge>
          )}
          {status === "FAILED" && (
            <Badge
              className="bg-red-50 text-red-700 border-red-300"
              variant="outline"
            >
              Failed
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <pre className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
          {body}
        </pre>
      </CardContent>
    </Card>
  );
}
