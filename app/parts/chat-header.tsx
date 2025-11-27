"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ChatHeaderProps = {
  children: ReactNode;
};

export function ChatHeader({ children }: ChatHeaderProps) {
  return (
    <header className="w-full flex justify-center pt-6 pb-4">
      <div className="max-w-3xl w-full rounded-3xl bg-white/80 border border-amber-200 shadow-sm px-4 py-3 flex items-center gap-3 backdrop-blur">
        {children}
      </div>
    </header>
  );
}

type ChatHeaderBlockProps = {
  children?: ReactNode;
  className?: string;
};

export function ChatHeaderBlock({ children, className }: ChatHeaderBlockProps) {
  return (
    <div className={cn("flex flex-1 min-w-0 items-center", className)}>
      {children}
    </div>
  );
}
