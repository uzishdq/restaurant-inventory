"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 text-center p-6">
      <h1 className="text-6xl font-bold text-destructive mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Button onClick={() => router.back()} className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Go Back
      </Button>
    </div>
  );
}
