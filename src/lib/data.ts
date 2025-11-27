import { type Fragment } from './types';
import { PlaceHolderImages } from './placeholder-images';

// Pre-defined clip-paths to simulate slicing
const clipPaths = [
  'polygon(0% 0%, 55% 0%, 45% 100%, 0% 100%)',
  'polygon(55% 0%, 100% 0%, 100% 100%, 45% 100%)',
  'polygon(0% 0%, 100% 0%, 100% 55%, 0% 45%)',
  'polygon(0% 45%, 100% 55%, 100% 100%, 0% 100%)',
  'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
  'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)',
];

const FRAGMENTS_PER_IMAGE = 4;
const WALL_WIDTH = 3000;
const WALL_HEIGHT = 3000;

let allFragments: Fragment[] = [];

function generateFragments() {
  if (allFragments.length > 0) return;

  PlaceHolderImages.forEach((image, imgIndex) => {
    for (let i = 0; i < FRAGMENTS_PER_IMAGE; i++) {
      const fragmentId = `${image.id}-frag${i}`;
      const width = Math.random() * 200 + 150;
      const height = Math.random() * 200 + 150;

      allFragments.push({
        id: fragmentId,
        sourceImageId: image.id,
        imageUrl: image.imageUrl,
        imageHint: image.imageHint,
        clipPath: clipPaths[(imgIndex + i) % clipPaths.length],
        x: Math.random() * (WALL_WIDTH - width),
        y: Math.random() * (WALL_HEIGHT - height),
        width: width,
        height: height,
        rotation: Math.random() * 20 - 10,
      });
    }
  });
}

generateFragments();

export const getAllFragments = (): Fragment[] => {
  return allFragments;
};

export const getFragmentsBySource = (sourceImageId: string): Fragment[] => {
  return allFragments.filter(f => f.sourceImageId === sourceImageId);
};

export const getFragmentById = (id: string): Fragment | undefined => {
  return allFragments.find(f => f.id === id);
};

// Mock user's collection - a subset of all fragments
export const getUserCollection = (): Fragment[] => {
    return allFragments.filter((_, index) => index % 5 === 0);
}
