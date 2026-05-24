'use server';

/**
 * @fileOverview Personalized notification system that determines the best notification type based on user preferences.
 *
 * - sendPersonalizedNotification - A function to send personalized notifications.
 * - NotificationInput - The input type for the sendPersonalizedNotification function.
 * - NotificationOutput - The return type for the sendPersonalizedNotification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NotificationInputSchema = z.object({
  userId: z.string().describe('The ID of the user to notify.'),
  message: z.string().describe('The content of the notification message.'),
  notificationTypePreference: z
    .enum(['push', 'sms', 'inApp'])
    .describe('The user preferred notification type.'),
  busRoute: z.string().describe('The bus route number.'),
  stopName: z.string().describe('The bus stop name.'),
  estimatedArrivalTime: z
    .string()
    .describe(
      'The estimated time of arrival, this must be formatted as HH:MM AM/PM'
    ),
});
export type NotificationInput = z.infer<typeof NotificationInputSchema>;

const NotificationOutputSchema = z.object({
  notificationType: z
    .enum(['push', 'sms', 'inApp'])
    .describe('The chosen notification type.'),
  success: z.boolean().describe('Whether the notification was sent successfully.'),
  details: z.string().describe('Details about the notification delivery.'),
});
export type NotificationOutput = z.infer<typeof NotificationOutputSchema>;

export async function sendPersonalizedNotification(
  input: NotificationInput
): Promise<NotificationOutput> {
  return personalizedNotificationFlow(input);
}

const notificationPrompt = ai.definePrompt({
  name: 'notificationPrompt',
  input: {schema: NotificationInputSchema},
  output: {schema: NotificationOutputSchema},
  prompt: `You are an AI assistant that personalizes bus notifications for users. Given the user's preferences and the notification content, determine the most effective notification type (push, SMS, or in-app).

User ID: {{userId}}
Message: {{message}}
Preferred Notification Type: {{notificationTypePreference}}
Bus Route: {{busRoute}}
Stop Name: {{stopName}}
Estimated Arrival Time: {{estimatedArrivalTime}}

Consider the user's past behavior, urgency of the message, and the likelihood of the user seeing the notification in a timely manner.

Respond with the chosen notification type, a success status, and details about the delivery.

Choose the best notification type between 'push', 'sms', and 'inApp'.`,
});

const personalizedNotificationFlow = ai.defineFlow(
  {
    name: 'personalizedNotificationFlow',
    inputSchema: NotificationInputSchema,
    outputSchema: NotificationOutputSchema,
  },
  async input => {
    const {output} = await notificationPrompt(input);
    return output!;
  }
);
