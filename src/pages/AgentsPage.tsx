import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Bot, Clock, Zap, Webhook, MoreHorizontal, Play, Pause, Trash2, ChevronRight } from "lucide-react";
import { usePlatform } from "@/context/PlatformContext";
import CreateAgentModal from "@/components/CreateAgentModal";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  inactive: "bg-muted text-muted-foreground border-border",
  draft: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  error: "bg-destructive/10 text-destructive border-destructive/20",
};

const AgentsPage = () => {
  const { agents, toggleAgentStatus, deleteAgent } = usePlatform();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = agents.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statuses = ["all", "active", "inactive", "draft", "error"];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Agents</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{agents.length} agents configured</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-primary-foreground rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          <Plus size={16} />
          New Agent
        </motion.button>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 flex items-center gap-3 border-b border-border shrink-0">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <div className="flex gap-1">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                filterStatus === s
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Agent List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot size={48} className="text-muted-foreground/30 mb-4" />
            <p className="text-sm text-muted-foreground">No agents found</p>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-3 text-xs text-foreground underline underline-offset-2 hover:text-foreground/80"
            >
              Create your first agent
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => navigate(`/agents/${agent.id}`)}
                className="group flex items-center gap-4 p-4 border border-border rounded-xl bg-background hover:bg-accent/40 cursor-pointer transition-colors"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  {agent.trigger === "schedule" ? <Clock size={18} className="text-muted-foreground" /> :
                   agent.trigger === "event" ? <Webhook size={18} className="text-muted-foreground" /> :
                   <Zap size={18} className="text-muted-foreground" />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-foreground truncate">{agent.name}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border capitalize ${statusStyles[agent.status]}`}>
                      {agent.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{agent.description}</p>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-6 text-xs text-muted-foreground shrink-0">
                  <div className="text-right">
                    <p className="font-medium text-foreground">{agent.runs}</p>
                    <p>runs</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{agent.successRate}%</p>
                    <p>success</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleAgentStatus(agent.id); }}
                    className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    title={agent.status === "active" ? "Pause" : "Activate"}
                  >
                    {agent.status === "active" ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteAgent(agent.id); }}
                    className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                  <ChevronRight size={14} className="text-muted-foreground ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreate && <CreateAgentModal onClose={() => setShowCreate(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default AgentsPage;
