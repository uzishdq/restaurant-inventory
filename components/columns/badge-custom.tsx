import { Badge } from "@/components/ui/badge";
import { BadgeCategory, getBadgeConfig } from "@/lib/badge-config";
import { cn } from "@/lib/utils";

interface BadgeCustomProps {
  value: string;
  category: BadgeCategory;
  className?: string;
}

export function BadgeCustom({
  value,
  category,
  className,
}: Readonly<BadgeCustomProps>) {
  const badgeConfig = getBadgeConfig(category, value);

  if (!badgeConfig) {
    return (
      <Badge variant="outline" className={className}>
        {value}
      </Badge>
    );
  }

  return (
    <Badge className={cn(badgeConfig.color, "text-white", className)}>
      <div className="flex items-center gap-1">
        <span>{badgeConfig.label}</span>
      </div>
    </Badge>
  );
}
