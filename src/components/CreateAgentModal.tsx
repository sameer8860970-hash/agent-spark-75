import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X, Clock, Webhook, Zap, Plus, Trash2 } from "lucide-react";
import { usePlatform, type Agent, type WorkflowStep } from "@/context/PlatformContext";

interface CreateAgentModalProps {
  onClose: () => void;
}

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

  const toggleIntegration = (id: string) => {
    setSelectedIntegrations((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const addStep = () => {
    setSteps((prev) => [
      ...prev,
      { id: `s${prev.length + 1}`, type: "action", label: "", config: {} },
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

  const handleCreate = () => {
    const triggerLabel =
      trigger === "schedule"
        ? `Schedule: ${schedule}`
        : trigger === "event"
        ? "On event trigger"
        : "Manual trigger";

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-background border border-border rounded-xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Create Agent</h2>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded transition-colors text-muted-foreground">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Agent Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. WhatsApp File Processor"
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this agent do?"
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Trigger Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "schedule" as const, icon: Clock, label: "Schedule" },
                    { value: "event" as const, icon: Webhook, label: "Event" },
                    { value: "manual" as const, icon: Zap, label: "Manual" },
                  ].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTrigger(t.value)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs font-medium transition-colors ${
                        trigger === t.value
                          ? "border-foreground bg-accent text-foreground"
                          : "border-border text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      <t.icon size={18} />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              {trigger === "schedule" && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Schedule</label>
                  <input
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    placeholder="e.g. Daily at 9:00 AM"
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Select Integrations</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {integrations.map((int) => (
                    <button
                      key={int.id}
                      onClick={() => toggleIntegration(int.id)}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-xs text-left transition-colors ${
                        selectedIntegrations.includes(int.id)
                          ? "border-foreground bg-accent text-foreground"
                          : "border-border text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      <span className="text-base">{int.icon}</span>
                      <span className="font-medium">{int.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Workflow Steps</label>
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                  <select
                    value={s.type}
                    onChange={(e) => updateStepType(s.id, e.target.value as WorkflowStep["type"])}
                    className="px-2 py-1.5 text-xs border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="trigger">Trigger</option>
                    <option value="action">Action</option>
                    <option value="llm">AI/LLM</option>
                    <option value="condition">Condition</option>
                  </select>
                  <input
                    value={s.label}
                    onChange={(e) => updateStepLabel(s.id, e.target.value)}
                    placeholder="Step description..."
                    className="flex-1 px-2 py-1.5 text-xs border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  {i > 0 && (
                    <button onClick={() => removeStep(s.id)} className="p-1 text-muted-foreground hover:text-destructive">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addStep}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus size={13} />
                Add step
              </button>
            </motion.div>
          )}
        </div>

        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-colors ${
                  s === step ? "bg-foreground" : "bg-border"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !name}
                className="px-4 py-1.5 text-xs font-medium bg-foreground text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleCreate}
                disabled={!name}
                className="px-4 py-1.5 text-xs font-medium bg-foreground text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                Create Agent
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateAgentModal;
