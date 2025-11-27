'use client';

import { useState, useEffect, useRef } from 'react';
import { getAllFragments } from '@/lib/data';
import { type Fragment } from '@/lib/types';
import FragmentCard from './fragment-card';
import { enhanceRealityWallWithAIAnimation } from '@/ai/flows/enhance-reality-wall-with-ai-animation';

export default function RealityWall() {
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const wallRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialFragments = getAllFragments();
    setFragments(initialFragments);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (fragments.length === 0) return;

    const intervalId = setInterval(async () => {
      const currentPositions = fragments.map(({ id, x, y }) => ({ id, x, y }));
      try {
        const newPositions = await enhanceRealityWallWithAIAnimation({ fragmentPositions: currentPositions });
        
        setFragments(prevFragments =>
          prevFragments.map(fragment => {
            const newPos = newPositions.find(p => p.id === fragment.id);
            return newPos ? { ...fragment, x: newPos.x, y: newPos.y } : fragment;
          })
        );
      } catch (error) {
        console.error("Failed to enhance reality wall:", error);
      }
    }, 10000); // Animate every 10 seconds

    return () => clearInterval(intervalId);
  }, [fragments]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading Reality...</div>;
  }

  return (
    <div
      ref={wallRef}
      className="absolute inset-0 w-full h-full"
    >
      <div className="relative w-[3000px] h-[3000px] scale-75 md:scale-100">
        {fragments.map(fragment => (
          <FragmentCard
            key={fragment.id}
            fragment={fragment}
            className="absolute transition-all duration-[4000ms] ease-out"
            style={{
              top: `${fragment.y}px`,
              left: `${fragment.x}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
