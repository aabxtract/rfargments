import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => (
  <div className={cn("relative w-10 h-10", className)}>
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      <path
        d="M50 5 A45 45 0 0 1 95 50"
        stroke="url(#grad1)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M50 95 A45 45 0 0 1 5 50"
        stroke="hsl(var(--primary))"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="10 15"
      />
      <path
        d="M15 85 L35 65"
        stroke="hsl(var(--accent))"
        strokeWidth="3"
        strokeLinecap="round"
      />
       <path
        d="M75 25 L85 15"
        stroke="hsl(var(--foreground))"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export default Logo;
