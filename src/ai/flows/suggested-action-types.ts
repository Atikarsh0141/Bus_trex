import {z} from 'genkit';

export const SuggestedActionInputSchema = z.object({
  userRole: z.enum(['passenger', 'driver', 'admin']),
  timeOfDay: z.enum(['morning', 'afternoon', 'evening']),
  favoriteRouteStatus: z.string(),
});
export type SuggestedActionInput = z.infer<typeof SuggestedActionInputSchema>;

export const ActionOptions = z.enum([
  'track_bus',
  'check_routes',
  'view_analytics',
  'send_alert',
]);
export type ActionOptions = z.infer<typeof ActionOptions>;

export const SuggestedActionOutputSchema = z.object({
  action: ActionOptions,
  title: z.string().describe('A short, catchy title for the suggested action.'),
  description: z.string().describe('A brief explanation of why this action is suggested.'),
  cta: z.string().describe('The call-to-action text for the button.'),
  href: z.string().describe('The path for the link, e.g., /map or /analytics.'),
});
export type SuggestedActionOutput = z.infer<typeof SuggestedActionOutputSchema>;
