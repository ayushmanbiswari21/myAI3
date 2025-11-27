"use client";

import type { ReactNode } from "react";

type ChatHeaderProps = {
  children: ReactNode;
};

export const ChatHeader = ({ children }: ChatHeaderProps) => {
  return (
    <header className="w-full flex justify-center pt-6 pb-4">
      <div className="max-w-3xl w-full rounded-3xl bg-amber-300/95 border border-amber-700 shadow-md px-4 py-3 flex items-center gap-3 text-black">
        {children}
      </div>
    </header>
  );
};

type ChatHeaderBlockProps = {
  children?: ReactNode;
  className?: string;
};

export const ChatHeaderBlock = ({
  children,
  className = "",
}: ChatHeaderBlockProps) => {
  return (
    <div className={`flex flex-1 min-w-0 items-center ${className}`}>
      {children}
    </div>
  );
};
