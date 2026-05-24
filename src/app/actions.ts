
'use server';

import {
  optimizeDriverAlert as optimizeDriverAlertFlow,
  type DriverAlertInput,
  type DriverAlertOutput,
} from '@/ai/flows/driver-alert-optimization';
import {
  sendPersonalizedNotification as sendPersonalizedNotificationFlow,
  type NotificationInput,
  type NotificationOutput,
} from '@/ai/flows/personalized-notifications';
import {
  chat as chatFlow,
  type ChatMessage,
} from '@/ai/flows/assistant-flow';
import {
    getSuggestedAction as getSuggestedActionFlow
} from '@/ai/flows/suggested-action-flow';
import type { SuggestedActionInput, SuggestedActionOutput } from '@/ai/flows/suggested-action-types';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { initializeFirebase } from '@/firebase';


export async function optimizeDriverAlert(input: DriverAlertInput): Promise<DriverAlertOutput> {
  return await optimizeDriverAlertFlow(input);
}

export async function sendPersonalizedNotification(input: NotificationInput): Promise<NotificationOutput> {
  return await sendPersonalizedNotificationFlow(input);
}

export async function chat(history: ChatMessage[]): Promise<ChatMessage> {
  return await chatFlow(history);
}

export async function getSuggestedAction(input: SuggestedActionInput): Promise<SuggestedActionOutput> {
    return await getSuggestedActionFlow(input);
}

export async function uploadProfilePicture(formData: FormData): Promise<{ downloadURL: string } | { error: string }> {
    const { auth, storage } = initializeFirebase();
    const user = auth.currentUser;

    if (!user) {
        return { error: 'User not authenticated.' };
    }

    const file = formData.get('profilePicture') as File;
    if (!file) {
        return { error: 'No file provided.' };
    }

    const storageRef = ref(storage, `profile-pictures/${user.uid}/${file.name}`);

    try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return { downloadURL };
    } catch (error: any) {
        console.error('Upload failed:', error);
        return { error: 'Failed to upload image.' };
    }
}
