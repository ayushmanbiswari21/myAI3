"use client";

export default function ChatHeader() {
  return (
    <div className="w-full flex justify-center pt-6 pb-4">
      <div className="max-w-3xl w-full bg-white/80 border border-amber-200 rounded-3xl px-4 py-3 flex items-center gap-3 shadow-sm backdrop-blur">
        {/* Icon circle */}
        <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-xl">
          🥘
        </div>

        {/* Title + subtitle */}
        <div className="flex-1">
          <h1 className="text-base sm:text-lg font-semibold text-amber-900">
            Chat with Food Recipe ChatBot
          </h1>
          <p className="text-xs sm:text-sm text-amber-700">
            Ask for recipes, ingredient substitutions, or dish ideas from Indian
            and global cuisines. I’ll use your uploaded recipes to guide you.
          </p>
        </div>
      </div>
    </div>
  );
}
