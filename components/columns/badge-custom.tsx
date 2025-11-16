import { Badge } from "@/components/ui/badge";

interface BadgeCustomProps {
  value: string;
  category:
    | "role"
    | "statusDetailTransaction"
    | "typeTransaction"
    | "statusTransaction";
}

const statusStyleMap: Record<
  BadgeCustomProps["category"],
  Record<
    string,
    {
      variant?: "default" | "secondary" | "destructive" | "outline";
      className?: string;
    }
  >
> = {
  role: {
    ADMIN: { variant: "outline" },
    HEADKITCHEN: { variant: "default" },
    MANAGER: { variant: "destructive" },
  },
  statusDetailTransaction: {
    PENDING: { variant: "default" },
    ACCEPTED: { variant: "secondary" },
    CANCELLED: { variant: "destructive" },
  },
  typeTransaction: {
    CHECK: { variant: "secondary" },
    IN: { variant: "default" },
    OUT: { variant: "destructive" },
  },
  statusTransaction: {
    PENDING: { className: "bg-blue-100 text-blue-800" },
    ORDERED: { className: "bg-yellow-100 text-yellow-800" },
    RECEIVED: { className: "bg-green-100 text-green-800" },
    CANCELLED: { className: "bg-red-100 text-red-800" },
  },
};

export function BadgeCustom({ value, category }: BadgeCustomProps) {
  const categoryMap = statusStyleMap[category] || {};
  const style = categoryMap[value] || { variant: "secondary" };

  return (
    <Badge
      variant={style.variant}
      className={`capitalize ${style.className ?? ""}`}
    >
      {value}
    </Badge>
  );
}
