import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Plus, Activity, Clock, Webhook, Zap, ArrowUpRight, ChevronDown, ChevronUp, Search, FileText, Database, Globe, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { getIntegrationLogo } from "@/lib/integrationLogos";
import ChatInput from "@/components/ChatInput";
import { usePlatform } from "@/context/PlatformContext";
import CreateAgentModal from "@/components/CreateAgentModal";
import type { Integration } from "@/context/PlatformContext";

interface ThinkingStep {
  id: string;
  label: string;
  icon: "search" | "file" | "database" | "globe" | "sparkles";
  status: "running" | "done";
  detail?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  integrations?: Integration[];
  timestamp: Date;
  thinkingSteps?: ThinkingStep[];
  exploredSummary?: string;
}

const statusStyles: Record<string, string> = {
  active: "bg-status-done-bg text-status-done",
  inactive: "bg-status-queued-bg text-status-queued",
  draft: "bg-status-pending-bg text-status-pending",
  error: "bg-status-failed-bg text-status-failed",
};

const stepIcons = {
  search: Search,
  file: FileText,
  database: Database,
  globe: Globe,
  sparkles: Sparkles,
};

// Simulate structured thinking steps based on integrations and message content
const generateThinkingSteps = (content: string, attachedIntegrations: Integration[]): ThinkingStep[] => {
  const steps: ThinkingStep[] = [];
  const lower = content.toLowerCase();

  // Always start with exploration
  steps.push({ id: "explore", label: "Exploring context", icon: "file", status: "running", detail: `Analyzed ${Math.floor(Math.random() * 8) + 3} files` });

  // Add integration-specific steps
  attachedIntegrations.forEach((int) => {
    if (int.id === "amplitude" || int.category === "Analytics") {
      steps.push({ id: `search-${int.id}`, label: `Search in ${int.name}`, icon: "search", status: "running", detail: "Querying analytics data" });
    } else if (int.category === "Database") {
      steps.push({ id: `query-${int.id}`, label: `Query ${int.name}`, icon: "database", status: "running", detail: "Running SQL query" });
    } else if (int.category === "Messaging" || int.category === "Email") {
      steps.push({ id: `fetch-${int.id}`, label: `Fetch from ${int.name}`, icon: "globe", status: "running", detail: "Retrieving messages" });
    } else if (int.category === "CRM") {
      steps.push({ id: `crm-${int.id}`, label: `Search ${int.name}`, icon: "search", status: "running", detail: "Looking up records" });
    } else {
      steps.push({ id: `connect-${int.id}`, label: `Connect to ${int.name}`, icon: "globe", status: "running", detail: "Establishing connection" });
    }
  });

  // Add content-specific steps
  if (lower.includes("funnel") || lower.includes("analytics") || lower.includes("data")) {
    steps.push({ id: "analyze", label: "Analyzing data patterns", icon: "sparkles", status: "running", detail: "Running analysis" });
  }
  if (lower.includes("search") || lower.includes("find") || lower.includes("look")) {
    steps.push({ id: "web-search", label: "Web search", icon: "search", status: "running", detail: "2 searches" });
  }

  // Always end with synthesis
  steps.push({ id: "synthesize", label: "Synthesizing response", icon: "sparkles", status: "running", detail: "Generating answer" });

  return steps;
};

