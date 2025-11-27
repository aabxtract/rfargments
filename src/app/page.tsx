import GlitchText from '@/components/glitch-text';
import RealityWall from '@/components/reality-wall';

export default function HomePage() {
  return (
    <div className="relative w-full h-[calc(100vh-5rem)] overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 z-10 text-center space-y-4 px-4">
        <GlitchText text="The Reality Wall" className="text-4xl md:text-7xl font-bold" />
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          A collective mosaic of fragmented realities. Every piece is a unique moment, captured and immortalized on-chain.
        </p>
      </div>
      <RealityWall />
    </div>
  );
}
