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
    return JSON.parse(stored);
  } catch {
    return { messages: [], durations: {} };
  }
};

const saveMessagesToStorage = (messages: UIMessage[], durations: Record<string, number>) => {
  if (typeof window === "undefined") return;
  const data: StorageData = { messages, durations };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// 🌟 Quick suggestions shown under header
const quickPrompts = [
  "Suggest a quick Indian breakfast with oats",
  "Give me an Italian pasta dinner for beginners",
  "Plan a 3-dish North Indian thali",
  "Healthy vegetarian lunchbox idea",
  "Mexican dinner with chicken under 30 min",
];

export default function Chat() {
  const [isClient, setIsClient] = useState(false);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const welcomeMessageShownRef = useRef(false);

  const stored = typeof window !== "undefined" ? loadMessagesFromStorage() : {};
  const [initialMessages] = useState<UIMessage[]>(stored.messages || []);

  const { messages, sendMessage, status, stop, setMessages } = useChat({ messages: initialMessages });

  useEffect(() => {
    setIsClient(true);
    setDurations(stored.durations || {});
    setMessages(stored.messages || []);
  }, []);

  useEffect(() => {
    if (isClient) saveMessagesToStorage(messages, durations);
  }, [messages, durations, isClient]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  // Inject welcome message first time
  useEffect(() => {
    if (isClient && initialMessages.length === 0 && !welcomeMessageShownRef.current) {
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

  function onSubmit(data: any) {
    sendMessage({ text: data.message });
    form.reset();
  }

  function clearChat() {
    setMessages([]);
    setDurations({});
    saveMessagesToStorage([], {});
    toast.success("Chat cleared 🍽️");
  }

  return (
    <div
      className="relative flex h-screen w-full font-sans bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url('/bg-food.jpg')` }}
    >
      {/* 🔥 Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <main className="relative w-full h-screen z-10">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-black/50 border-b border-white/10 pb-10">
          <ChatHeader>
            <ChatHeaderBlock />
            <ChatHeaderBlock className="justify-center items-center gap-3 text-white">
              <Avatar className="size-8 ring-2 ring-yellow-400 bg-white shadow-md">
                <AvatarImage src="/logo.png" />
                <AvatarFallback />
              </Avatar>
              <div className="text-center leading-tight">
                <p className="font-semibold">{AI_NAME}</p>
                <p className="text-[11px] text-yellow-300">
                  Your personal culinary assistant
                </p>
              </div>
            </ChatHeaderBlock>
            <ChatHeaderBlock className="justify-end">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer bg-black/30 border-white/20 text-white shadow hover:bg-black/50"
                onClick={clearChat}
              >
                <Plus className="size-4" />
                {CLEAR_CHAT_TEXT}
              </Button>
            </ChatHeaderBlock>
          </ChatHeader>
        </div>

        {/* Main scrollable area */}
        <div className="h-screen overflow-y-auto px-5 py-5 w-full pt-[110px] pb-[170px]">
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            
            {/* Quick suggestion chips */}
            <div className="bg-black/40 border border-white/10 rounded-3xl px-5 py-4 text-white card-appear">
              <p className="font-medium">✨ What can I help you cook today?</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="quick-chip text-[12px] px-3 py-1 rounded-full bg-yellow-500/80 text-black font-medium"
                    onClick={() => form.setValue("message", prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages area */}
            <div className="flex-1 bg-white/90 border border-white/30 rounded-3xl backdrop-blur-md shadow-2xl px-5 py-6 float-in">
              <MessageWall
                messages={messages}
                status={status}
                durations={durations}
                onDurationChange={(k, d) => setDurations({ ...durations, [k]: d })}
              />
              {status === "submitted" && (
                <div className="flex justify-start">
                  <Loader2 className="size-4 animate-spin text-black/80" />
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Input bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md pt-5 pb-3">
          <div className="max-w-3xl mx-auto px-5">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="message"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel className="sr-only">Message</FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          className="h-14 pr-14 pl-5 bg-white/90 text-black border border-white/50 rounded-2xl shadow-md"
                          placeholder="Ask me anything about food…🍲"
                        />
                        <Button
                          className="absolute right-2 top-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-black"
                          size="icon"
                          type="submit"
                        >
                          <ArrowUp className="size-5" />
                        </Button>
                      </div>
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center text-white text-[11px] pt-2">
            © {new Date().getFullYear()} {OWNER_NAME} — Powered by Ringel.AI
          </div>
        </div>
      </main>
    </div>
  );
}

