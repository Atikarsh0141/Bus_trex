
import { AppShell } from "@/components/app-shell";
import { RoutesTable } from "@/components/routes/routes-table";
import { routes } from "@/lib/data";

export default function RoutesPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <header>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Route Management</h1>
          <p className="text-muted-foreground">Define and manage AI-optimized bus routes, waypoints, and schedules.</p>
        </header>
        <RoutesTable data={routes} />
      </div>
    </AppShell>
  );
}
