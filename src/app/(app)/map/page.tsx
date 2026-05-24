
'use client';

import { AppShell } from '@/components/app-shell';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import the entire Map component, ensuring it's only rendered on the client side.
// This prevents both SSR errors (like 'window is not defined') and re-initialization errors.
const Map = dynamic(() => import('@/components/map/map').then((mod) => mod.Map), {
  ssr: false,
  loading: () => (
    <div className="h-[70vh] bg-muted rounded-lg flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-2">Loading map...</p>
    </div>
  ),
});

export default function MapPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <header>
          <h1 className="text-3xl font-headline font-bold tracking-tight">
            Live Map
          </h1>
          <p className="text-muted-foreground">
            Real-time visualization of bus routes and fleet status.
          </p>
        </header>
        {/* The dynamically imported Map component is rendered here. */}
        <Map />
      </div>
    </AppShell>
  );
}
