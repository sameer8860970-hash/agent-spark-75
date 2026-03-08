import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, MoreHorizontal, Play, Pause, Trash2, Edit, Clock, Webhook, Zap, Activity, ArrowUpRight } from "lucide-react";
import { usePlatform } from "@/context/PlatformContext";
import CreateAgentModal from "@/components/CreateAgentModal";

const statusStyles: Record<string, string> = {
  active: "bg-status-done-bg text-status-done",
  inactive: "bg-status-queued-bg text-status-queued",
  draft: "bg-status-pending-bg text-status-pending",
  error: "bg-status-failed-bg text-status-failed",
};

const AgentsPage = () => {
  const { agents, toggleAgentStatus, deleteAgent } = usePlatform();
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  const filtered = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = agents.filter((a) => a.status === "active").length;
  const totalRuns = agents.reduce((sum, a) => sum + a.runs, 0);

  return (
    <div className="flex-1 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Agents</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {activeCount} active · {agents.length} total · {totalRuns.toLocaleString()} runs
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-foreground text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={14} />
          New Agent
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search agents..."
          className="w-full pl-8 pr-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        <AnimatePresence>
          {filtered.map((agent, index) => {
            const TriggerIcon = agent.trigger === "schedule" ? Clock : agent.trigger === "event" ? Webhook : Zap;
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => navigate(`/agents/${agent.id}`)}
                className="group border border-border rounded-xl p-4 bg-background hover:border-foreground/15 transition-all cursor-pointer relative"
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-medium text-foreground text-sm truncate">{agent.name}</h3>
                      <ArrowUpRight size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{agent.description}</p>
                  </div>
                  <div className="relative ml-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(openMenu === agent.id ? null : agent.id);
                      }}
                      className="p-1 hover:bg-accent rounded transition-colors text-muted-foreground opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                    <AnimatePresence>
                      {openMenu === agent.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-7 bg-background border border-border rounded-lg shadow-lg z-10 py-1 min-w-[120px]"
                        >
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleAgentStatus(agent.id); setOpenMenu(null); }}
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-accent transition-colors text-foreground"
                          >
                            {agent.status === "active" ? <Pause size={12} /> : <Play size={12} />}
                            {agent.status === "active" ? "Pause" : "Start"}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/agents/${agent.id}`); setOpenMenu(null); }}
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-accent transition-colors text-foreground"
                          >
                            <Edit size={12} /> Edit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteAgent(agent.id); setOpenMenu(null); }}
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-accent transition-colors text-destructive"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Status + trigger */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusStyles[agent.status]}`}>
                    {agent.status}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    <TriggerIcon size={10} />
                    {agent.schedule || agent.trigger}
                  </span>
                </div>

                {/* Integration logos */}
                <div className="flex items-center gap-1 mb-3">
                  {agent.integrations.slice(0, 5).map((intId) => {
                    const logos: Record<string, string> = {
                      whatsapp: "https://cdn.simpleicons.org/whatsapp",
                      slack: "https://cdn.simpleicons.org/slack",
                      gmail: "https://cdn.simpleicons.org/gmail",
                      jira: "https://cdn.simpleicons.org/jira",
                      hubspot: "https://cdn.simpleicons.org/hubspot",
                      amplitude: "https://cdn.simpleicons.org/amplitude",
                      postgres: "https://cdn.simpleicons.org/postgresql",
                      s3: "https://cdn.simpleicons.org/amazons3",
                    };
                    return (
                      <div key={intId} className="w-5 h-5 rounded bg-agent-surface border border-border flex items-center justify-center" title={intId}>
                        <img src={logos[intId] || `https://cdn.simpleicons.org/${intId}`} alt={intId} className="w-3 h-3" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                    );
                  })}
                </div>

                {/* Stats footer */}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2.5 border-t border-border">
                  <span className="flex items-center gap-1">
                    <Activity size={10} />
                    {agent.runs} runs
                  </span>
                  <span>{agent.successRate}% success</span>
                  {agent.lastRun && (
                    <span>{agent.lastRun.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showCreate && <CreateAgentModal onClose={() => setShowCreate(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default AgentsPage;
