'use server';

/**
 * @fileOverview A conversational AI assistant for the Bus_Trex application.
 *
 * - chat - A function that handles the conversational chat with the AI assistant.
 * - ChatMessage - The type for a single chat message.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model', 'system']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const systemPrompt = `You are an expert AI assistant for BUSTREX, a smart bus tracking and management system.
Your goal is to assist users with their questions about routes, bus schedules, ETAs, and other features of the platform.
You are a friendly, concise, and helpful conversationalist.
You are fluent in multiple languages, including English and Hindi, and will respond to the user in the language they use.`;

export async function chat(history: ChatMessage[]): Promise<ChatMessage> {
  
  const response = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    messages: [
      { role: 'system', content: systemPrompt },
      ...history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ],
  });

  const content = response.text ?? 'Sorry, I could not process that.';

  return {
    role: 'model',
    content: content,
  };
}
