import Image from 'next/image';
import Link from 'next/link';
import { type Fragment } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';

type FragmentCardProps = {
  fragment: Fragment;
  className?: string;
  style?: React.CSSProperties;
};

export default function FragmentCard({ fragment, className, style }: FragmentCardProps) {
  return (
    <Link href={`/fragments/${fragment.id}`} passHref>
      <Card
        className={cn(
          'group relative overflow-hidden glass-morphism transition-all duration-300 ease-in-out hover:!scale-105 hover:z-10',
          'transform-gpu',
          className
        )}
        style={{
          width: fragment.width,
          height: fragment.height,
          transform: `rotate(${fragment.rotation}deg)`,
          ...style,
        }}
      >
        <Image
          src={fragment.imageUrl}
          alt={`Fragment of ${fragment.imageHint}`}
          data-ai-hint={fragment.imageHint}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          style={{
            clipPath: fragment.clipPath,
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 chromatic-shadow opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Card>
    </Link>
  );
}
