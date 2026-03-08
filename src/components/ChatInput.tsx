import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Image, ChevronDown, Sparkles } from "lucide-react";
import IntegrationPicker from "./IntegrationPicker";
import type { Integration } from "@/context/PlatformContext";

interface ChatInputProps {
  onSend: (message: string, attachedIntegrations: Integration[]) => void;
  isLoading: boolean;
  integrations: Integration[];
}

const ChatInput = ({ onSend, isLoading, integrations }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [attachedIntegrations, setAttachedIntegrations] = useState<Integration[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (value: string) => {
    setInput(value);
    const pos = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = value.slice(0, pos);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");
    
    if (lastAtIndex !== -1 && (lastAtIndex === 0 || textBeforeCursor[lastAtIndex - 1] === " ")) {
      const query = textBeforeCursor.slice(lastAtIndex + 1);
      if (!query.includes(" ")) {
        setSearchQuery(query);
        setShowPicker(true);
        return;
      }
    }
    setShowPicker(false);
  };

  const handleSelectIntegration = (integration: Integration) => {
    const pos = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = input.slice(0, pos);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");
    const newInput = input.slice(0, lastAtIndex) + input.slice(pos);
    setInput(newInput);
    setShowPicker(false);

    if (!attachedIntegrations.find((i) => i.id === integration.id)) {
      setAttachedIntegrations((prev) => [...prev, { ...integration, connected: true }]);
    }

    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const removeIntegration = (id: string) => {
    setAttachedIntegrations((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSend = () => {
    if (!input.trim() && attachedIntegrations.length === 0) return;
    onSend(input, attachedIntegrations);
    setInput("");
    setAttachedIntegrations([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !showPicker) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape") {
      setShowPicker(false);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <AnimatePresence>
        {showPicker && (
          <IntegrationPicker
            integrations={integrations}
            searchQuery={searchQuery}
            onSelect={handleSelectIntegration}
            onClose={() => setShowPicker(false)}
          />
        )}
      </AnimatePresence>

      <div className="border border-border rounded-xl bg-background shadow-sm">
        <AnimatePresence>
          {attachedIntegrations.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-wrap gap-1.5 px-3 pt-3 overflow-hidden"
            >
              {attachedIntegrations.map((integration) => (
                <motion.div
                  key={integration.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent text-sm text-foreground cursor-pointer hover:bg-border transition-colors"
                  onClick={() => removeIntegration(integration.id)}
                >
                  <span>{integration.icon}</span>
                  <span className="font-medium">{integration.name}</span>
                  {integration.connected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-status-done" />
                  )}
                  <span className="text-muted-foreground text-xs ml-0.5">×</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message your agent... Type @ to connect integrations"
          rows={1}
          className="w-full resize-none bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />

        <div className="flex items-center justify-between px-3 pb-2.5">
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors">
              <Sparkles size={13} />
              Agent
              <ChevronDown size={12} />
            </button>
            <span className="text-xs text-muted-foreground">
              Codex 5.3 <span className="opacity-60">⊙ High Fast</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors">
              <Image size={16} />
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={isLoading}
              className="p-1.5 rounded-full bg-foreground text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              <Send size={14} />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-2 px-1">
        <span className="text-xs text-muted-foreground">☐ Local</span>
        <ChevronDown size={11} className="text-muted-foreground" />
      </div>
    </div>
  );
};

export default ChatInput;
