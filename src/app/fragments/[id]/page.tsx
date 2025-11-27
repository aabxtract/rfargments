import { getFragmentById } from "@/lib/data";
import FragmentCard from "@/components/fragment-card";
import GlitchText from "@/components/glitch-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import Image from "next/image";

export default function FragmentDetailPage({ params }: { params: { id: string } }) {
  const fragment = getFragmentById(params.id);

  if (!fragment) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="flex justify-center items-center">
            <FragmentCard fragment={{...fragment, rotation: 0}} />
        </div>
        <div className="space-y-8">
            <GlitchText text={`Fragment #${fragment.id}`} className="text-4xl md:text-5xl font-bold" />
          
            <Card className="glass-morphism">
                <CardHeader>
                    <CardTitle>Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p><strong className="text-foreground">Source Image ID:</strong> {fragment.sourceImageId}</p>
                    <p><strong className="text-foreground">AI Hint:</strong> {fragment.imageHint}</p>
                    <p><strong className="text-foreground">Dimensions:</strong> {Math.round(fragment.width)} x {Math.round(fragment.height)} px</p>
                    <p><strong className="text-foreground">Initial Rotation:</strong> {fragment.rotation.toFixed(2)}°</p>
                </CardContent>
            </Card>

             <Card className="glass-morphism">
                <CardHeader>
                    <CardTitle>Original Image</CardTitle>
                </CardHeader>
                <CardContent>
                    <Image 
                        src={fragment.imageUrl} 
                        alt={`Original image for ${fragment.id}`}
                        width={400}
                        height={300}
                        className="rounded-lg object-cover w-full"
                    />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
