import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Pause, Clock, Webhook, Zap, Settings, Activity, FileText } from "lucide-react";
import { usePlatform } from "@/context/PlatformContext";
import { getIntegrationLogo } from "@/lib/integrationLogos";
import { useState } from "react";

const stepTypeStyles: Record<string, string> = {
  trigger: "border-status-pending bg-status-pending-bg",
  action: "border-status-process bg-status-process-bg",
  llm: "border-status-done bg-status-done-bg",
  condition: "border-border bg-accent",
};

const stepTypeLabels: Record<string, string> = {
  trigger: "Trigger",
  action: "Action",
  llm: "AI/LLM",
  condition: "Condition",
};

const AgentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agents, toggleAgentStatus, jobs } = usePlatform();
  const [tab, setTab] = useState<"workflow" | "logs" | "settings">("workflow");

  const agent = agents.find((a) => a.id === id);
  if (!agent) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p>Agent not found</p>
      </div>
    );
  }

  const agentJobs = jobs.filter((j) => j.agentId === agent.id);
  const statusStyles: Record<string, string> = {
    active: "bg-status-done-bg text-status-done",
    inactive: "bg-status-queued-bg text-status-queued",
    draft: "bg-status-pending-bg text-status-pending",
    error: "bg-status-failed-bg text-status-failed",
  };

  const jobStatusStyles: Record<string, string> = {
    "Done": "bg-status-done-bg text-status-done",
    "Pending": "bg-status-pending-bg text-status-pending",
    "Failed": "bg-status-failed-bg text-status-failed",
    "In process": "bg-status-process-bg text-status-process",
    "Queued": "bg-status-queued-bg text-status-queued",
  };

  const TriggerIcon = agent.trigger === "schedule" ? Clock : agent.trigger === "event" ? Webhook : Zap;

  return (
    <div className="flex-1 p-6 overflow-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/")}
          className="p-1.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-foreground">{agent.name}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${statusStyles[agent.status]}`}>
              {agent.status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{agent.description}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => toggleAgentStatus(agent.id)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            agent.status === "active"
              ? "bg-status-failed-bg text-status-failed hover:opacity-80"
              : "bg-status-done-bg text-status-done hover:opacity-80"
          }`}
        >
          {agent.status === "active" ? <Pause size={13} /> : <Play size={13} />}
          {agent.status === "active" ? "Deactivate" : "Activate"}
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Runs", value: agent.runs },
          { label: "Success Rate", value: `${agent.successRate}%` },
          { label: "Trigger", value: agent.schedule || agent.trigger },
          { label: "Integrations", value: agent.integrations.length },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="border border-border rounded-lg p-3"
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-lg font-semibold text-foreground mt-0.5">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border mb-4">
        {[
          { key: "workflow" as const, icon: Activity, label: "Workflow" },
          { key: "logs" as const, icon: FileText, label: "Run History" },
          { key: "settings" as const, icon: Settings, label: "Settings" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors relative ${
              tab === t.key
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content with animation */}
      <AnimatePresence mode="wait">
        {tab === "workflow" && (
          <motion.div key="workflow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-3">
            {agent.steps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3"
              >
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold ${stepTypeStyles[step.type]}`}>
                    {i + 1}
                  </div>
                  {i < agent.steps.length - 1 && <div className="w-px h-8 bg-border" />}
                </div>
                <div className="flex-1 border border-border rounded-lg p-3 bg-background hover:border-foreground/10 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-accent text-muted-foreground">
                      {stepTypeLabels[step.type]}
                    </span>
                    {step.tool && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <img src={getIntegrationLogo(step.tool)} alt={step.tool} className="w-3 h-3" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        via {step.tool}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground">{step.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === "logs" && (
          <motion.div key="logs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            {agentJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No runs yet</p>
            ) : (
              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-agent-surface">
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Status</th>
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Initiated by</th>
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Started</th>
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Finished</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentJobs.map((job, i) => (
                      <motion.tr
                        key={job.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors"
                      >
                        <td className="px-4 py-2.5">
                          <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${jobStatusStyles[job.status]}`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-foreground text-xs">{job.initiatedBy}</td>
                        <td className="px-4 py-2.5 text-muted-foreground text-xs">{job.startedAt}</td>
                        <td className="px-4 py-2.5 text-muted-foreground text-xs">{job.finishedAt}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {tab === "settings" && (
          <motion.div key="settings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-4 max-w-md">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Agent Name</label>
              <input defaultValue={agent.name} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
              <textarea defaultValue={agent.description} rows={3} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Trigger</label>
              <div className="inline-flex items-center gap-1.5 text-sm text-foreground">
                <TriggerIcon size={14} />
                {agent.schedule || agent.trigger}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Connected Integrations</label>
              <div className="flex flex-wrap gap-1.5">
                {agent.integrations.map((intId) => (
                  <span key={intId} className="inline-flex items-center gap-1.5 px-2 py-1 text-xs bg-accent rounded-md text-foreground font-medium">
                    <img src={getIntegrationLogo(intId)} alt={intId} className="w-3.5 h-3.5" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    {intId}
                  </span>
                ))}
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="px-4 py-2 text-sm font-medium bg-foreground text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
              Save Changes
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentDetailPage;
