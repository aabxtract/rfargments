'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating descriptions for NFT fragments based on their source image.
 *
 * The flow takes an image data URI as input and returns a description of the fragment.
 *
 * @remarks
 * - It exports `generateFragmentDescription` function to trigger the flow.
 * - It defines `GenerateFragmentDescriptionInput` and `GenerateFragmentDescriptionOutput` types for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFragmentDescriptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the fragment, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected typo here
    ),
});
export type GenerateFragmentDescriptionInput = z.infer<typeof GenerateFragmentDescriptionInputSchema>;

const GenerateFragmentDescriptionOutputSchema = z.object({
  description: z.string().describe('A description of the NFT fragment.'),
});
export type GenerateFragmentDescriptionOutput = z.infer<typeof GenerateFragmentDescriptionOutputSchema>;

export async function generateFragmentDescription(input: GenerateFragmentDescriptionInput): Promise<GenerateFragmentDescriptionOutput> {
  return generateFragmentDescriptionFlow(input);
}

const fragmentDescriptionPrompt = ai.definePrompt({
  name: 'fragmentDescriptionPrompt',
  input: {schema: GenerateFragmentDescriptionInputSchema},
  output: {schema: GenerateFragmentDescriptionOutputSchema},
  prompt: `You are an AI that generates descriptions for NFT fragments based on their source image. Describe the fragment in a surreal and mystical tone.

  Here is the fragment image: {{media url=photoDataUri}}`,
});

const generateFragmentDescriptionFlow = ai.defineFlow(
  {
    name: 'generateFragmentDescriptionFlow',
    inputSchema: GenerateFragmentDescriptionInputSchema,
    outputSchema: GenerateFragmentDescriptionOutputSchema,
  },
  async input => {
    const {output} = await fragmentDescriptionPrompt(input);
    return output!;
  }
);
