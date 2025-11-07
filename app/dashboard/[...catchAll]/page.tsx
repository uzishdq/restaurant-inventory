import { notFound } from "next/navigation";

export default function DashboardCatchAll() {
  notFound(); // akan render app/dashboard/not-found.tsx
}
