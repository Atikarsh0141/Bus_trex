import { AppShell } from "@/components/app-shell";
import { OnTimePerformanceChart } from "@/components/analytics/on-time-chart";
import { PassengerRidershipChart } from "@/components/analytics/passengers-chart";
import { RouteEfficiencyChart } from "@/components/analytics/performance-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { onTimePerformanceData, passengerRidershipData, routeEfficiencyData } from "@/lib/data";
import { DollarSign, Clock, Users, Route } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <header>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Insights on bus performance, route efficiency, and passenger usage.</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. On-Time Performance
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92.3%</div>
              <p className="text-xs text-muted-foreground">
                +2.5% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Ridership
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Most Efficient Route
              </CardTitle>
              <Route className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Route 5</div>
              <p className="text-xs text-muted-foreground">
                98% on-time performance
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Passenger Ridership</CardTitle>
            </CardHeader>
            <CardContent>
              <PassengerRidershipChart data={passengerRidershipData} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">On-Time Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <OnTimePerformanceChart data={onTimePerformanceData} />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Route Efficiency (Passengers per Hour)</CardTitle>
          </CardHeader>
          <CardContent>
            <RouteEfficiencyChart data={routeEfficiencyData} />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
