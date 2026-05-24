'use client';

import { AppShell } from "@/components/app-shell";
import { AboutCard } from "@/components/about/about-card";
import { ContactCard } from "@/components/about/contact-card";

export default function AboutPage() {

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <header>
          <h1 className="text-3xl font-headline font-bold tracking-tight">About BUSTREX</h1>
          <p className="text-muted-foreground">Learn more about the project and its creator.</p>
        </header>
        <AboutCard />
        <ContactCard />
      </div>
    </AppShell>
  );
}
