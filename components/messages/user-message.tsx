import { UIMessage } from "ai";
import { Response } from "@/components/ai-elements/response";

export function UserMessage({ message }: { message: UIMessage }) {
  return (
    <div className="whitespace-pre-wrap w-full flex justify-end">
      <div className="max-w-lg w-fit px-4 py-3 rounded-[20px] bg-neutral-100">
        <div className="text-sm text-black"> {/* <-- force black text */}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case "text":
                return (
                  <Response key={`${message.id}-${i}`} className="text-black">
                    {part.text}
                  </Response>
                );
            }
          })}
        </div>
      </div>
    </div>
  );
}
