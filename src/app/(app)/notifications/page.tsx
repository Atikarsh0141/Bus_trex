import { AppShell } from "@/components/app-shell";
import { NotificationForm } from "@/components/notifications/notification-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

export default function NotificationsPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <header>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Personalized Notifications</h1>
          <p className="text-muted-foreground">
            Configure and test AI-powered user notifications.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
                <NotificationForm />
            </div>
            <div className="lg:col-span-2">
                <Card className="border-dashed border-primary">
                     <CardHeader className="flex-row gap-4 items-start">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Zap className="h-6 w-6 text-primary"/>
                        </div>
                        <div>
                            <CardTitle className="font-headline">Smart Delivery</CardTitle>
                            <CardDescription>
                                Our AI chooses the best notification channel based on user preferences and context.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                       <ul className="space-y-4 text-sm text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <strong className="text-foreground shrink-0 w-24">Push:</strong>
                                <span>
                                    Ideal for immediate, non-critical alerts like "Your bus is 5 minutes away."
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                               <strong className="text-foreground shrink-0 w-24">SMS:</strong>
                               <span>
                                    Used for high-priority alerts or as a fallback if push notifications aren't enabled, e.g., "Route 5 has been diverted."
                               </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <strong className="text-foreground shrink-0 w-24">In-App:</strong>
                                <span>
                                    Great for contextual information when the user is actively using the app, like "Next stop: Main Street."
                                </span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </AppShell>
  );
}
