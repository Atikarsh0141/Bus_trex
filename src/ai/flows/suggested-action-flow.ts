'use server';
/**
 * @fileOverview A flow to suggest the next best action for a user on their dashboard.
 *
 * - getSuggestedAction - A function that returns a suggested action.
 */

import {ai} from '@/ai/genkit';
import { 
  SuggestedActionInputSchema, 
  SuggestedActionOutputSchema,
  type SuggestedActionInput,
  type SuggestedActionOutput,
  ActionOptions
} from './suggested-action-types';


export async function getSuggestedAction(
  input: SuggestedActionInput
): Promise<SuggestedActionOutput> {
  return getSuggestedActionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestedActionPrompt',
  model: 'googleai/gemini-2.5-flash',
  input: {schema: SuggestedActionInputSchema},
  output: {schema: SuggestedActionOutputSchema},
  prompt: `You are a helpful AI assistant for the BUSTREX app. Your goal is to suggest the most relevant "next action" for a user on their personalized dashboard based on their context.

User Context:
- Role: {{{userRole}}}
- Time of Day: {{{timeOfDay}}}
- Favorite Route Status: {{{favoriteRouteStatus}}}

Action options are: ${ActionOptions.options.join(', ')}.

Based on the context, choose the single most relevant action and provide a compelling title, a short description explaining why it's relevant, a CTA button text, and the corresponding href for the app.

Example Reasoning:
- If it's morning and the favorite route is delayed, "track_bus" is a high priority.
- If the user is an admin, "view_analytics" is always a relevant suggestion.
- If it's evening, the user might be planning their next day, so "check_routes" is a good suggestion.

Generate a response in the required format.`,
});

const getSuggestedActionFlow = ai.defineFlow(
  {
    name: 'getSuggestedActionFlow',
    inputSchema: SuggestedActionInputSchema,
    outputSchema: SuggestedActionOutputSchema,
    cache: {
      ttl: 600, // Cache results for 10 minutes (600 seconds)
    },
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
