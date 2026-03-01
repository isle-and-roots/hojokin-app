import { Metadata } from "next";
import { ChatInterface } from "@/components/chat/chat-interface";

export const metadata: Metadata = {
  title: "AIチャット | 補助金サポート",
  description: "補助金申請に関する質問をAIアシスタントに相談できます",
};

export default function ChatPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] lg:h-screen">
      <div className="border-b border-border px-6 py-4 shrink-0">
        <h1 className="text-xl font-semibold">AIチャット</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          補助金申請についてなんでもご相談ください
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