const ThinkingPopup = ({ steps, exploredSummary, isActive }: { steps: ThinkingStep[]; exploredSummary: string; isActive: boolean }) => {
  const [expanded, setExpanded] = useState(isActive);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border rounded-xl overflow-hidden bg-background mb-2"
    >
      {/* Summary header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-accent/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isActive ? (
            <Loader2 size={13} className="text-muted-foreground animate-spin" />
          ) : (
            <CheckCircle2 size={13} className="text-status-done" />
          )}
          <span className="text-xs text-muted-foreground">{exploredSummary}</span>
        </div>
        {expanded ? <ChevronUp size={13} className="text-muted-foreground" /> : <ChevronDown size={13} className="text-muted-foreground" />}
      </button>

      {/* Expanded steps */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-3.5 py-2 space-y-1">
              {steps.map((s, i) => {
                const Icon = stepIcons[s.icon];
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-2 py-1"
                  >
                    <div className="w-5 h-5 rounded-md bg-accent flex items-center justify-center flex-shrink-0">
                      {s.status === "running" && isActive ? (
                        <Loader2 size={11} className="text-muted-foreground animate-spin" />
                      ) : (
                        <Icon size={11} className="text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-xs text-foreground flex-1">{s.label}</span>
                    {s.status === "done" && (
                      <CheckCircle2 size={11} className="text-status-done flex-shrink-0" />
                    )}
                    {s.detail && (
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">{s.detail}</span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* "Run Everything" style collapsible label */}
            <div className="border-t border-border px-3.5 py-2">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <ChevronDown size={10} />
                Run Everything
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ChatPage = () => {
  const { integrations, toggleIntegration, agents } = usePlatform();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [activeThinkingSteps, setActiveThinkingSteps] = useState<ThinkingStep[]>([]);
  const [activeExploreSummary, setActiveExploreSummary] = useState("");
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, activeThinkingSteps]);

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

    // Generate thinking steps
    const thinkingSteps = generateThinkingSteps(content, attachedIntegrations);
    setActiveThinkingSteps([]);
    setActiveExploreSummary("");

    // Animate steps appearing one by one
    const fileCount = Math.floor(Math.random() * 8) + 3;
    const searchCount = thinkingSteps.filter((s) => s.icon === "search").length;

    thinkingSteps.forEach((s, i) => {
      setTimeout(() => {
        setActiveThinkingSteps((prev) => [...prev, s]);
        setActiveExploreSummary(
          `Explored ${fileCount} files${searchCount > 0 ? `, ${searchCount} searches` : ""}`
        );
      }, 300 + i * 500);
    });

    // Mark steps as done and produce final response
    const totalThinkingTime = 300 + thinkingSteps.length * 500 + 400;

    setTimeout(() => {
      // Mark all steps as done
      setActiveThinkingSteps((prev) => prev.map((s) => ({ ...s, status: "done" as const })));
    }, totalThinkingTime - 200);

    setTimeout(() => {
      const intNames = attachedIntegrations.map((i) => i.name).join(", ");
      const responseContent = attachedIntegrations.length > 0
        ? `✅ Connected to **${intNames}** successfully!\n\nI'll use ${attachedIntegrations.length > 1 ? "these integrations" : "this integration"} to help with your request.\n\n${content ? `Regarding "${content}" — I've analyzed the data and here are the results.` : "What would you like me to do with this integration?"}`
        : `${content}\n\nI've processed your request. Type **@** to connect integrations like Slack, WhatsApp, Gmail for enhanced capabilities.`;

      const finalExploreSummary = `Explored ${fileCount} files${searchCount > 0 ? `, ${searchCount} searches` : ""}`;
      const finalSteps = thinkingSteps.map((s) => ({ ...s, status: "done" as const }));

      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
        thinkingSteps: finalSteps,
        exploredSummary: finalExploreSummary,
      }]);
      setIsLoading(false);
      setActiveThinkingSteps([]);
      setActiveExploreSummary("");
    }, totalThinkingTime);
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
              className="mb-6 text-center"
            >
              <h1 className="text-base font-medium text-foreground">New Chat</h1>
              <p className="text-xs text-muted-foreground mt-1">Type @ to connect integrations</p>
            </motion.div>

            <ChatInput onSend={handleSend} isLoading={isLoading} integrations={integrations} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-2xl mt-8"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Agents</h2>
                <button
                  onClick={() => setShowCreate(true)}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus size={12} />
                  New
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {agents.slice(0, 6).map((agent, i) => {
                  const TriggerIcon = agent.trigger === "schedule" ? Clock : agent.trigger === "event" ? Webhook : Zap;
                  return (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      onClick={() => navigate(`/agents/${agent.id}`)}
                      className="group border border-border rounded-lg p-3 hover:border-foreground/15 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="text-xs font-medium text-foreground truncate flex-1">{agent.name}</h3>
                        <ArrowUpRight size={10} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1" />
                      </div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className={`text-[9px] px-1 py-px rounded font-medium ${statusStyles[agent.status]}`}>
                          {agent.status}
                        </span>
                        <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                          <TriggerIcon size={8} />
                          {agent.schedule || agent.trigger}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-0.5">
                          {agent.integrations.slice(0, 3).map((intId) => (
                            <div key={intId} className="w-4 h-4 rounded bg-agent-surface border border-border flex items-center justify-center">
                              <img src={getIntegrationLogo(intId)} alt={intId} className="w-2.5 h-2.5" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            </div>
                          ))}
                        </div>
                        <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                          <Activity size={8} />
                          {agent.runs}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
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
                            <span key={int.id} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-accent text-xs font-medium text-foreground">
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
                      <div className="flex-1">
                        {/* Thinking steps popup */}
                        {msg.thinkingSteps && msg.thinkingSteps.length > 0 && (
                          <ThinkingPopup
                            steps={msg.thinkingSteps}
                            exploredSummary={msg.exploredSummary || ""}
                            isActive={false}
                          />
                        )}
                        <div className="prose prose-sm max-w-none text-foreground [&_p]:text-[13px] [&_p]:leading-relaxed [&_strong]:font-semibold">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Active thinking state */}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                <div className="w-6 h-6 rounded-md bg-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-foreground text-[10px] font-bold">A</span>
                </div>
                <div className="flex-1">
                  {activeThinkingSteps.length > 0 ? (
                    <ThinkingPopup
                      steps={activeThinkingSteps}
                      exploredSummary={activeExploreSummary || "Processing..."}
                      isActive={true}
                    />
                  ) : (
                    <div className="flex items-center gap-1 pt-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }} className="w-1 h-1 rounded-full bg-muted-foreground" />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {hasMessages && (
        <div className="border-t border-border p-4">
          <ChatInput onSend={handleSend} isLoading={isLoading} integrations={integrations} />
        </div>
      )}

      <AnimatePresence>
        {showCreate && <CreateAgentModal onClose={() => setShowCreate(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default ChatPage;
