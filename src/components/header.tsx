
'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/user-nav';
import { useUser } from '@/firebase';
import { Button } from './ui/button';
import Link from 'next/link';

export function Header() {
    const { user, isUserLoading } = useUser();

    return (
        <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-lg">
            <div className="flex items-center justify-between h-16 px-4 border-b md:px-8">
                <div className="flex items-center gap-2 md:hidden">
                    <SidebarTrigger />
                </div>
                <div className="hidden md:block" />

                <div className="flex items-center gap-4">
                    {isUserLoading ? (
                        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                    ) : user ? (
                        <UserNav user={user} />
                    ) : (
                        <Button asChild>
                            <Link href="/login">Log In</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
