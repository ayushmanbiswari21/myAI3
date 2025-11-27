import { UIMessage, ToolCallPart, ToolResultPart } from "ai";
import { Response } from "@/components/ai-elements/response";
import { ReasoningPart } from "./reasoning-part";
import { ToolCall, ToolResult } from "./tool-call";

export function AssistantMessage({
  message,
  status,
  isLastMessage,
  durations,
  onDurationChange,
}: {
  message: UIMessage;
  status?: string;
  isLastMessage?: boolean;
  durations?: Record<string, number>;
  onDurationChange?: (key: string, duration: number) => void;
}) {
  return (
    <div className="w-full">
      <div className="text-sm flex flex-col gap-4">
        {message.parts.map((part, i) => {
          const isStreaming =
            status === "streaming" &&
            isLastMessage &&
            i === message.parts.length - 1;

          const durationKey = `${message.id}-${i}`;
          const duration = durations?.[durationKey];

          // Normal text part (recipe body, etc.)
          if (part.type === "text") {
            return (
              <Response key={`${message.id}-${i}`}>
                {part.text}
              </Response>
            );
          }

          // Reasoning traces (if enabled)
          if (part.type === "reasoning") {
            return (
              <ReasoningPart
                key={`${message.id}-${i}`}
                part={part}
                isStreaming={isStreaming}
                duration={duration}
                onDurationChange={
                  onDurationChange
                    ? (d) => onDurationChange(durationKey, d)
                    : undefined
                }
              />
            );
          }

          // Tool calls / tool results  → yellow pill bubble on the red card
          if (part.type.startsWith("tool-") || part.type === "dynamic-tool") {
            // Tool *result* (after tool finishes)
            if ("state" in part && part.state === "output-available") {
              return (
                <div
                  key={`${message.id}-${i}`}
                  className="inline-flex self-end bg-yellow-400 text-black rounded-full px-4 py-2 font-semibold shadow-md"
                >
                  <ToolResult part={part as unknown as ToolResultPart} />
                </div>
              );
            }

            // Tool *call* (the white pill you circled earlier)
            return (
              <div
                key={`${message.id}-${i}`}
                className="inline-flex self-end bg-yellow-400 text-black rounded-full px-4 py-2 font-semibold shadow-md"
              >
                <ToolCall part={part as unknown as ToolCallPart} />
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
