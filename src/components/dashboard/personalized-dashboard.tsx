
'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { UserNotification } from '@/docs/backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, Bus, Star } from 'lucide-react';
import { Badge } from '../ui/badge';
import { routes } from '@/lib/data';
import Link from 'next/link';
import { Button } from '../ui/button';
import { SuggestedActionCard } from './suggested-action-card';

type PersonalizedDashboardProps = {
  user: User;
};

// Mock data for favorite route and stats
const favoriteRoute = routes[0]; 
const userStats = {
  tripsTaken: 128,
  onTimeArrivals: 120,
};

export function PersonalizedDashboard({ user }: PersonalizedDashboardProps) {
  const firestore = useFirestore();
  const notificationsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'users', user.uid, 'notifications'), limit(5)) : null,
    [firestore, user.uid]
  );
  
  const { data: notifications, isLoading } = useCollection<UserNotification>(notificationsQuery);

  const onTimePercentage = (userStats.onTimeArrivals / userStats.tripsTaken) * 100;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src={user.photoURL ?? ''} />
          <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Welcome back, {user.displayName || user.email}!</h1>
          <p className="text-muted-foreground">Here's your personalized transit overview.</p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Favorite Route
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{favoriteRoute.name}</div>
              <p className="text-xs text-muted-foreground">
                Your most frequently traveled route.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Trips
              </CardTitle>
              <Bus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.tripsTaken}</div>
              <p className="text-xs text-muted-foreground">
                journeys completed with BUSTREX.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                On-Time Arrival Rate
              </CardTitle>
              <Badge variant="secondary" className="text-xs">{onTimePercentage.toFixed(1)}%</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.onTimeArrivals} / {userStats.tripsTaken}</div>
              <p className="text-xs text-muted-foreground">
                of your recent trips were on time.
              </p>
            </CardContent>
          </Card>
          <SuggestedActionCard favoriteRouteStatus={favoriteRoute.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <Bell /> Recent Notifications
            </CardTitle>
            <CardDescription>Your latest 5 alerts and updates from the BUSTREX system.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            )}
            {!isLoading && notifications && notifications.length > 0 ? (
              <ul className="space-y-3">
                {notifications.map(notif => (
                  <li key={notif.id} className="flex items-center gap-3 text-sm p-3 bg-muted/50 rounded-lg">
                    <Badge variant={notif.type === 'sms' ? 'default' : 'secondary'}>{notif.type}</Badge>
                    <span className="flex-1 truncate">{notif.message}</span>
                    <span className="text-xs text-muted-foreground">{new Date(notif.timestamp).toLocaleTimeString()}</span>
                  </li>
                ))}
              </ul>
            ) : null}
             {!isLoading && (!notifications || notifications.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-8">No notifications yet.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Favorite Route Status</CardTitle>
            <CardDescription>Live status for the {favoriteRoute.name}.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div>
                        <p className="font-bold">{favoriteRoute.name} ({favoriteRoute.direction})</p>
                        <p className="text-sm text-muted-foreground">Next bus arriving in <span className="font-semibold text-primary">7 minutes</span></p>
                    </div>
                    <Badge>{favoriteRoute.status}</Badge>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Key Stops:</h4>
                     <div className="flex flex-wrap gap-2">
                        {favoriteRoute.stops.slice(0, 5).map(stop => (
                            <Badge key={stop.id} variant="outline">{stop.name}</Badge>
                        ))}
                     </div>
                </div>
                <Button asChild variant="outline">
                    <Link href="/routes">View all route details</Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
