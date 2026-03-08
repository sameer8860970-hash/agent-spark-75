import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Image, ChevronDown, Sparkles } from "lucide-react";
import IntegrationPicker from "./IntegrationPicker";

export interface Integration {
  id: string;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
}

const INTEGRATIONS: Integration[] = [
  { id: "slack", name: "Slack", icon: "💬", color: "hsl(var(--status-process))", connected: false },
  { id: "whatsapp", name: "WhatsApp", icon: "📱", color: "hsl(var(--status-done))", connected: false },
  { id: "gmail", name: "Gmail", icon: "✉️", color: "hsl(var(--status-failed))", connected: false },
  { id: "drive", name: "Google Drive", icon: "📁", color: "hsl(var(--status-pending))", connected: false },
  { id: "notion", name: "Notion", icon: "📝", color: "hsl(var(--foreground))", connected: false },
  { id: "github", name: "GitHub", icon: "🐙", color: "hsl(var(--foreground))", connected: false },
  { id: "jira", name: "Jira", icon: "🔷", color: "hsl(var(--status-process))", connected: false },
  { id: "hubspot", name: "HubSpot", icon: "🟠", color: "hsl(var(--status-pending))", connected: false },
  { id: "salesforce", name: "Salesforce", icon: "☁️", color: "hsl(var(--status-process))", connected: false },
  { id: "twilio", name: "Twilio", icon: "📞", color: "hsl(var(--status-failed))", connected: false },
  { id: "stripe", name: "Stripe", icon: "💳", color: "hsl(var(--status-process))", connected: false },
  { id: "zapier", name: "Zapier", icon: "⚡", color: "hsl(var(--status-pending))", connected: false },
  { id: "amplitude", name: "Amplitude", icon: "📊", color: "hsl(var(--status-process))", connected: false },
  { id: "postgres", name: "PostgreSQL", icon: "🐘", color: "hsl(var(--status-process))", connected: false },
  { id: "mongodb", name: "MongoDB", icon: "🍃", color: "hsl(var(--status-done))", connected: false },
];

interface ChatInputProps {
  onSend: (message: string, attachedIntegrations: Integration[]) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [attachedIntegrations, setAttachedIntegrations] = useState<Integration[]>([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (value: string) => {
    setInput(value);
    const pos = textareaRef.current?.selectionStart || 0;
    setCursorPosition(pos);

    // Check if @ was just typed
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
    // Remove the @query from input
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

  // Auto-resize textarea
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
            integrations={INTEGRATIONS}
            searchQuery={searchQuery}
            onSelect={handleSelectIntegration}
            onClose={() => setShowPicker(false)}
          />
        )}
      </AnimatePresence>

      <div className="border border-border rounded-xl bg-background shadow-sm">
        {/* Attached integrations */}
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
                  <span className="text-muted-foreground text-xs ml-0.5">×</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message your agent... Type @ to connect integrations"
          rows={1}
          className="w-full resize-none bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />

        {/* Bottom bar */}
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

      {/* Local indicator */}
      <div className="flex items-center gap-1.5 mt-2 px-1">
        <span className="text-xs text-muted-foreground">☐ Local</span>
        <ChevronDown size={11} className="text-muted-foreground" />
      </div>
    </div>
  );
};

export default ChatInput;
