import RealityWall from '@/components/reality-wall';

export default function HomePage() {
  return (
    <div className="relative w-full h-[calc(100vh-5rem)] overflow-hidden">
      <h1 className="sr-only">The Reality Wall</h1>
      <RealityWall />
    </div>
  );
}
