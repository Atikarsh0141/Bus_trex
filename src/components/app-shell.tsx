
"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import {
  Home,
  BarChartBig,
  Route,
  BellRing,
  MessageSquare,
  Map,
  Bot,
  Info,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { useUser } from "@/firebase";
import { Header } from "./header";
import { ThemeSwitcher } from "./theme-switcher";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/map", icon: Map, label: "Map" },
  { href: "/analytics", icon: BarChartBig, label: "Analytics" },
  { href: "/routes", icon: Route, label: "Routes" },
  { href: "/notifications", icon: BellRing, label: "Notifications" },
  { href: "/driver-comms", icon: MessageSquare, label: "Driver Comms" },
  { href: "/assistant", icon: Bot, label: "AI Assistant" },
];

const secondaryNavItems = [
    { href: "/about", icon: Info, label: "About" },
    { href: "/settings", icon: Settings, label: "Settings" },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isUserLoading } = useUser();


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Icons.logo className="w-8 h-8 text-primary" />
            <span className="font-headline font-semibold text-xl tracking-tight text-sidebar-primary group-data-[collapsible=icon]:hidden">
              BUSTREX
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2 flex flex-col gap-2">
            <Separator className="my-1"/>
            <SidebarMenu>
                 {secondaryNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={item.label}
                        >
                        <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                        </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
            <div className="group-data-[collapsible=icon]:hidden p-2">
              <ThemeSwitcher />
            </div>
             <div className="hidden group-data-[collapsible=icon]:block">
              <ThemeSwitcher />
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="p-4 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
