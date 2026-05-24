
"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { chat } from "@/app/actions";
import type { ChatMessage } from "@/ai/flows/assistant-flow";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
        // Use `lastElementChild` to get the viewport element inside ScrollArea
        const viewport = scrollAreaRef.current.lastElementChild;
        if(viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const userMessage: ChatMessage = { role: "user", content: values.message };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    form.reset();

    try {
      const response = await chat(newMessages);
      setMessages((prev) => [...prev, response]);
    } catch (e) {
      console.error(e);
      const errorMessage: ChatMessage = { role: "model", content: "Sorry, I had an issue. Please try again." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="h-[70vh] flex flex-col">
      <CardContent className="flex-1 p-6 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-6 pr-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-4",
                  message.role === "user" ? "justify-end" : ""
                )}
              >
                {message.role === "model" && (
                    <Avatar className="w-8 h-8 border">
                        <AvatarFallback><Bot className="w-5 h-5 text-primary"/></AvatarFallback>
                    </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-md p-3 rounded-lg",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                 {message.role === "user" && (
                    <Avatar className="w-8 h-8 border">
                        <AvatarImage src="https://picsum.photos/seed/admin/40/40" alt="User"/>
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-4">
                <Avatar className="w-8 h-8 border">
                    <AvatarFallback><Bot className="w-5 h-5 text-primary"/></AvatarFallback>
                </Avatar>
                <div className="max-w-md p-3 rounded-lg bg-muted">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-center gap-2">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Ask the assistant..." {...field} autoComplete="off" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} size="icon" aria-label="Send Message">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
}
