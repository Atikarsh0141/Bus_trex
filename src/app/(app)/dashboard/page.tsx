
"use client";

import { AppShell } from "@/components/app-shell";
import { buses } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, Users, Route, AlertCircle, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useUser } from "@/firebase";
import { PersonalizedDashboard } from "@/components/dashboard/personalized-dashboard";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();

  const runningBuses = buses.filter(b => b.status === 'Running').length;
  const totalPassengers = buses.reduce((acc, bus) => acc + bus.passengers, 0);
  const activeRoutes = new Set(buses.map(b => b.routeId)).size;
  const activeAlerts = buses.filter(b => b.status === 'Delayed' || b.status === 'Stopped').length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (isUserLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  // This check should technically not be needed because of AuthGuard,
  // but it's good practice for component resilience.
  if (!user) {
    return null; 
  }

  // For users with 'admin' or other specific roles, show a generic dashboard.
  // For 'passenger', show the personalized one.
  // This is a placeholder for more complex role-based logic.
  if (user && (user.email?.includes('admin') || user.displayName?.toLowerCase().includes('admin'))) {
     return (
        <AppShell>
            <motion.div 
                className="flex flex-col gap-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants}>
                    <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Live overview of the entire transit system.</p>
                </motion.div>

                <motion.div 
                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                    variants={containerVariants}
                >
                <motion.div variants={itemVariants}>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                        Active Buses
                        </CardTitle>
                        <Bus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{runningBuses}</div>
                        <p className="text-xs text-muted-foreground">
                        out of {buses.length} total buses
                        </p>
                    </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                        Total Passengers
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                        {totalPassengers}
                        </div>
                        <p className="text-xs text-muted-foreground">
                        across the entire fleet
                        </p>
                    </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                        Routes in Operation
                        </CardTitle>
                        <Route className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeRoutes}</div>
                        <p className="text-xs text-muted-foreground">
                        currently active routes
                        </p>
                    </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                        Active Alerts
                        </CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-accent">{activeAlerts}</div>
                        <p className="text-xs text-muted-foreground">
                        incidents reported
                        </p>
                    </CardContent>
                    </Card>
                </motion.div>
                </motion.div>
                 <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">
                            System Control. <br />
                            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Instant Insights.</span>
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                           Use the navigation to manage routes, view analytics, and communicate with drivers.
                        </p>
                        <div className="mt-6 flex gap-4">
                            <Button asChild size="lg">
                                <Link href="/map">View Live Map</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link href="/analytics">View Analytics</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="relative h-64 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                            src="https://picsum.photos/seed/bus-abstract/1200/800"
                            alt="Abstract bus moving"
                            fill
                            style={{ objectFit: 'cover' }}
                            data-ai-hint="abstract bus lights"
                            className="opacity-70"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div 
                            className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center"
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.7, 1, 0.7],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            >
                                <Map className="w-12 h-12 text-primary" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AppShell>
    );
  }

  return (
    <AppShell>
      <PersonalizedDashboard user={user} />
    </AppShell>
  );
}
