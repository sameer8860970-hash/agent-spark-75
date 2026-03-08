import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Webhook, Zap, Plus, Trash2, GripVertical, Sparkles, RotateCcw, FileOutput, TestTube } from "lucide-react";
import { usePlatform, type Agent, type WorkflowStep } from "@/context/PlatformContext";

interface CreateAgentModalProps {
  onClose: () => void;
}

const stepVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.05 } }),
};

const CreateAgentModal = ({ onClose }: CreateAgentModalProps) => {
  const { addAgent, integrations } = usePlatform();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [trigger, setTrigger] = useState<"schedule" | "event" | "manual">("schedule");
  const [schedule, setSchedule] = useState("Daily at 9:00 AM");
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [steps, setSteps] = useState<WorkflowStep[]>([
    { id: "s1", type: "trigger", label: "", config: {} },
  ]);
  // New fields
  const [model, setModel] = useState("gpt-4o");
  const [retryCount, setRetryCount] = useState("3");
  const [retryDelay, setRetryDelay] = useState("30");
  const [outputFormat, setOutputFormat] = useState("json");
  const [timeout, setTimeout_] = useState("300");
  const [logLevel, setLogLevel] = useState("info");
  const [intSearch, setIntSearch] = useState("");

  const toggleIntegration = (id: string) => {
    setSelectedIntegrations((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const addStepItem = () => {
    setSteps((prev) => [
      ...prev,
      { id: `s${Date.now()}`, type: "action", label: "", config: {} },
    ]);
  };

  const removeStep = (id: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStepLabel = (id: string, label: string) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, label } : s)));
  };

  const updateStepType = (id: string, type: WorkflowStep["type"]) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, type } : s)));
  };

  const filteredIntegrations = integrations.filter((int) =>
    int.name.toLowerCase().includes(intSearch.toLowerCase()) ||
    int.category.toLowerCase().includes(intSearch.toLowerCase())
  );

  const handleCreate = () => {
    const triggerLabel =
      trigger === "schedule" ? `Schedule: ${schedule}` : trigger === "event" ? "On event trigger" : "Manual trigger";

    const finalSteps: WorkflowStep[] = [
      { ...steps[0], type: "trigger", label: triggerLabel },
      ...steps.slice(1),
    ];

    const agent: Agent = {
      id: `agent-${Date.now()}`,
      name,
      description,
      status: "draft",
      trigger,
      schedule: trigger === "schedule" ? schedule : undefined,
      steps: finalSteps,
      integrations: selectedIntegrations,
      createdAt: new Date(),
      runs: 0,
      successRate: 0,
    };

    addAgent(agent);
    navigate(`/agents/${agent.id}`);
    onClose();
  };

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const stepTypeColors: Record<string, string> = {
    trigger: "bg-status-pending-bg text-status-pending border-status-pending/30",
    action: "bg-status-process-bg text-status-process border-status-process/30",
    llm: "bg-status-done-bg text-status-done border-status-done/30",
    condition: "bg-accent text-muted-foreground border-border",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="bg-background border border-border rounded-xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="font-semibold text-foreground text-sm">Create Agent</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Step {step} of {totalSteps} — {["Details", "Integrations", "Workflow", "Configuration"][step - 1]}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground">
            <X size={16} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-accent">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full bg-foreground"
          />
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {/* Step 1: Details */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Agent Name *</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. WhatsApp File Processor"
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What does this agent do?"
                    rows={3}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none transition-shadow"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Trigger Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "schedule" as const, icon: Clock, label: "Schedule", desc: "Run on a cron" },
                      { value: "event" as const, icon: Webhook, label: "Event", desc: "Webhook trigger" },
                      { value: "manual" as const, icon: Zap, label: "Manual", desc: "Run on demand" },
                    ].map((t) => (
                      <motion.button
                        key={t.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setTrigger(t.value)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-xs font-medium transition-all ${
                          trigger === t.value
                            ? "border-foreground bg-accent text-foreground shadow-sm"
                            : "border-border text-muted-foreground hover:bg-accent/60"
                        }`}
                      >
                        <t.icon size={18} />
                        {t.label}
                        <span className="text-[9px] font-normal text-muted-foreground">{t.desc}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
                <AnimatePresence>
                  {trigger === "schedule" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Schedule</label>
                      <input
                        value={schedule}
                        onChange={(e) => setSchedule(e.target.value)}
                        placeholder="e.g. Daily at 9:00 AM"
                        className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Step 2: Integrations */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Select Integrations</label>
                  <input
                    value={intSearch}
                    onChange={(e) => setIntSearch(e.target.value)}
                    placeholder="Search integrations..."
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow mb-2"
                  />
                </div>
                {selectedIntegrations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pb-1">
                    {selectedIntegrations.map((id) => {
                      const int = integrations.find((i) => i.id === id);
                      return int ? (
                        <motion.span
                          key={id}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent text-xs font-medium text-foreground"
                        >
                          <img src={int.logo} alt={int.name} className="w-3 h-3" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          {int.name}
                          <button onClick={() => toggleIntegration(id)} className="ml-0.5 text-muted-foreground hover:text-foreground">
                            <X size={10} />
                          </button>
                        </motion.span>
                      ) : null;
                    })}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-1">
                  {filteredIntegrations.map((int, i) => (
                    <motion.button
                      key={int.id}
                      custom={i}
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      onClick={() => toggleIntegration(int.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs text-left transition-all ${
                        selectedIntegrations.includes(int.id)
                          ? "border-foreground/30 bg-accent text-foreground shadow-sm"
                          : "border-border text-muted-foreground hover:bg-accent/60"
                      }`}
                    >
                      <img src={int.logo} alt={int.name} className="w-4 h-4 flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      <div className="min-w-0">
                        <span className="font-medium block truncate">{int.name}</span>
                        <span className="text-[9px] text-muted-foreground">{int.category}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Workflow */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-3">
                <label className="text-xs font-medium text-muted-foreground block">Workflow Steps</label>
                <div className="space-y-2">
                  {steps.map((s, i) => (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2 group"
                    >
                      <div className="flex flex-col items-center pt-2">
                        <GripVertical size={12} className="text-muted-foreground/40 mb-1 cursor-grab" />
                        <div className={`w-6 h-6 rounded-md border flex items-center justify-center text-[10px] font-bold ${stepTypeColors[s.type]}`}>
                          {i + 1}
                        </div>
                        {i < steps.length - 1 && <div className="w-px h-4 bg-border mt-1" />}
                      </div>
                      <div className="flex-1 border border-border rounded-lg p-2.5 hover:border-foreground/10 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <select
                            value={s.type}
                            onChange={(e) => updateStepType(s.id, e.target.value as WorkflowStep["type"])}
                            className="px-2 py-1 text-[10px] border border-border rounded-md bg-background text-foreground font-medium focus:outline-none"
                          >
                            <option value="trigger">⏰ Trigger</option>
                            <option value="action">⚡ Action</option>
                            <option value="llm">🧠 AI/LLM</option>
                            <option value="condition">🔀 Condition</option>
                          </select>
                          {i > 0 && (
                            <button onClick={() => removeStep(s.id)} className="ml-auto p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                        <input
                          value={s.label}
                          onChange={(e) => updateStepLabel(s.id, e.target.value)}
                          placeholder={s.type === "trigger" ? "When this happens..." : s.type === "llm" ? "AI instruction..." : s.type === "condition" ? "If condition..." : "Do this action..."}
                          className="w-full px-2 py-1.5 text-xs border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring/50"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addStepItem}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-accent"
                >
                  <Plus size={13} />
                  Add step
                </motion.button>
              </motion.div>
            )}

            {/* Step 4: Configuration */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-3">
                    <Sparkles size={13} /> AI Model
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "gpt-4o", label: "GPT-4o", desc: "Fast & smart" },
                      { value: "claude-3.5", label: "Claude 3.5", desc: "Best reasoning" },
                      { value: "gpt-4-turbo", label: "GPT-4 Turbo", desc: "High throughput" },
                    ].map((m) => (
                      <motion.button
                        key={m.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setModel(m.value)}
                        className={`flex flex-col items-center gap-0.5 p-2.5 rounded-lg border text-xs transition-all ${
                          model === m.value
                            ? "border-foreground bg-accent text-foreground shadow-sm"
                            : "border-border text-muted-foreground hover:bg-accent/60"
                        }`}
                      >
                        <span className="font-medium">{m.label}</span>
                        <span className="text-[9px] text-muted-foreground">{m.desc}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1 block">
                      <RotateCcw size={11} /> Max Retries
                    </label>
                    <select
                      value={retryCount}
                      onChange={(e) => setRetryCount(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      {["0", "1", "2", "3", "5"].map((v) => (
                        <option key={v} value={v}>{v} {v === "1" ? "retry" : "retries"}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Retry Delay (s)</label>
                    <input
                      value={retryDelay}
                      onChange={(e) => setRetryDelay(e.target.value)}
                      type="number"
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1 block">
                      <FileOutput size={11} /> Output Format
                    </label>
                    <select
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="json">JSON</option>
                      <option value="text">Plain Text</option>
                      <option value="markdown">Markdown</option>
                      <option value="csv">CSV</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Timeout (s)</label>
                    <input
                      value={timeout}
                      onChange={(e) => setTimeout_(e.target.value)}
                      type="number"
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Log Level</label>
                  <div className="flex gap-1.5">
                    {["debug", "info", "warn", "error"].map((level) => (
                      <button
                        key={level}
                        onClick={() => setLogLevel(level)}
                        className={`px-2.5 py-1.5 text-[10px] font-medium rounded-md transition-colors capitalize ${
                          logLevel === level
                            ? "bg-foreground text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent border border-border"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="border border-border rounded-lg p-3 bg-accent/50 space-y-1.5">
                  <p className="text-xs font-semibold text-foreground">Summary</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="text-foreground font-medium truncate">{name || "—"}</span>
                    <span className="text-muted-foreground">Trigger:</span>
                    <span className="text-foreground font-medium">{trigger} {trigger === "schedule" ? `(${schedule})` : ""}</span>
                    <span className="text-muted-foreground">Integrations:</span>
                    <span className="text-foreground font-medium">{selectedIntegrations.length || "None"}</span>
                    <span className="text-muted-foreground">Steps:</span>
                    <span className="text-foreground font-medium">{steps.length}</span>
                    <span className="text-muted-foreground">Model:</span>
                    <span className="text-foreground font-medium">{model}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
              <motion.div
                key={s}
                animate={{ scale: s === step ? 1.3 : 1, backgroundColor: s <= step ? "hsl(var(--foreground))" : "hsl(var(--border))" }}
                className="w-1.5 h-1.5 rounded-full"
              />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 1 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(step - 1)}
                className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Back
              </motion.button>
            )}
            {step < totalSteps ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !name}
                className="px-4 py-1.5 text-xs font-medium bg-foreground text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                Next
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreate}
                disabled={!name}
                className="px-4 py-1.5 text-xs font-medium bg-foreground text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                Create Agent
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateAgentModal;
