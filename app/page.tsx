"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { ArrowUp, Loader2, Plus, Square } from "lucide-react";
import { MessageWall } from "@/components/messages/message-wall";
import { ChatHeader, ChatHeaderBlock } from "@/app/parts/chat-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UIMessage } from "ai";
import { useEffect, useState, useRef } from "react";
import {
  AI_NAME,
  CLEAR_CHAT_TEXT,
  OWNER_NAME,
  WELCOME_MESSAGE,
} from "@/config";
import Image from "next/image";
import Link from "next/link";

const formSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty.")
    .max(2000, "Message must be at most 2000 characters."),
});

const STORAGE_KEY = "chat-messages";

type StorageData = {
  messages: UIMessage[];
  durations: Record<string, number>;
};

const loadMessagesFromStorage = () => {
  if (typeof window === "undefined") return { messages: [], durations: {} };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { messages: [], durations: {} };
    return JSON.parse(stored) as StorageData;
  } catch {
    return { messages: [], durations: {} };
  }
};

const saveMessagesToStorage = (
  messages: UIMessage[],
  durations: Record<string, number>,
) => {
  if (typeof window === "undefined") return;
  const data: StorageData = { messages, durations };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Small, minimal quick suggestions
const quickPrompts = [
  "Quick Indian breakfast with oats",
  "Simple Italian pasta dinner",
  "3-dish North Indian thali",
  "Healthy vegetarian lunchbox",
  "Mexican chicken dinner < 30 min",
];

export default function Chat() {
  const [isClient, setIsClient] = useState(false);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const welcomeMessageShownRef = useRef(false);

  const stored = typeof window !== "undefined" ? loadMessagesFromStorage() : { messages: [], durations: {} };
  const [initialMessages] = useState<UIMessage[]>(stored.messages || []);

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    messages: initialMessages,
  });

  useEffect(() => {
    setIsClient(true);
    setDurations(stored.durations || {});
    setMessages(stored.messages || []);
  }, []);

  useEffect(() => {
    if (isClient) saveMessagesToStorage(messages, durations);
  }, [messages, durations, isClient]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  // Inject welcome message only once
  useEffect(() => {
    if (
      isClient &&
      initialMessages.length === 0 &&
      !welcomeMessageShownRef.current
    ) {
      const welcomeMessage: UIMessage = {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        parts: [{ type: "text", text: WELCOME_MESSAGE }],
      };
      setMessages([welcomeMessage]);
      saveMessagesToStorage([welcomeMessage], {});
      welcomeMessageShownRef.current = true;
    }
  }, [isClient, initialMessages.length, setMessages]);

  function onSubmit(data: z.infer<typeof formSchema>) {
    sendMessage({ text: data.message });
    form.reset();
  }

  function clearChat() {
    setMessages([]);
    setDurations({});
    saveMessagesToStorage([], {});
    toast.success("Chat cleared");
  }

  return (
    <div
      className="relative flex h-screen w-full font-sans bg-slate-950 text-slate-50 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/bg-food.jpg')" }}
    >
      {/* Dark, blurred overlay for minimalist glossy look */}
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-2xl" />

      <main className="relative z-10 w-full h-screen">
        {/* HEADER */}
        <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/45 border-b border-white/10">
          <ChatHeader>
            <ChatHeaderBlock />
            <ChatHeaderBlock className="justify-center items-center gap-3">
              <Avatar className="size-9 bg-slate-900/70 border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                <AvatarImage src="/logo.png" />
                <AvatarFallback>
                  <Image src="/logo.png" alt="Logo" width={32} height={32} />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col leading-tight">
                <p className="text-sm font-semibold tracking-tight">
                  {AI_NAME}
                </p>
                <p className="text-[11px] text-slate-300">
                  Minimal, glossy assistant for recipes & ideas
                </p>
              </div>
            </ChatHeaderBlock>
            <ChatHeaderBlock className="justify-end">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer bg-slate-900/60 border-white/15 text-slate-50 hover:bg-slate-900/80 rounded-full px-3 h-8 flex items-center gap-1"
                onClick={clearChat}
              >
                <Plus className="size-3.5" />
                <span className="text-xs">{CLEAR_CHAT_TEXT}</span>
              </Button>
            </ChatHeaderBlock>
          </ChatHeader>
        </div>

        {/* MAIN SCROLL AREA */}
        <div className="h-screen overflow-y-auto px-4 sm:px-5 py-4 w-full pt-[96px] pb-[150px]">
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {/* INTRO + QUICK PROMPTS (glass card) */}
            <section className="card-appear rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.7)] px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-[13px] font-semibold tracking-tight">
                    What are you cooking today?
                  </p>
                  <p className="text-[11px] text-slate-200/80">
                    Ask for full recipes or just ideas with ingredients you have.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="quick-chip text-[11px] px-3 py-1 rounded-full border border-white/20 bg-white/5 text-slate-100/90"
                    onClick={() => form.setValue("message", prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </section>

            {/* CHAT AREA (primary glossy card) */}
            <section className="flex-1 flex flex-col justify-end">
              <div className="float-in rounded-3xl bg-white/6 border border-white/10 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.75)] px-4 sm:px-6 py-5">
                <div className="flex flex-col items-center justify-end min-h-[260px]">
                  {isClient ? (
                    <>
                      <MessageWall
                        messages={messages}
                        status={status}
                        durations={durations}
                        onDurationChange={(key, duration) =>
                          setDurations((prev) => ({ ...prev, [key]: duration }))
                        }
                      />
                      {status === "submitted" && (
                        <div className="flex justify-start max-w-3xl w-full">
                          <Loader2 className="size-4 animate-spin text-slate-200" />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex justify-center max-w-2xl w-full">
                      <Loader2 className="size-4 animate-spin text-slate-200" />
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* INPUT BAR (minimal glass) */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/70 backdrop-blur-2xl">
          <div className="w-full px-4 sm:px-5 pt-4 pb-3 flex justify-center">
            <div className="max-w-3xl w-full">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Controller
                    name="message"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="sr-only">Message</FieldLabel>
                        <div className="relative">
                          <Input
                            {...field}
                            className="h-13 pr-14 pl-4 bg-white/8 border border-white/15 text-slate-50 placeholder:text-slate-400 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.7)] focus-visible:ring-0 focus-visible:border-white/40"
                            placeholder='Ask for a recipe… e.g. "Paneer tikka with less oil"'
                            disabled={status === "streaming"}
                            autoComplete="off"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                form.handleSubmit(onSubmit)();
                              }
                            }}
                          />
                          {(status === "ready" || status === "error") && (
                            <Button
                              className="absolute right-1.5 top-1.5 rounded-2xl h-10 w-10 bg-gradient-to-br from-emerald-400 via-lime-300 to-amber-200 text-slate-900 shadow-[0_10px_30px_rgba(34,197,94,0.6)] border border-white/40"
                              size="icon"
                              type="submit"
                              disabled={!field.value.trim()}
                            >
                              <ArrowUp className="size-4" />
                            </Button>
                          )}
                          {(status === "streaming" || status === "submitted") && (
                            <Button
                              className="absolute right-1.5 top-1.5 rounded-2xl h-10 w-10 bg-white/10 border border-white/30 text-slate-50"
                              size="icon"
                              type="button"
                              onClick={() => stop()}
                            >
                              <Square className="size-4" />
                            </Button>
                          )}
                        </div>
                      </Field>
                    )}
                  />
                </FieldGroup>
              </form>
            </div>
          </div>
          <div className="w-full px-4 sm:px-5 pb-3 items-center flex justify-center text-[10px] text-slate-300/80">
            © {new Date().getFullYear()} {OWNER_NAME}&nbsp;·&nbsp;
            <Link href="/terms" className="underline">
              Terms of Use
            </Link>
            &nbsp;·&nbsp;
            <Link href="https://ringel.ai/" className="underline">
              Powered by Ringel.AI
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

