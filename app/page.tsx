"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { ArrowUp, Loader2, Plus, Square, Mic } from "lucide-react";
import { MessageWall } from "@/components/messages/message-wall";
import { ChatHeader, ChatHeaderBlock } from "@/app/parts/chat-header";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { UIMessage } from "ai";
import { useEffect, useState, useRef } from "react";
import {
  AI_NAME,
  CLEAR_CHAT_TEXT,
  OWNER_NAME,
  WELCOME_MESSAGE,
} from "@/config";
import Link from "next/link";

// ---------- Form schema ----------
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

const loadMessagesFromStorage = (): {
  messages: UIMessage[];
  durations: Record<string, number>;
} => {
  if (typeof window === "undefined") return { messages: [], durations: {} };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { messages: [], durations: {} };

    const parsed = JSON.parse(stored);
    return {
      messages: parsed.messages || [],
      durations: parsed.durations || {},
    };
  } catch (error) {
    console.error("Failed to load messages from localStorage:", error);
    return { messages: [], durations: {} };
  }
};

const saveMessagesToStorage = (
  messages: UIMessage[],
  durations: Record<string, number>,
) => {
  if (typeof window === "undefined") return;
  try {
    const data: StorageData = { messages, durations };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save messages to localStorage:", error);
  }
};

