'use client';

import { useState } from 'react';
import { Upload, Wand2 } from 'lucide-react';
import { Button } from './ui/button';
import { getFragmentsBySource } from '@/lib/data';
import { type Fragment } from '@/lib/types';
import FragmentCard from './fragment-card';
import GlitchText from './glitch-text';

// Mock function to simulate dropping a file
const getMockSlicedFragments = (): Fragment[] => {
  // Use 'img4' (light trails) for a cool visual
  const fragments = getFragmentsBySource('img4');
  // Adjust positions for a grid-like "forge" view
  return fragments.map((f, i) => ({
    ...f,
    width: 250,
    height: 250,
    rotation: 0,
  }));
};

export default function UploadPageClient() {
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [isForging, setIsForging] = useState(false);

  const handleSliceImage = () => {
    const sliced = getMockSlicedFragments();
    setFragments(sliced);
    setIsForging(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!isForging ? (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-8">
          <GlitchText text="Upload to the Mirror" className="text-4xl md:text-6xl font-bold" />
          <p className="text-muted-foreground text-lg text-center max-w-2xl">
            Drop an image into the portal. The system will shatter it into unique reality fragments, ready to be minted and added to the collective wall.
          </p>
          <div
            onClick={handleSliceImage}
            className="relative flex flex-col items-center justify-center w-full max-w-2xl h-64 rounded-xl border-2 border-dashed border-primary/50 cursor-pointer transition-all duration-300 hover:border-accent hover:bg-primary/10 group"
          >
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-50 blur-2xl transition-opacity duration-300"></div>
            <div className="relative z-10 flex flex-col items-center gap-4 text-muted-foreground group-hover:text-accent">
              <Upload className="w-16 h-16" />
              <span className="text-xl font-semibold">Click to Upload Image</span>
              <span className="text-sm">Or pretend to drag and drop</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8">
          <GlitchText text="Fragment Forge" className="text-4xl md:text-6xl font-bold" />
          <p className="text-muted-foreground text-lg text-center max-w-2xl">
            Your reality has been fragmented. Hover to inspect, then mint them to the wall.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4">
            {fragments.map(fragment => (
              <FragmentCard key={fragment.id} fragment={fragment} />
            ))}
          </div>
          <Button size="lg" className="pulse-holo mt-8">
            <Wand2 className="mr-2 h-5 w-5" />
            Mint All Fragments
          </Button>
        </div>
      )}
    </div>
  );
}
