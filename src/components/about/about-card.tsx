
'use client';

import { useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, BrainCircuit, Code, Rocket } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// Define the structure of the developer info
type DeveloperInfo = {
  appCreatorName: string;
  workingEmail: string;
  roleDescription: string;
  vision: string;
  technologies: string[];
  purpose: string;
};

const developerInfoData: DeveloperInfo = {
  appCreatorName: 'Arjit Gupta',
  workingEmail: 'work.arjitgupta@gmail.com',
  roleDescription: 'System Designer & Developer',
  vision: 'To create a smart, scalable, and city-ready transit management system that leverages AI to improve efficiency and passenger experience.',
  technologies: ['Next.js', 'Firebase', 'Tailwind CSS', 'Genkit AI', 'ShadCN UI'],
  purpose: 'Hackathon / Academic Project'
};

export function AboutCard() {
  const firestore = useFirestore();
  const docId = 'info';
  const devInfoRef = useMemoFirebase(() => firestore && doc(firestore, 'developer_info', docId), [firestore]);

  const { data: devInfo, isLoading, error } = useDoc<DeveloperInfo>(devInfoRef);
  
  useEffect(() => {
    if (!firestore) return;
    
    const seedData = async () => {
        if (!devInfoRef) return;
      try {
        const docSnap = await getDoc(devInfoRef);
        if (!docSnap.exists()) {
          // Use a non-blocking write
          setDoc(devInfoRef, developerInfoData)
            .catch(serverError => {
              const contextualError = new FirestorePermissionError({
                path: devInfoRef.path,
                operation: 'create',
                requestResourceData: developerInfoData,
              });
              errorEmitter.emit('permission-error', contextualError);
            });
        }
      } catch (e) {
        console.error("Error checking or seeding document: ", e);
      }
    };
    seedData();
  }, [firestore, devInfoRef]);

  if (isLoading) {
    return <AboutCardSkeleton />;
  }

  if (error) {
    return (
        <Card className="border-destructive/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertCircle /> Error Loading Data
                </CardTitle>
                <CardDescription>
                    There was a problem fetching developer information from Firestore.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-destructive-foreground bg-destructive p-4 rounded-md">{error.message}</p>
            </CardContent>
        </Card>
    )
  }

  if (!devInfo) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <Card>
                 <CardContent className="p-6 text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-primary">
                        <AvatarImage src="https://storage.googleapis.com/aifirebase-1.appspot.com/profile-pictures/arjit.png" data-ai-hint="person face" />
                        <AvatarFallback>{devInfo.appCreatorName.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-headline font-bold">{devInfo.appCreatorName}</h2>
                    <p className="text-muted-foreground">{devInfo.roleDescription}</p>
                    <p className="text-sm text-primary mt-2">{devInfo.workingEmail}</p>
                 </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <Rocket /> Vision
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{devInfo.vision}</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <Code /> Technologies Used
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {devInfo.technologies.map(tech => (
                        <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                       <BrainCircuit /> Purpose
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{devInfo.purpose}</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

function AboutCardSkeleton() {
  return (
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <Card>
                 <CardContent className="p-6 text-center">
                    <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-8 w-40 mx-auto mb-2" />
                    <Skeleton className="h-4 w-52 mx-auto mb-2" />
                    <Skeleton className="h-4 w-48 mx-auto" />
                 </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-3/4 mt-2" />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-28" />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                     <Skeleton className="h-6 w-28" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-48" />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
