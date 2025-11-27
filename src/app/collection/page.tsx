import { getUserCollection } from "@/lib/data";
import FragmentCard from "@/components/fragment-card";
import GlitchText from "@/components/glitch-text";

export default function CollectionPage() {
  const fragments = getUserCollection();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-4 mb-12">
        <GlitchText text="Your Fragments" className="text-4xl md:text-6xl font-bold" />
        <p className="text-muted-foreground text-lg text-center max-w-2xl">
          A collection of the realities you've captured and claimed. These are your pieces of the broken mirror.
        </p>
      </div>

      {fragments.length > 0 ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {fragments.map(fragment => (
              <FragmentCard key={fragment.id} fragment={{ ...fragment, rotation: 0 }} />
            ))}
          </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">Your collection is empty.</p>
          <p>Upload an image to begin creating fragments.</p>
        </div>
      )}
    </div>
  );
}