export default function Chat() {
  const [isClient, setIsClient] = useState(false);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const welcomeMessageShownRef = useRef<boolean>(false);

  const stored =
    typeof window !== "undefined"
      ? loadMessagesFromStorage()
      : { messages: [], durations: {} };
  const [initialMessages] = useState<UIMessage[]>(stored.messages);

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    messages: initialMessages,
  });

  // ---------- Audio recording state ----------
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
    setDurations(stored.durations);
    setMessages(stored.messages);
  }, []);

  useEffect(() => {
    if (isClient) {
      saveMessagesToStorage(messages, durations);
    }
  }, [durations, messages, isClient]);

  // Initialise SpeechRecognition (browser only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognitionRef.current = recognition;
    }
  }, []);

  const handleMicClick = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      toast.error("Your browser does not support voice input.");
      return;
    }

    if (!isRecording) {
      setIsRecording(true);
      recognition.start();
    } else {
      setIsRecording(false);
      recognition.stop();
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      // Put recognised text into the input
      form.setValue("message", transcript);
    };
    recognition.onend = () => {
      setIsRecording(false);
    };
  };

  const handleDurationChange = (key: string, duration: number) => {
    setDurations((prevDurations) => {
      const newDurations = { ...prevDurations };
      newDurations[key] = duration;
      return newDurations;
    });
  };

  useEffect(() => {
    if (
      isClient &&
      initialMessages.length === 0 &&
      !welcomeMessageShownRef.current
    ) {
      const welcomeMessage: UIMessage = {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        parts: [
          {
            type: "text",
            text: WELCOME_MESSAGE,
          },
        ],
      };
      setMessages([welcomeMessage]);
      saveMessagesToStorage([welcomeMessage], {});
      welcomeMessageShownRef.current = true;
    }
  }, [isClient, initialMessages.length, setMessages]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  // Quick suggestion prompts shown under the header
  const quickPrompts = [
    "Suggest a quick Indian breakfast with oats",
    "Give me a beginner-friendly Italian pasta dinner",
    "Plan a 3-dish North Indian thali for 2 people",
    "Healthy vegetarian lunchbox idea",
    "Mexican dinner with chicken in under 30 minutes",
  ];

  function onSubmit(data: z.infer<typeof formSchema>) {
    sendMessage({ text: data.message });
    form.reset();
  }

  function clearChat() {
    const newMessages: UIMessage[] = [];
    const newDurations: Record<string, number> = {};
    setMessages(newMessages);
    setDurations(newDurations);
    saveMessagesToStorage(newMessages, newDurations);
    toast.success("Chat cleared");
  }

  return (
    <div className="flex h-screen items-center justify-center font-sans bg-gradient-to-b from-sky-900 via-sky-950 to-slate-950">
      <main className="w-full h-screen relative">
        {/* Top header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-sky-950/95 via-sky-900/75 to-transparent overflow-visible pb-16">
          <div className="relative overflow-visible">
            <ChatHeader>
              <ChatHeaderBlock />
              <ChatHeaderBlock className="justify-center items-center gap-3">
                {/* Bigger circular image inside header */}
                <Avatar className="h-16 w-16 rounded-full ring-2 ring-red-300 bg-sky-900 overflow-hidden shrink-0">
                  <AvatarImage
                    src="/logo.png"
                    alt="Food Recipe ChatBot Logo"
                    className="object-cover"
                  />
                </Avatar>

                <div className="flex flex-col">
                  <p className="tracking-tight text-sm font-semibold text-white">
                    Chat with {AI_NAME}
                  </p>
                  <p className="text-[11px] text-sky-100/80">
                    Ask for recipes, substitutions, or dish ideas across
                    cuisines.
                  </p>
                </div>
              </ChatHeaderBlock>
              <ChatHeaderBlock className="justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer bg-sky-900/70 border-sky-400 text-sky-50 hover:bg-sky-800"
                  onClick={clearChat}
                >
                  <Plus className="size-4" />
                  {CLEAR_CHAT_TEXT}
                </Button>
              </ChatHeaderBlock>
            </ChatHeader>
          </div>
        </div>

        {/* Main content: intro panel + chat panel */}
        <div className="h-screen overflow-y-auto px-5 py-4 w-full pt-[110px] pb-[170px]">
          <div className="max-w-3xl mx-auto flex flex-col gap-4 min-h-full">
            {/* Intro panel with quick prompts */}
            <section className="card-appear rounded-3xl bg-sky-900/60 border border-sky-500 text-sky-50 shadow-md px-5 py-4 text-sm">
              <p className="font-semibold text-white">
                🍳 What can I help you cook today?
              </p>
              <p className="mt-1 text-[13px] text-sky-100/90">
                Ask me for full recipes, ideas with whatever you have in your
                fridge, or tweaks for your favourite dishes.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="quick-chip text-[11px] px-3 py-1 rounded-full bg-sky-800/80 text-sky-50 border border-sky-400/80"
                    onClick={() => form.setValue("message", prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </section>

            {/* Chat area */}
            <section className="flex-1 flex flex-col justify-end">
              <div className="rounded-3xl bg-red-700/90 border border-red-900 shadow-lg px-4 py-4 float-in text-white">
                <div className="flex flex-col items-center justify-end min-h-[260px]">
                  {isClient ? (
                    <>
                      <MessageWall
                        messages={messages}
                        status={status}
                        durations={durations}
                        onDurationChange={handleDurationChange}
                      />
                      {status === "submitted" && (
                        <div className="flex justify-start max-w-3xl w-full mt-2">
                          <Loader2 className="size-4 animate-spin text-red-100" />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex justify-center max-w-2xl w-full">
                      <Loader2 className="size-4 animate-spin text-red-100" />
                    </div>
                  )}
                </div>

                {/* AI disclaimer */}
                <p className="mt-4 text-[11px] text-red-100/85 leading-snug border-t border-red-400/60 pt-3 flex gap-1">
                  <span className="mt-[2px] text-xs">⚠️</span>
                  <span>
                    Recipes and suggestions are{" "}
                    <span className="font-semibold">generated by AI</span>.
                    Please double-check ingredient quantities, allergens, and
                    cooking times before using them.
                  </span>
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom input bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-sky-950/95 via-sky-900/75 to-transparent overflow-visible pt-13">
          <div className="w-full px-5 pt-5 pb-1 items-center flex justify-center relative overflow-visible">
            <div className="message-fade-overlay" />
            <div className="max-w-3xl w-full">
              <form id="chat-form" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Controller
                    name="message"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="chat-form-message"
                          className="sr-only"
                        >
                          Message
                        </FieldLabel>
                        <div className="relative h-13">
                          <Input
                            {...field}
                            id="chat-form-message"
                            className="h-15 pr-24 pl-5 rounded-[20px] bg-sky-900/80 border border-sky-500 text-white placeholder:text-sky-200/80 shadow-md"
                            placeholder='Say or type something… e.g. "Suggest a quick Indian breakfast with oats"'
                            disabled={status === "streaming"}
                            aria-invalid={fieldState.invalid}
                            autoComplete="off"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                form.handleSubmit(onSubmit)();
                              }
                            }}
                          />

                          {/* Mic button */}
                          <Button
                            type="button"
                            className={`absolute right-14 top-3 rounded-full ${
                              isRecording
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-sky-600 hover:bg-sky-700"
                            } text-white`}
                            size="icon"
                            onClick={handleMicClick}
                          >
                            {isRecording ? (
                              <Square className="size-4" />
                            ) : (
                              <Mic className="size-4" />
                            )}
                          </Button>

                          {/* Send / Stop buttons */}
                          {(status === "ready" || status === "error") && (
                            <Button
                              className="absolute right-3 top-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                              type="submit"
                              disabled={!field.value.trim()}
                              size="icon"
                            >
                              <ArrowUp className="size-4" />
                            </Button>
                          )}
                          {(status === "streaming" ||
                            status === "submitted") && (
                            <Button
                              className="absolute right-3 top-3 rounded-full bg-slate-600 hover:bg-slate-700 text-white"
                              size="icon"
                              type="button"
                              onClick={() => {
                                stop();
                              }}
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
          <div className="w-full px-5 py-3 items-center flex justify-center text-xs text-sky-100/80">
            © {new Date().getFullYear()} {OWNER_NAME}&nbsp;
            <Link href="/terms" className="underline">
              Terms of Use
            </Link>
            &nbsp;Powered by&nbsp;
            <Link href="https://ringel.ai/" className="underline">
              Ringel.AI
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}


