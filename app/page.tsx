"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { ArrowUp, Loader2, Plus, Square, Mic, MicOff } from "lucide-react";
import { MessageWall } from "@/components/messages/message-wall";
import { ChatHeader, ChatHeaderBlock } from "@/app/parts/chat-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UIMessage } from "ai";
import { useEffect, useState, useRef } from "react";
import { AI_NAME, CLEAR_CHAT_TEXT, OWNER_NAME, WELCOME_MESSAGE } from "@/config";
import Image from "next/image";
import Link from "next/link";

const formSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
});

const STORAGE_KEY = "chat-messages";

type StorageData = {
  messages: UIMessage[];
  durations: Record<string, number>;
};

export default function Chat() {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any | null>(null);

  const [durations, setDurations] = useState<Record<string, number>>({});
  const welcomeMessageShownRef = useRef(false);

  const stored = {
    messages: [],
    durations: {},
    ...(typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
      : {})
  };

  const [initialMessages] = useState<UIMessage[]>(stored.messages);

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    messages: initialMessages,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  const saveMessagesToStorage = (
    messages: UIMessage[],
    durations: Record<string, number>
  ) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, durations }));
  };

  useEffect(() => {
    setDurations(stored.durations);
    setMessages(stored.messages);
  }, []);

  useEffect(() => {
    saveMessagesToStorage(messages, durations);
  }, [messages, durations]);

  useEffect(() => {
    if (initialMessages.length === 0 && !welcomeMessageShownRef.current) {
      const welcomeMessage: UIMessage = {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        parts: [
          { type: "text", text: WELCOME_MESSAGE },
        ],
      };
      setMessages([welcomeMessage]);
      saveMessagesToStorage([welcomeMessage], {});
      welcomeMessageShownRef.current = true;
    }
  }, [initialMessages.length, setMessages]);

  // Speech Recognition 🎤
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal)
          final += event.results[i][0].transcript;
      }
      if (final) {
        form.setValue("message", final);
      }
    };

    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, [form]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) recognitionRef.current.stop();
    else recognitionRef.current.start();
    setIsListening(!isListening);
  };

  function onSubmit(data: z.infer<typeof formSchema>) {
    sendMessage({ text: data.message });
    form.reset();
  }

  function clearChat() {
    const newMessages: UIMessage[] = [];
    const newDurations = {};
    setMessages(newMessages);
    setDurations(newDurations);
    saveMessagesToStorage(newMessages, newDurations);
    toast.success("Chat cleared");
  }

  return (
    <div
      className="relative h-screen w-full flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/bg-food.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Slight dark overlay (10–15%) */}
      <div className="absolute inset-0 bg-black/20"></div>

      <main className="relative z-10 w-full h-screen text-white">
        {/* HEADER */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/30 pb-16 backdrop-saturate-150">
          <ChatHeader>
            <ChatHeaderBlock />
            <ChatHeaderBlock className="justify-center items-center gap-2">
              <Avatar className="size-9 ring-2 ring-amber-400 bg-black/30">
                <AvatarImage src="/logo.png" />
                <AvatarFallback className="bg-white text-black">F</AvatarFallback>
              </Avatar>
              <p className="text-lg font-bold text-amber-300 drop-shadow">Food AI Chef</p>
            </ChatHeaderBlock>
            <ChatHeaderBlock className="justify-end">
              <Button
                variant="outline"
                size="sm"
                className="text-black bg-amber-300 hover:bg-amber-400 rounded-full shadow-xl"
                onClick={clearChat}
              >
                <Plus className="size-4" /> {CLEAR_CHAT_TEXT}
              </Button>
            </ChatHeaderBlock>
          </ChatHeader>
        </div>

        {/* MESSAGES */}
        <div className="h-screen overflow-y-auto px-5 py-4 pt-[95px] pb-[150px]">
          <MessageWall messages={messages} status={status} durations={durations} />
        </div>

        {/* INPUT */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/40 pt-4 pb-3">
          <div className="w-full px-5 flex justify-center">
            <form
              className="max-w-3xl w-full flex items-center gap-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup className="flex-grow">
                <Controller
                  name="message"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel className="sr-only">Message</FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="Type or speak... e.g. 'Recipe for sushi'"
                          className="bg-white/90 text-black font-semibold border-2 border-amber-400 rounded-xl px-5 h-14"
                          autoComplete="off"
                        />

                        {/* 🎤 Mic */}
                        <Button
                          type="button"
                          className={`absolute right-12 top-2.5 h-9 w-9 rounded-full border ${
                            isListening ? "bg-red-500" : "bg-amber-300"
                          } text-black`}
                          onClick={toggleListening}
                        >
                          {isListening ? <MicOff /> : <Mic />}
                        </Button>

                        {/* ⬆ Send */}
                        <Button
                          type="submit"
                          disabled={!field.value.trim()}
                          className="absolute right-2 top-2.5 h-9 w-9 rounded-full bg-amber-400 text-black"
                        >
                          <ArrowUp />
                        </Button>
                      </div>
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </div>

          <p className="text-center text-xs mt-2 text-amber-300">
            © {new Date().getFullYear()} {OWNER_NAME} — Smart Chef AI 🍽️
          </p>
        </div>
      </main>
    </div>
  );
}

