import FragmentMap from "@/components/fragment-map";
import GlitchText from "@/components/glitch-text";

export default function MapPage() {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <GlitchText text="Fragment Map" className="text-4xl md:text-6xl font-bold mb-4" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                Explore the constellations of reality. Lines connect fragments that originated from the same moment, the same source image.
            </p>
            <div className="relative w-full h-[calc(100vh)] overflow-auto border border-primary/20 rounded-lg bg-black/20">
                 <FragmentMap />
            </div>
        </div>
    );
}
