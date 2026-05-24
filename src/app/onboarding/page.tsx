
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, PartyPopper } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OnboardingPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const handleContinue = () => {
    router.push('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
              className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit"
            >
              <PartyPopper className="h-12 w-12" />
            </motion.div>
            <CardTitle className="text-3xl font-headline mt-4">Welcome to BUSTREX!</CardTitle>
            <CardDescription>
              Your account has been successfully created.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You've been assigned the role of a <span className="font-semibold text-primary">Passenger</span>. 
              You can now explore bus routes, track live locations, and get real-time ETA updates.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg" onClick={handleContinue}>
              Let's Go!
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
