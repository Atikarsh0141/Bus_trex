"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { optimizeDriverAlert } from "@/app/actions";
import type { DriverAlertOutput } from "@/ai/flows/driver-alert-optimization";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send, MessageSquare, Mic, Bell } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const formSchema = z.object({
  updateType: z.string().min(1, "Update type is required"),
  urgencyLevel: z.enum(["low", "medium", "high", "critical"]),
  information: z.string().min(10, "Information must be at least 10 characters"),
});

export function DriverAlertForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DriverAlertOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      updateType: "Passenger Load Prediction",
      urgencyLevel: "medium",
      information: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await optimizeDriverAlert(values);
      setResult(response);
    } catch (e) {
      setError("Failed to get recommendation. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }
  
  const ResultIcon = () => {
    if(!result) return null;
    switch(result.communicationMedium.toLowerCase()) {
      case "chat": return <MessageSquare className="h-5 w-5"/>
      case "voice": return <Mic className="h-5 w-5"/>
      case "notification": return <Bell className="h-5 w-5"/>
      default: return null;
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline">Send Driver Alert</CardTitle>
            <CardDescription>
              Craft a message and our AI will recommend the best delivery method.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="updateType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Update Type</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select update type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Passenger Load Prediction">Passenger Load Prediction</SelectItem>
                        <SelectItem value="Incident Report">Incident Report</SelectItem>
                        <SelectItem value="Schedule Change">Schedule Change</SelectItem>
                        <SelectItem value="Road Closure">Road Closure</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="urgencyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="information"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Information</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Heavy traffic on 5th street, expect 10-minute delay."
                      {...field}
                      rows={4}
                    />
                  </FormControl>
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
              Get Recommendation
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
                    <ResultIcon /> AI Recommendation: <span className="capitalize">{result.communicationMedium}</span>
                </AlertTitle>
                <AlertDescription className="mt-2 text-foreground">
                    <p className="font-semibold">Generated Message:</p>
                    <p className="italic">"{result.alertMessage}"</p>
                </AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
