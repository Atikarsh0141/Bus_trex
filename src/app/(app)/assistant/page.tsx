
import { AppShell } from "@/components/app-shell";
import { ChatInterface } from "@/components/assistant/chat-interface";

export default function AssistantPage() {
  return (
    <AppShell>
       <div className="flex flex-col gap-4">
        <header>
          <h1 className="text-3xl font-headline font-bold tracking-tight">AI Assistant</h1>
          <p className="text-muted-foreground">
            Ask me anything about bus routes, schedules, or the BUSTREX system.
          </p>
        </header>
        <ChatInterface />
      </div>
    </AppShell>
  );
}
