import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Bot, Clock, Zap, Webhook, Trash2, ChevronRight } from "lucide-react";
import { usePlatform } from "@/context/PlatformContext";
import CreateAgentModal from "@/components/CreateAgentModal";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  inactive: "bg-muted text-muted-foreground border-border",
  draft: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  error: "bg-destructive/10 text-destructive border-destructive/20",
};

/** Apple-style toggle with elastic spring animation */
const AppleToggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <motion.button
    onClick={onChange}
    className="relative w-[44px] h-[26px] rounded-full p-[2px] cursor-pointer shrink-0"
    animate={{
      backgroundColor: checked ? "hsl(142, 71%, 45%)" : "hsl(var(--muted))",
    }}
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
    whileTap={{ scale: 0.92 }}
    style={{ WebkitTapHighlightColor: "transparent" }}
  >
    <motion.div
      className="w-[22px] h-[22px] rounded-full shadow-md"
      style={{ backgroundColor: "white" }}
      animate={{
        x: checked ? 18 : 0,
        scale: 1,
      }}
      whileTap={{ width: 26 }}
      transition={{
        type: "spring",
        stiffness: 700,
        damping: 30,
        mass: 0.8,
      }}
    />
  </motion.button>
);

const AgentsPage = () => {
  const { agents, toggleAgentStatus, deleteAgent } = usePlatform();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = agents.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statuses = ["all", "active", "inactive", "draft", "error"];

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    setTimeout(() => {
      deleteAgent(id);
      setDeletingId(null);
    }, 300);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Agents</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{agents.length} agents configured</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-primary-foreground rounded-xl text-sm font-medium hover:bg-foreground/90 transition-colors"
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.span
            animate={{ rotate: showCreate ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Plus size={16} />
          </motion.span>
          New Agent
        </motion.button>
      </div>

      {/* Filters */}
      <div className="px-4 md:px-6 py-3 flex flex-wrap items-center gap-3 border-b border-border shrink-0">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <div className="flex gap-1 relative">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`relative px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors z-10 ${
                filterStatus === s
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {filterStatus === s && (
                <motion.div
                  layoutId="filterPill"
                  className="absolute inset-0 bg-accent rounded-md"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Agent List */}
      <div className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <Bot size={48} className="text-muted-foreground/30 mb-4" />
            <p className="text-sm text-muted-foreground">No agents found</p>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-3 text-xs text-foreground underline underline-offset-2 hover:text-foreground/80"
            >
              Create your first agent
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((agent, i) => (
                <motion.div
                  key={agent.id}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{
                    opacity: deletingId === agent.id ? 0 : 1,
                    y: 0,
                    scale: deletingId === agent.id ? 0.95 : 1,
                    x: deletingId === agent.id ? 60 : 0,
                  }}
                  exit={{ opacity: 0, scale: 0.95, x: 60 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                    delay: i * 0.04,
                  }}
                  onClick={() => navigate(`/agents/${agent.id}`)}
                  className="group flex items-center gap-4 p-4 border border-border rounded-xl bg-background cursor-pointer transition-colors"
                  whileHover={{
                    backgroundColor: "hsl(var(--accent) / 0.5)",
                    y: -1,
                    transition: { type: "spring", stiffness: 400, damping: 25 },
                  }}
                  whileTap={{ scale: 0.99 }}
                >
                  {/* Icon */}
                  <motion.div
                    className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0"
                    whileHover={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    {agent.trigger === "schedule" ? <Clock size={18} className="text-muted-foreground" /> :
                     agent.trigger === "event" ? <Webhook size={18} className="text-muted-foreground" /> :
                     <Zap size={18} className="text-muted-foreground" />}
                  </motion.div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-foreground truncate">{agent.name}</h3>
                      <motion.span
                        layout
                        className={`px-2 py-0.5 text-[10px] font-medium rounded-full border capitalize ${statusStyles[agent.status]}`}
                      >
                        {agent.status}
                      </motion.span>
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
                  <div className="flex items-center gap-2 shrink-0">
                    <AppleToggle
                      checked={agent.status === "active"}
                      onChange={() => {
                        toggleAgentStatus(agent.id);
                      }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      onClick={(e) => handleDelete(e, agent.id)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </motion.button>
                    <motion.div
                      className="text-muted-foreground ml-1"
                      animate={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <ChevronRight size={14} />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
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
