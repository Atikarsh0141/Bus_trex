import { AppShell } from "@/components/app-shell";
import { DriverAlertForm } from "@/components/driver-comms/driver-alert-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Zap } from "lucide-react";

export default function DriverCommsPage() {
  return (
    <AppShell>
       <div className="flex flex-col gap-4">
        <header>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Driver Communication</h1>
          <p className="text-muted-foreground">
            Send critical information to drivers using an AI-optimized channel.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
                <DriverAlertForm />
            </div>
            <div className="lg:col-span-2">
                <Card className="border-dashed border-accent">
                    <CardHeader className="flex-row gap-4 items-start">
                        <div className="bg-accent/10 p-2 rounded-lg">
                            <Zap className="h-6 w-6 text-accent"/>
                        </div>
                        <div>
                            <CardTitle className="font-headline">How it works</CardTitle>
                            <CardDescription>
                                This tool uses AI to determine the best way to contact a driver based on the message's urgency and content.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <strong className="text-foreground shrink-0 w-24">Critical Urgency:</strong>
                                <span>
                                    For incidents like accidents or road closures, the AI suggests a direct <span className="font-semibold text-foreground">voice call</span> to ensure immediate attention.
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                               <strong className="text-foreground shrink-0 w-24">Medium Urgency:</strong>
                               <span>
                                    For passenger load predictions or minor delays, a <span className="font-semibold text-foreground">chat message</span> is recommended for non-intrusive communication.
                               </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <strong className="text-foreground shrink-0 w-24">Low Urgency:</strong>
                                <span>
                                General updates or reminders are sent as a simple <span className="font-semibold text-foreground">push notification</span> to avoid distracting the driver.
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
