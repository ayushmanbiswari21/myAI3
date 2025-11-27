"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { ArrowUp, Loader2, Plus, Square, Mic, MicOff, Download } from "lucide-react";
import { MessageWall } from "@/components/messages/message-wall";
import { ChatHeader, ChatHeaderBlock } from "@/app/parts/chat-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UIMessage } from "ai";
import { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf"; // 📄 PDF generation

import {
  AI_NAME,
  CLEAR_CHAT_TEXT,
  OWNER_NAME,
  WELCOME_MESSAGE,
} from "@/config";

import Image from "next/image";
import Link from "next/link";

const formSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
});

// Storage local caching
const STORAGE_KEY = "chat-messages";

export default function Chat() {
  const [isClient, setIsClient] = useState(false);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const welcomeMessageShownRef = useRef(false);

  // Voice recognition
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any | null>(null);

  // Track last recipe for PDF export
  const [lastRecipeMessage, setLastRecipeMessage] = useState<UIMessage | null>(null);

  const storedMessageData =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem(STORAGE_KEY) || "{\"messages\":[],\"durations\":{}}")
      : { messages: [], durations: {} };

  const [initialMessages] = useState<UIMessage[]>(storedMessageData.messages);

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    messages: initialMessages,
  });

  // Save on change
  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ messages, durations })
    );
  }, [messages, durations, isClient]);

  useEffect(() => {
    setIsClient(true);
    setMessages(storedMessageData.messages);
    setDurations(storedMessageData.durations);
  }, []);

  // First message welcome
  useEffect(() => {
    if (!isClient) return;
    if (initialMessages.length === 0 && !welcomeMessageShownRef.current) {
      const welcome: UIMessage = {
        id: "welcome-" + Date.now(),
        role: "assistant",
        parts: [{ type: "text", text: WELCOME_MESSAGE }],
      };
      setMessages([welcome]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: [welcome], durations: {} }));
      welcomeMessageShownRef.current = true;
    }
  }, [isClient, initialMessages.length, setMessages]);

  // Track last assistant output for PDF use
  useEffect(() => {
    const last = [...messages].reverse().find((m) => m.role === "assistant");
    if (last) setLastRecipeMessage(last);
  }, [messages]);

  // Form submit
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  function onSubmit(data: any) {
    sendMessage({ text: data.message });
    form.reset();
  }

  // Clear chat
  function clearChat() {
    setMessages([]);
    setDurations({});
    setLastRecipeMessage(null);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: [], durations: {} }));
    toast.success("Chat cleared");
  }

  // 🎤 Voice input handling
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).webkitSpeechRecognition
      || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
      if (transcript) {
        form.setValue("message", form.getValues("message") + " " + transcript);
      }
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, [form]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      toast.error("Voice input unsupported in this browser");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // 📄 Generate PDF
  const downloadPDF = () => {
    if (!lastRecipeMessage) {
      toast.error("No recipe yet!");
      return;
    }

    const recipeText = lastRecipeMessage.parts
      ?.filter((p: any) => p.type === "text")
      ?.map((p: any) => p.text)
      ?.join("\n\n");

    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    const margin = 20;
    const maxWidth = doc.internal.pageSize.getWidth() - 2 * margin;
    const lines = doc.splitTextToSize(recipeText, maxWidth);

    doc.text(lines, margin, margin);
    doc.save("recipe.pdf");
  };

  return (
    <div className="flex h-screen items-center justify-center font-sans bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50">
      <main className="w-full h-screen relative">

        {/* HEADER */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-amber-50/95 pb-16">
          <ChatHeader>
            <ChatHeaderBlock />
            <ChatHeaderBlock className="justify-center items-center gap-2">
              <Avatar className="size-8 ring-2 ring-amber-400 bg-white">
                <AvatarImage src="/logo.png" />
                <AvatarFallback>🍽</AvatarFallback>
              </Avatar>
              <p className="tracking-tight text-sm font-semibold text-amber-900">
                Chat with {AI_NAME}
              </p>
            </ChatHeaderBlock>
            <ChatHeaderBlock className="justify-end gap-2">
              {lastRecipeMessage && (
                <Button size="sm" className="bg-amber-500 text-white" onClick={downloadPDF}>
                  <Download className="size-4" /> PDF
                </Button>
              )}
              <Button variant="outline" className="bg-white" onClick={clearChat}>
                <Plus className="size-4" /> {CLEAR_CHAT_TEXT}
              </Button>
            </ChatHeaderBlock>
          </ChatHeader>
        </div>

        {/* CHAT MESSAGES */}
        <div className="h-screen overflow-y-auto px-5 py-4 pt-[110px] pb-[160px]">
          <div className="max-w-3xl mx-auto">
            <MessageWall messages={messages} durations={durations} />
          </div>
        </div>

        {/* AI Disclaimer */}
        {lastRecipeMessage && (
          <p className="fixed bottom-[120px] w-full text-center text-[10px] text-gray-600">
            ⚠ AI-generated content — verify ingredients & dietary safety.
          </p>
        )}

        {/* INPUT BAR (includes microphone) */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-amber-50/95 py-3">
          <div className="max-w-3xl mx-auto px-5">

            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="message"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel className="sr-only">Chat Input</FieldLabel>
                      <div className="relative">

                        <Input
                          {...field}
                          placeholder="Type or speak... e.g. 'Paneer Butter Masala recipe'"
                          className="h-12 pr-20 pl-5 rounded-xl bg-white shadow"
                          autoComplete="off"
                        />

                        {/* Mic Button */}
                        <Button
                          type="button"
                          onClick={toggleMic}
                          className={`absolute right-14 top-2 h-8 w-8 rounded-full ${
                            isListening ? "bg-red-500" : "bg-amber-300"
                          }`}
                        >
                          {isListening ? <MicOff /> : <Mic />}
                        </Button>

                        {/* Send Button */}
                        <Button
                          type="submit"
                          disabled={!field.value.trim()}
                          className="absolute right-2 top-2 h-8 w-8 rounded-full bg-amber-500 text-white"
                        >
                          <ArrowUp className="size-4" />
                        </Button>

                      </div>
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>

            <p className="text-[10px] text-center text-gray-500 mt-2">
              © {new Date().getFullYear()} {OWNER_NAME} — Food Recipe ChatBot
            </p>

          </div>
        </div>
      </main>
    </div>
  );
}
