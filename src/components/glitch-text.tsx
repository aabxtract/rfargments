"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface GlitchTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
}

const GlitchText = React.forwardRef<HTMLDivElement, GlitchTextProps>(
  ({ className, text, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative font-headline", className)}
        {...props}
      >
        <span
          className="absolute left-0 top-0 w-full h-full text-accent opacity-80"
          style={{ animation: "glitch-top 1s linear infinite" }}
          aria-hidden="true"
        >
          {text}
        </span>
        <span
          className="relative block"
          style={{ animation: "glitch 1s linear infinite" }}
        >
          {text}
        </span>
        <span
          className="absolute left-0 top-0 w-full h-full text-primary opacity-80"
          style={{ animation: "glitch-bottom 1s linear infinite" }}
          aria-hidden="true"
        >
          {text}
        </span>
      </div>
    );
  }
);

GlitchText.displayName = "GlitchText";

export default GlitchText;
