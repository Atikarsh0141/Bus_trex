
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const notificationsSchema = z.object({
  notificationPreference: z.enum(['push', 'sms', 'inApp']),
});

type NotificationsFormValues = z.infer<typeof notificationsSchema>;

type UserSettings = {
  notificationPreference: 'push' | 'sms' | 'inApp';
};

export function NotificationsForm() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const userRef = useMemoFirebase(() => (firestore && user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userSettings, isLoading } = useDoc<UserSettings>(userRef);

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsSchema),
    values: {
      notificationPreference: userSettings?.notificationPreference || 'push',
    },
  });

  const onSubmit = async (data: NotificationsFormValues) => {
    if (!userRef) return;
    setIsSaving(true);

    setDoc(userRef, data, { merge: true })
        .then(() => {
            toast({
                title: 'Notifications Updated',
                description: 'Your notification preferences have been saved.',
            });
        })
        .catch(serverError => {
            const contextualError = new FirestorePermissionError({
              path: userRef.path,
              operation: 'update',
              requestResourceData: data,
            });
            errorEmitter.emit('permission-error', contextualError);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not update your preferences. Please try again.',
            });
        })
        .finally(() => {
            setIsSaving(false);
        });
  };

  if (isLoading || !userSettings) {
    return <NotificationsFormSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Notifications</CardTitle>
        <CardDescription>Choose how you want to receive important updates.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="notificationPreference"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Preferred Channel</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="push" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Push Notifications
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="sms" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          SMS Text Messages
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="inApp" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          In-App Messages
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update notifications
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function NotificationsFormSkeleton() {
    return (
         <Card>
            <CardHeader>
                <CardTitle className="font-headline">Notifications</CardTitle>
                <CardDescription>Choose how you want to receive important updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-24" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-6 w-48" />
                    </div>
                </div>
                 <Skeleton className="h-10 w-40" />
            </CardContent>
        </Card>
    )
}
