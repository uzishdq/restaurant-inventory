import { Badge } from "@/components/ui/badge";

interface BadgeCustomProps {
  value: string;
  category:
    | "role"
    | "statusAnggota"
    | "statusPendaftaranSimpanan"
    | "jenisSimpanan";
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
  statusAnggota: {
    ACTIVE: { variant: "default" },
    NOTACTIVE: { variant: "destructive" },
  },
  statusPendaftaranSimpanan: {
    OPEN: { variant: "default" },
    CLOSE: { variant: "secondary" },
  },
  jenisSimpanan: {
    WAJIB: { className: "bg-blue-100 text-blue-800" },
    SUKAMANA: { className: "bg-green-100 text-green-800" },
    LEBARAN: { className: "bg-yellow-100 text-yellow-800" },
    QURBAN: { className: "bg-red-100 text-red-800" },
    UBAR: { className: "bg-purple-100 text-purple-800" },
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
