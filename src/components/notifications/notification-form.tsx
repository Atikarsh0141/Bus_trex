"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sendPersonalizedNotification } from "@/app/actions";
import type { NotificationOutput } from "@/ai/flows/personalized-notifications";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Smartphone, MessageCircle, AppWindow } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const formSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  busRoute: z.string().min(1, "Bus route is required"),
  stopName: z.string().min(1, "Stop name is required"),
  estimatedArrivalTime: z.string().regex(/^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/, "Invalid time format (HH:MM AM/PM)"),
  notificationTypePreference: z.enum(['push', 'sms', 'inApp']),
  message: z.string().min(1, "Message is required"),
});

export function NotificationForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NotificationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "user-12345",
      busRoute: "Route 5",
      stopName: "Main Street Station",
      estimatedArrivalTime: "05:30 PM",
      notificationTypePreference: "push",
      message: "Your bus is arriving soon.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await sendPersonalizedNotification(values);
      setResult(response);
    } catch (e) {
      setError("Failed to send notification. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const ResultIcon = () => {
    if(!result) return null;
    switch(result.notificationType) {
      case "push": return <Smartphone className="h-5 w-5"/>
      case "sms": return <MessageCircle className="h-5 w-5"/>
      case "inApp": return <AppWindow className="h-5 w-5"/>
      default: return null;
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline">Test Notification</CardTitle>
            <CardDescription>
              Simulate sending a notification to a user. The AI will choose the best channel.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID</FormLabel>
                    <FormControl><Input placeholder="user-12345" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notificationTypePreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Preference</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="push">Push</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="inApp">In-App</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="busRoute"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bus Route</FormLabel>
                        <FormControl><Input placeholder="Route 5" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="stopName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Stop Name</FormLabel>
                        <FormControl><Input placeholder="Main Street" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="estimatedArrivalTime"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>ETA</FormLabel>
                        <FormControl><Input placeholder="05:30 PM" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl><Input placeholder="Your bus is arriving soon" {...field} /></FormControl>
                  <FormDescription>The content of the notification message.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Send Test Notification
            </Button>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {result && (
              <Alert variant="default" className="bg-primary/5 border-primary/20">
                <AlertTitle className="font-headline flex items-center gap-2">
                    <ResultIcon /> AI chose: <span className="capitalize">{result.notificationType}</span>
                </AlertTitle>
                <AlertDescription className="mt-2">
                  {result.success ? "Notification sent successfully." : "Notification failed."} {result.details}
                </AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
