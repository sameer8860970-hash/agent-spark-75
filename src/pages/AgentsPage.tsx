import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, MoreHorizontal, Play, Pause, Trash2, Edit, Zap, Clock, Webhook } from "lucide-react";
import { usePlatform } from "@/context/PlatformContext";
import CreateAgentModal from "@/components/CreateAgentModal";

const statusStyles: Record<string, string> = {
  active: "bg-status-done-bg text-status-done",
  inactive: "bg-status-queued-bg text-status-queued",
  draft: "bg-status-pending-bg text-status-pending",
  error: "bg-status-failed-bg text-status-failed",
};

const triggerIcons: Record<string, typeof Clock> = {
  schedule: Clock,
  event: Webhook,
  manual: Zap,
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

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-foreground">Agents</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-foreground text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Create Agent
        </motion.button>
      </div>

      <div className="relative mb-4 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search agents..."
          className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((agent, index) => {
            const TriggerIcon = triggerIcons[agent.trigger] || Zap;
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="border border-border rounded-xl p-4 bg-background hover:shadow-sm transition-shadow cursor-pointer relative"
                onClick={() => navigate(`/agents/${agent.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground text-sm">{agent.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{agent.description}</p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(openMenu === agent.id ? null : agent.id);
                      }}
                      className="p-1 hover:bg-accent rounded transition-colors text-muted-foreground"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    <AnimatePresence>
                      {openMenu === agent.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-8 bg-background border border-border rounded-lg shadow-lg z-10 py-1 min-w-[140px]"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAgentStatus(agent.id);
                              setOpenMenu(null);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-accent transition-colors text-foreground"
                          >
                            {agent.status === "active" ? <Pause size={13} /> : <Play size={13} />}
                            {agent.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/agents/${agent.id}`);
                              setOpenMenu(null);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-accent transition-colors text-foreground"
                          >
                            <Edit size={13} />
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAgent(agent.id);
                              setOpenMenu(null);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-accent transition-colors text-destructive"
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${statusStyles[agent.status]}`}>
                    {agent.status}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <TriggerIcon size={11} />
                    {agent.schedule || agent.trigger}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mb-3">
                  {agent.integrations.map((intId) => {
                    const int = agents.length ? undefined : undefined; // just show icons
                    return (
                      <span key={intId} className="text-sm" title={intId}>
                        {intId === "whatsapp" ? "📱" : intId === "slack" ? "💬" : intId === "gmail" ? "✉️" : intId === "jira" ? "🔷" : intId === "hubspot" ? "🟠" : intId === "amplitude" ? "📊" : intId === "postgres" ? "🐘" : intId === "s3" ? "🪣" : "🔧"}
                      </span>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                  <span>{agent.runs} runs</span>
                  <span>{agent.successRate}% success</span>
                  {agent.lastRun && (
                    <span>Last: {agent.lastRun.toLocaleDateString()}</span>
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
