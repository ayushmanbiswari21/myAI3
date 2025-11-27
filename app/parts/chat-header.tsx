"use client";

import Image from "next/image";
import type { ReactNode } from "react";

type ChatHeaderProps = {
  children: ReactNode;
  /** Path to the avatar image placed in /public (or a remote URL you’ve allowed in next.config) */
  avatarSrc?: string;
  avatarAlt?: string;
};

export const ChatHeader = ({
  children,
  avatarSrc = "/bot-avatar.png", // 👈 put your image file in /public/bot-avatar.png
  avatarAlt = "Recipe ChatBot avatar",
}: ChatHeaderProps) => {
  return (
    <header className="w-full flex justify-center pt-6 pb-4">
      <div className="max-w-3xl w-full rounded-3xl bg-amber-300/95 border border-amber-700 shadow-md px-4 py-3 flex items-center gap-4 text-black">
        {/* Avatar circle */}
        <div className="relative w-[90px] h-[90px] rounded-full overflow-hidden border-2 border-amber-700 shrink-0">
          <Image
            src={avatarSrc}
            alt={avatarAlt}
            fill
            className="object-cover"
          />
        </div>

        {/* Rest of the header content passed as children */}
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
