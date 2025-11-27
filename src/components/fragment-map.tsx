'use client';

import { useState, useEffect, useRef } from 'react';
import { getAllFragments, getFragmentsBySource } from '@/lib/data';
import { type Fragment } from '@/lib/types';
import FragmentCard from './fragment-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Line = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  key: string;
};

export default function FragmentMap() {
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const fragmentRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // For the map, we position fragments in clusters based on source image
    let clusteredFragments: Fragment[] = [];
    const clusterSpacing = 600;
    const numCols = Math.floor(Math.sqrt(PlaceHolderImages.length));
    
    PlaceHolderImages.forEach((img, index) => {
      const sourceFragments = getFragmentsBySource(img.id);
      const clusterX = (index % numCols) * clusterSpacing;
      const clusterY = Math.floor(index / numCols) * clusterSpacing;

      sourceFragments.forEach(f => {
        clusteredFragments.push({
          ...f,
          x: clusterX + (Math.random() * 200 - 100),
          y: clusterY + (Math.random() * 200 - 100),
          width: 120,
          height: 120,
          rotation: Math.random() * 360,
        });
      });
    });

    setFragments(clusteredFragments);
  }, []);

  useEffect(() => {
    if (fragments.length === 0 || !mapContainerRef.current) return;

    const calculateLines = () => {
      const newLines: Line[] = [];
      const mapRect = mapContainerRef.current!.getBoundingClientRect();

      PlaceHolderImages.forEach(img => {
        const sourceFragments = fragments.filter(f => f.sourceImageId === img.id);
        
        for (let i = 0; i < sourceFragments.length; i++) {
          for (let j = i + 1; j < sourceFragments.length; j++) {
            const frag1 = sourceFragments[i];
            const frag2 = sourceFragments[j];

            const el1 = fragmentRefs.current.get(frag1.id);
            const el2 = fragmentRefs.current.get(frag2.id);

            if (el1 && el2) {
              const rect1 = el1.getBoundingClientRect();
              const rect2 = el2.getBoundingClientRect();

              newLines.push({
                x1: rect1.left + rect1.width / 2 - mapRect.left,
                y1: rect1.top + rect1.height / 2 - mapRect.top,
                x2: rect2.left + rect2.width / 2 - mapRect.left,
                y2: rect2.top + rect2.height / 2 - mapRect.top,
                key: `${frag1.id}-${frag2.id}`,
              });
            }
          }
        }
      });
      setLines(newLines);
    };
    
    // Calculate lines after initial render and on window resize
    calculateLines();
    window.addEventListener('resize', calculateLines);
    return () => window.removeEventListener('resize', calculateLines);

  }, [fragments]);

  return (
    <div className="relative w-full min-h-screen p-4 md:p-8" ref={mapContainerRef}>
        <div className="relative w-[2000px] h-[2000px] scale-75 md:scale-100 origin-top-left">
            {fragments.map(fragment => (
            <div
                key={fragment.id}
                ref={el => fragmentRefs.current.set(fragment.id, el)}
                className="absolute"
                style={{
                    top: `${fragment.y}px`,
                    left: `${fragment.x}px`,
                }}
            >
                <FragmentCard fragment={fragment} />
            </div>
            ))}
             <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                <defs>
                    <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.8" />
                    </linearGradient>
                </defs>
                {lines.map(line => (
                    <line
                    key={line.key}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="url(#line-grad)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    />
                ))}
            </svg>
        </div>
    </div>
  );
}
