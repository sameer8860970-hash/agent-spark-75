import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import ChatInput from "@/components/ChatInput";
import type { Integration } from "@/components/ChatInput";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  integrations?: Integration[];
  timestamp: Date;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = (content: string, integrations: Integration[]) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      integrations: integrations.length > 0 ? integrations : undefined,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Simulate agent response
    setTimeout(() => {
      const intNames = integrations.map((i) => i.name).join(", ");
      const responseContent = integrations.length > 0
        ? `Connected to **${intNames}**. I'll use ${integrations.length > 1 ? "these integrations" : "this integration"} to help with your request.\n\n${content ? `Regarding "${content}" — I'm analyzing the data now. I'll have results for you shortly.` : "What would you like me to do with this integration?"}`
        : `I understand. Let me help you with that.\n\nYou asked: "${content}"\n\nI'm processing your request now. You can type **@** to connect integrations like Slack, WhatsApp, Gmail, and more for enhanced capabilities.`;

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 1200);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-lg font-medium text-foreground text-center">New Chat</h1>
            </motion.div>
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={msg.role === "user" ? "flex justify-end" : ""}
                >
                  {msg.role === "user" ? (
                    <div className="max-w-md">
                      {msg.integrations && msg.integrations.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-1.5 justify-end">
                          {msg.integrations.map((int) => (
                            <span
                              key={int.id}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent text-xs font-medium text-foreground"
                            >
                              {int.icon} {int.name}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="bg-accent rounded-2xl rounded-br-md px-4 py-2.5">
                        <p className="text-sm text-foreground">{msg.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-primary-foreground text-xs font-bold">A</span>
                      </div>
                      <div className="flex-1 prose prose-sm max-w-none text-foreground">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground text-xs font-bold">A</span>
                </div>
                <div className="flex items-center gap-1 pt-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Bottom input (when messages exist) */}
      {hasMessages && (
        <div className="border-t border-border p-4">
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
};

export default ChatPage;
