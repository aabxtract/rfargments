'use server';
/**
 * @fileOverview Enhances the Reality Wall with AI-driven subtle animations and shifts of fragments.
 *
 * - enhanceRealityWallWithAIAnimation - A function that orchestrates the AI animation of the Reality Wall.
 * - EnhanceRealityWallInput - The input type for the enhanceRealityWallWithAIAnimation function, accepting the current fragment data.
 * - EnhanceRealityWallOutput - The return type for the enhanceRealityWallWithAIAnimation function, providing updated fragment positions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceRealityWallInputSchema = z.object({
  fragmentPositions: z.array(
    z.object({
      id: z.string().describe('Unique identifier for the fragment.'),
      x: z.number().describe('Current X coordinate of the fragment.'),
      y: z.number().describe('Current Y coordinate of the fragment.'),
    })
  ).describe('Array of fragment objects with their current positions on the Reality Wall.'),
});
export type EnhanceRealityWallInput = z.infer<typeof EnhanceRealityWallInputSchema>;

const EnhanceRealityWallOutputSchema = z.array(
  z.object({
    id: z.string().describe('Unique identifier for the fragment.'),
    x: z.number().describe('Updated X coordinate of the fragment.'),
    y: z.number().describe('Updated Y coordinate of the fragment.'),
  })
).describe('Array of fragment objects with their updated positions for subtle animation.');
export type EnhanceRealityWallOutput = z.infer<typeof EnhanceRealityWallOutputSchema>;

export async function enhanceRealityWallWithAIAnimation(input: EnhanceRealityWallInput): Promise<EnhanceRealityWallOutput> {
  return enhanceRealityWallWithAIAnimationFlow(input);
}

const realityWallAnimationPrompt = ai.definePrompt({
  name: 'realityWallAnimationPrompt',
  input: {schema: EnhanceRealityWallInputSchema},
  output: {schema: EnhanceRealityWallOutputSchema},
  prompt: `You are responsible for subtly animating the Reality Wall by adjusting the positions of the fragments.

  Given the current positions of the fragments, introduce slight variations to their X and Y coordinates to create a gentle, dreamlike animation.
  The goal is to make the Reality Wall feel alive and dynamic without being distracting.

  Here are the current fragment positions:
  {{#each fragmentPositions}}
  - ID: {{this.id}}, X: {{this.x}}, Y: {{this.y}}
  {{/each}}

  Provide updated X and Y coordinates for each fragment to achieve a mesmerizing and fluid effect. Keep the movements subtle and organic.
  Do not drastically change any X or Y coordinate. Each change should only be a small amount to simulate a breathing effect.
  The output should be a json array of fragment objects including the updated x and y coordinates for each one.
  Ensure each fragment keeps its id from the input. The x and y values in the objects of the output array must be valid numbers.
  `,
});

const enhanceRealityWallWithAIAnimationFlow = ai.defineFlow(
  {
    name: 'enhanceRealityWallWithAIAnimationFlow',
    inputSchema: EnhanceRealityWallInputSchema,
    outputSchema: EnhanceRealityWallOutputSchema,
  },
  async input => {
    const {output} = await realityWallAnimationPrompt(input);
    return output!;
  }
);
