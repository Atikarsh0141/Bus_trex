'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getSuggestedAction } from '@/app/actions';
import type { SuggestedActionOutput } from '@/ai/flows/suggested-action-types';
import { Route, Zap } from 'lucide-react';
import Link from 'next/link';

type SuggestedActionCardProps = {
    favoriteRouteStatus: string;
}

export function SuggestedActionCard({ favoriteRouteStatus }: SuggestedActionCardProps) {
  const [suggestion, setSuggestion] = useState<SuggestedActionOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestion = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const hours = now.getHours();
        const timeOfDay = hours < 12 ? 'morning' : hours < 18 ? 'afternoon' : 'evening';
        
        const result = await getSuggestedAction({
            userRole: 'passenger', // This could be dynamic in a real app
            timeOfDay: timeOfDay,
            favoriteRouteStatus: favoriteRouteStatus
        });
        setSuggestion(result);
      } catch (error) {
        console.error("Failed to fetch suggestion:", error);
        // Set a fallback suggestion
        setSuggestion({
            action: 'track_bus',
            title: 'Track Your Bus',
            description: 'Check the live map for real-time bus locations.',
            cta: 'Open Map',
            href: '/map'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestion();
  }, [favoriteRouteStatus]);

  if (loading) {
    return <SuggestedActionSkeleton />;
  }

  if (!suggestion) {
    return null;
  }

  return (
    <Card className="bg-accent/10 border-accent/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-accent">
          {suggestion.title}
        </CardTitle>
        <Zap className="h-4 w-4 text-accent" />
      </CardHeader>
      <CardContent>
        <Button size="sm" asChild className="w-full">
          <Link href={suggestion.href}>{suggestion.cta}</Link>
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          {suggestion.description}
        </p>
      </CardContent>
    </Card>
  );
}

function SuggestedActionSkeleton() {
    return (
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                Next Suggested Action
                </CardTitle>
                <Route className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-9 w-full rounded-lg" />
                <Skeleton className="h-3 w-3/4 mt-2" />
            </CardContent>
          </Card>
    )
}
