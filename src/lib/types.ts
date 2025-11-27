export type Fragment = {
  id: string;
  sourceImageId: string;
  imageUrl: string;
  imageHint: string;
  clipPath: string; // To "cut" the image
  x: number; // position on wall
  y: number; // position on wall
  width: number;
  height: number;
  rotation: number;
};
