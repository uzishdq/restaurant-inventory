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
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface IFormDialog {
  children: React.ReactNode;
  className?: string;
  buttonLabel: string;
  title: string;
}

export default function FormDialog({
  children,
  className,
  buttonLabel,
  title,
}: IFormDialog) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="ml-auto gap-1">
          <span className="hidden sm:inline md:inline">{buttonLabel}</span>
          <Plus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn("overflow-auto sm:max-w-[425px]", className)}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
