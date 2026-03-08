import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import ChatInput from "@/components/ChatInput";
import { usePlatform } from "@/context/PlatformContext";
import type { Integration } from "@/context/PlatformContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  integrations?: Integration[];
  timestamp: Date;
}

const ChatPage = () => {
  const { integrations, toggleIntegration } = usePlatform();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = (content: string, attachedIntegrations: Integration[]) => {
    attachedIntegrations.forEach((int) => {
      const existing = integrations.find((i) => i.id === int.id);
      if (existing && !existing.connected) {
        toggleIntegration(int.id);
      }
    });

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      integrations: attachedIntegrations.length > 0 ? attachedIntegrations : undefined,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    setTimeout(() => {
      const intNames = attachedIntegrations.map((i) => i.name).join(", ");
      const responseContent = attachedIntegrations.length > 0
        ? `✅ Connected to **${intNames}** successfully!\n\nI'll use ${attachedIntegrations.length > 1 ? "these integrations" : "this integration"} to help with your request.\n\n${content ? `Regarding "${content}" — I'm analyzing the data now and will have results shortly.` : "What would you like me to do with this integration?"}`
        : `${content}\n\nI'm processing this now. Type **@** to connect integrations like Slack, WhatsApp, Gmail for enhanced capabilities.`;

      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      }]);
      setIsLoading(false);
    }, 1200);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-center"
            >
              <h1 className="text-base font-medium text-foreground">New Chat</h1>
              <p className="text-xs text-muted-foreground mt-1">Type @ to connect integrations</p>
            </motion.div>
            <ChatInput onSend={handleSend} isLoading={isLoading} integrations={integrations} />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto py-6 px-4 space-y-5">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
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
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-accent text-xs font-medium text-foreground"
                            >
                              <img src={int.logo} alt={int.name} className="w-3 h-3" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                              {int.name}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="bg-accent rounded-2xl rounded-br-sm px-3.5 py-2">
                        <p className="text-sm text-foreground">{msg.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-primary-foreground text-[10px] font-bold">A</span>
                      </div>
                      <div className="flex-1 prose prose-sm max-w-none text-foreground [&_p]:text-[13px] [&_p]:leading-relaxed [&_strong]:font-semibold">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                <div className="w-6 h-6 rounded-md bg-foreground flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground text-[10px] font-bold">A</span>
                </div>
                <div className="flex items-center gap-1 pt-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                      className="w-1 h-1 rounded-full bg-muted-foreground"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {hasMessages && (
        <div className="border-t border-border p-4">
          <ChatInput onSend={handleSend} isLoading={isLoading} integrations={integrations} />
        </div>
      )}
    </div>
  );
};

export default ChatPage;
