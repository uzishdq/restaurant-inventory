"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Pencil, Plus, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

type DialogType = "create" | "edit" | "delete";

interface FormChildProps {
  onSuccess?: () => void;
}

interface IFormDialog {
  type: DialogType;
  children: React.ReactElement<FormChildProps>;
  title?: string;
  description?: string;
  className?: string;
}

export default function FormDialog({
  type,
  children,
  title,
  description,
  className,
}: IFormDialog) {
  const [open, setOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const smoothClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 200); // match dialog transition
  };

  const handleSuccess = () => {
    smoothClose();
  };

  const config = React.useMemo(() => {
    switch (type) {
      case "create":
        return {
          icon: <Plus className="h-4 w-4" />,
          label: "Add",
          variant: "default" as const,
          size: "sm" as const,
          defaultTitle: "Add Data",
          defaultDesc: "Fill in the new data, then click Create.",
        };
      case "edit":
        return {
          icon: <Pencil className="h-4 w-4" />,
          label: "Edit",
          variant: "ghost" as const,
          size: "icon" as const,
          defaultTitle: "Edit Data",
          defaultDesc: "Modify the selected data, then click Update.",
        };
      case "delete":
        return {
          icon: <Trash className="h-4 w-4" />,
          label: "Delete",
          variant: "destructive" as const,
          size: "icon" as const,
          defaultTitle: "Delete Data",
          defaultDesc: "This action cannot be undone. Are you sure?",
        };
      default:
        return {
          icon: null,
          label: "Open",
          variant: "default" as const,
          size: "default" as const,
          defaultTitle: "Dialog",
          defaultDesc: "",
        };
    }
  }, [type]);

  const injectedChild = React.isValidElement(children)
    ? React.cloneElement(children, { onSuccess: handleSuccess })
    : children;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={config.variant}
          size={config.size}
          className={cn("ml-auto gap-1", config.size === "icon" && "w-full")}
        >
          {config.icon}
          <span className={config.icon ? "ml-2" : "mr-2"}>{config.label}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className={cn("sm:max-w-[425px]", className)}>
        <DialogHeader>
          <DialogTitle>{title ?? config.defaultTitle}</DialogTitle>
          {type !== "delete" && (
            <DialogDescription>
              {description ?? config.defaultDesc}
            </DialogDescription>
          )}

          {/* Delete warning */}
          {type === "delete" && (
            <DialogDescription className="mt-2 rounded-md border border-red-400 bg-red-50 p-3 text-sm text-red-700">
              ⚠️ <strong>Warning:</strong> Deleting this data is irreversible.
              Make sure you understand the consequences before continuing.
            </DialogDescription>
          )}
        </DialogHeader>

        <div className={cn(isClosing && "pointer-events-none")}>
          {injectedChild}
        </div>
      </DialogContent>
    </Dialog>
  );
}
