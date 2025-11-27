'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Upload, GalleryHorizontal, Map, Menu } from 'lucide-react';
import Logo from './logo';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import GlitchText from './glitch-text';

const navItems = [
  { href: '/', label: 'Reality Wall', icon: LayoutGrid },
  { href: '/upload', label: 'Upload', icon: Upload },
  { href: '/collection', label: 'Collection', icon: GalleryHorizontal },
  { href: '/map', label: 'Fragment Map', icon: Map },
];

export default function Header() {
  const pathname = usePathname();

  const NavLinks = () => (
    <>
      {navItems.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10',
            pathname === item.href ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
        </Link>
      ))}
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-2">
      <div className="container mx-auto flex h-16 items-center justify-between rounded-lg glass-morphism px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <div className="hidden md:block">
            <GlitchText text="Reality Fragments" className="text-lg font-bold" />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-2 md:flex">{NavLinks()}</nav>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] glass-morphism">
              <nav className="flex flex-col gap-4 pt-10">{NavLinks()}</nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
