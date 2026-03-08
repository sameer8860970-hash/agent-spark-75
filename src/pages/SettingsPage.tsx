import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Key, Bell, Shield, Palette, Link2, CreditCard, Download, AlertTriangle,
  Eye, EyeOff, Plus, Trash2, Copy, Check, Brain, FileText, Layers, Clock,
  Activity, Search, BarChart3, Lock, Globe, Scan, RefreshCw, Upload, Database,
  Webhook, Zap, Terminal, Filter, ChevronRight, ToggleLeft
} from "lucide-react";
import { usePlatform } from "@/context/PlatformContext";
import { getIntegrationLogo } from "@/lib/integrationLogos";

const tabs = [
  { key: "profile", icon: User, label: "Profile", color: "text-status-process" },
  { key: "brain", icon: Brain, label: "Agent Brain", color: "text-[hsl(280,70%,55%)]" },
  { key: "knowledge", icon: FileText, label: "Knowledge & Files", color: "text-status-pending" },
  { key: "connectors", icon: Link2, label: "Connectors", color: "text-status-done" },
  { key: "tasks", icon: Clock, label: "Tasks & Automations", color: "text-[hsl(200,80%,50%)]" },
  { key: "api", icon: Key, label: "Secrets & Keys", color: "text-[hsl(340,70%,55%)]" },
  { key: "security", icon: Shield, label: "Security", color: "text-status-failed" },
  { key: "observability", icon: Activity, label: "Observability", color: "text-[hsl(160,60%,45%)]" },
  { key: "notifications", icon: Bell, label: "Notifications", color: "text-[hsl(45,90%,50%)]" },
  { key: "billing", icon: CreditCard, label: "Billing", color: "text-[hsl(260,60%,55%)]" },
  { key: "appearance", icon: Palette, label: "Appearance", color: "text-[hsl(320,60%,55%)]" },
  { key: "data", icon: Download, label: "Data & Export", color: "text-[hsl(190,70%,45%)]" },
];

const SettingsPage = () => {
  const [tab, setTab] = useState("profile");
  const { integrations, toggleIntegration } = usePlatform();
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [notifSettings, setNotifSettings] = useState({
    agentFailures: true,
    runCompletions: false,
    weeklyDigest: true,
    securityAlerts: true,
    slackNotifs: false,
    emailNotifs: true,
    webhookNotifs: false,
    budgetAlerts: true,
  });
  const [theme, setTheme] = useState("Light");
  const [connectorSearch, setConnectorSearch] = useState("");

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const toggleNotif = (key: string) => {
    setNotifSettings((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const apiKeys = [
    { name: "OpenAI API Key", value: "sk-proj-abc123def456ghi789", status: "active", id: "openai", lastUsed: "2 hours ago" },
    { name: "Anthropic API Key", value: "sk-ant-api03-xyz987wvu654", status: "active", id: "anthropic", lastUsed: "5 min ago" },
    { name: "Twilio Auth Token", value: "a1b2c3d4e5f6g7h8i9j0", status: "inactive", id: "twilio", lastUsed: "3 days ago" },
    { name: "Stripe Secret Key", value: "sk_live_51abc123XYZ", status: "active", id: "stripe", lastUsed: "1 hour ago" },
    { name: "AWS Access Key", value: "AKIAIOSFODNN7EXAMPLE", status: "active", id: "aws", lastUsed: "30 min ago" },
  ];

  const knowledgeFiles = [
    { name: "product-docs.pdf", size: "2.4 MB", uploaded: "Nov 28, 2024", type: "PDF" },
    { name: "faq-database.json", size: "156 KB", uploaded: "Nov 25, 2024", type: "JSON" },
    { name: "support-playbook.md", size: "84 KB", uploaded: "Nov 20, 2024", type: "Markdown" },
    { name: "api-reference.yaml", size: "312 KB", uploaded: "Nov 15, 2024", type: "YAML" },
  ];

  const automations = [
    { name: "Daily Data Sync", trigger: "schedule", cron: "0 9 * * *", status: "active", lastRun: "Today 9:00 AM" },
    { name: "New Lead Alert", trigger: "event", event: "hubspot.contact.created", status: "active", lastRun: "2 hours ago" },
    { name: "Weekly Report", trigger: "schedule", cron: "0 18 * * 5", status: "active", lastRun: "Last Friday" },
    { name: "Error Escalation", trigger: "event", event: "agent.run.failed", status: "paused", lastRun: "3 days ago" },
  ];

  const filteredIntegrations = integrations.filter((int) =>
    int.name.toLowerCase().includes(connectorSearch.toLowerCase()) ||
    int.category.toLowerCase().includes(connectorSearch.toLowerCase())
  );

  const categories = [...new Set(filteredIntegrations.map((i) => i.category))];

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`w-10 h-5 rounded-full transition-colors relative ${checked ? "bg-status-done" : "bg-border"}`}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-4 h-4 rounded-full bg-background shadow absolute top-0.5"
      />
    </button>
  );

  return (
    <div className="flex-1 p-6 overflow-auto">
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold text-foreground mb-6"
      >
        Settings
      </motion.h1>

      <div className="flex gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="w-52 space-y-0.5 flex-shrink-0"
        >
          {tabs.map((t, i) => (
            <motion.button
              key={t.key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.02 }}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition-all relative ${
                tab === t.key
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
              }`}
            >
              {tab === t.key && (
                <motion.div
                  layoutId="settingsTab"
                  className="absolute inset-0 bg-accent rounded-lg"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <t.icon size={15} className={t.color} />
                {t.label}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex-1 max-w-2xl"
          >
            {/* Profile */}
            {tab === "profile" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-sm font-semibold text-foreground mb-4">Profile Settings</h2>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-full bg-foreground/10 border-2 border-border flex items-center justify-center">
                      <span className="text-foreground text-lg font-semibold">TA</span>
                    </div>
                    <div>
                      <button className="text-xs font-medium text-foreground hover:opacity-70 transition-opacity underline underline-offset-2">
                        Change Avatar
                      </button>
                      <p className="text-[10px] text-muted-foreground mt-0.5">JPG, PNG. Max 2MB</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">First Name</label>
                    <input defaultValue="Togzhan" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-shadow" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Last Name</label>
                    <input defaultValue="Agarys" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-shadow" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
                  <input defaultValue="togzhan@example.com" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-shadow" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Bio</label>
                  <textarea defaultValue="AI platform administrator" rows={3} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-shadow resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Role</label>
                    <input defaultValue="Admin" disabled className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-accent text-muted-foreground" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Timezone</label>
                    <select className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                      <option>UTC+6 (Almaty)</option>
                      <option>UTC+0 (London)</option>
                      <option>UTC-5 (New York)</option>
                      <option>UTC-8 (Los Angeles)</option>
                      <option>UTC+9 (Tokyo)</option>
                    </select>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="px-4 py-2 text-sm font-medium bg-foreground text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                  Save Profile
                </motion.button>
              </div>
            )}

            {/* Agent Brain */}
            {tab === "brain" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Agent Identity & Brain</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Define the default persona, personality, and memory settings for all agents.</p>
                </div>

                <div className="border border-border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain size={14} className="text-foreground" />
                    <p className="text-sm font-medium text-foreground">Default Persona</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Agent Display Name</label>
                      <input defaultValue="AI Assistant" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Personality Tone</label>
                      <select className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                        <option>Professional</option>
                        <option>Friendly</option>
                        <option>Concise</option>
                        <option>Technical</option>
                        <option>Creative</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">System Prompt</label>
                    <textarea defaultValue="You are a helpful AI assistant that processes data accurately and provides clear, actionable responses." rows={4} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none font-mono text-xs" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Response Language</label>
                    <select className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                      <option>English</option>
                      <option>Auto-detect</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Japanese</option>
                    </select>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Database size={14} className="text-foreground" />
                    <p className="text-sm font-medium text-foreground">Long-Term Memory</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-foreground">Enable Memory Persistence</p>
                      <p className="text-[10px] text-muted-foreground">Agents remember context across sessions</p>
                    </div>
                    <Toggle checked={true} onChange={() => {}} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-foreground">Auto-save Decisions</p>
                      <p className="text-[10px] text-muted-foreground">Store important decisions and preferences</p>
                    </div>
                    <Toggle checked={true} onChange={() => {}} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Memory Retention Period</label>
                    <select className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                      <option>30 days</option>
                      <option>90 days</option>
                      <option>1 year</option>
                      <option>Forever</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Memory Usage</span>
                      <span className="text-foreground font-medium">847 entries · 12.4 MB</span>
                    </div>
                    <div className="w-full h-1.5 bg-accent rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: "42%" }} transition={{ delay: 0.3, duration: 0.8 }} className="h-full bg-status-process rounded-full" />
                    </div>
                  </div>
                  <button className="text-xs text-muted-foreground hover:text-status-failed transition-colors underline underline-offset-2">
                    Clear All Memory
                  </button>
                </div>

                <div className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Filter size={14} className="text-foreground" />
                    <p className="text-sm font-medium text-foreground">Content Guardrails</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-foreground">Content Safety Filter</p>
                      <p className="text-[10px] text-muted-foreground">Block harmful or sensitive content</p>
                    </div>
                    <Toggle checked={true} onChange={() => {}} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-foreground">PII Redaction</p>
                      <p className="text-[10px] text-muted-foreground">Auto-redact personal information in logs</p>
                    </div>
                    <Toggle checked={false} onChange={() => {}} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Blocked Topics (comma-separated)</label>
                    <input defaultValue="" placeholder="e.g. politics, religion, violence" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                </div>

                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="px-4 py-2 text-sm font-medium bg-foreground text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                  Save Brain Settings
                </motion.button>
              </div>
            )}

            {/* Knowledge & Files */}
            {tab === "knowledge" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Knowledge & Files</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Upload reference documents and configure file storage for agents.</p>
                </div>

                <div className="border border-border rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">Knowledge Base</p>
                  <p className="text-xs text-muted-foreground">Upload documents the agent can reference during execution.</p>

                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-foreground/20 transition-colors cursor-pointer">
                    <Upload size={20} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-xs font-medium text-foreground">Drop files here or click to upload</p>
                    <p className="text-[10px] text-muted-foreground mt-1">PDF, TXT, MD, JSON, YAML, CSV · Max 50MB per file</p>
                  </div>

                  <div className="space-y-1.5">
                    {knowledgeFiles.map((file, i) => (
                      <motion.div
                        key={file.name}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center justify-between border border-border rounded-lg p-2.5 hover:border-foreground/10 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
                            <FileText size={14} className="text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-foreground">{file.name}</p>
                            <p className="text-[10px] text-muted-foreground">{file.type} · {file.size} · {file.uploaded}</p>
                          </div>
                        </div>
                        <button className="p-1.5 text-muted-foreground hover:text-status-failed transition-colors rounded hover:bg-accent">
                          <Trash2 size={13} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">File Storage</p>
                  <p className="text-xs text-muted-foreground">Configure where agents store working files and outputs.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Storage Provider</label>
                      <select className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                        <option>Local Storage</option>
                        <option>AWS S3</option>
                        <option>Google Drive</option>
                        <option>Azure Blob</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Max File Size</label>
                      <select className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                        <option>10 MB</option>
                        <option>50 MB</option>
                        <option>100 MB</option>
                        <option>500 MB</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-foreground">Auto-cleanup old files</p>
                      <p className="text-[10px] text-muted-foreground">Delete files older than retention period</p>
                    </div>
                    <Toggle checked={true} onChange={() => {}} />
                  </div>
                </div>

                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="px-4 py-2 text-sm font-medium bg-foreground text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                  Save Knowledge Settings
                </motion.button>
              </div>
            )}

            {/* Connectors */}
            {tab === "connectors" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Connectors & Integrations</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Enable and configure external service connections for your agents.</p>
                </div>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={connectorSearch}
                    onChange={(e) => setConnectorSearch(e.target.value)}
                    placeholder="Search connectors..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium">{integrations.filter((i) => i.connected).length}</span> connected ·
                  <span className="font-medium">{integrations.length}</span> available
                </div>

                {categories.map((category) => (
                  <div key={category}>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">{category}</p>
                    <div className="space-y-1.5">
                      {filteredIntegrations.filter((i) => i.category === category).map((int, i) => (
                        <motion.div
                          key={int.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.02 }}
                          className="flex items-center justify-between border border-border rounded-lg p-3 hover:border-foreground/10 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                              <img src={int.logo} alt={int.name} className="w-4.5 h-4.5" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{int.name}</p>
                              <p className="text-[10px] text-muted-foreground">{int.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {int.connected && (
                              <button className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                                Configure
                              </button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => toggleIntegration(int.id)}
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                int.connected
                                  ? "bg-status-done-bg text-status-done hover:bg-status-failed-bg hover:text-status-failed"
                                  : "border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                              }`}
                            >
                              {int.connected ? "Connected" : "Connect"}
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tasks & Automations */}
            {tab === "tasks" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Tasks & Automations</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Configure scheduled and event-driven workflows.</p>
                </div>

                <div className="space-y-2">
                  {automations.map((auto, i) => (
                    <motion.div
                      key={auto.name}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="border border-border rounded-lg p-3.5 hover:border-foreground/10 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {auto.trigger === "schedule" ? <Clock size={13} className="text-status-process" /> : <Webhook size={13} className="text-status-pending" />}
                          <p className="text-sm font-medium text-foreground">{auto.name}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                          auto.status === "active" ? "bg-status-done-bg text-status-done" : "bg-status-queued-bg text-status-queued"
                        }`}>{auto.status}</span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {auto.trigger === "schedule" ? (
                            <><Terminal size={10} /> <code className="bg-accent px-1 py-0.5 rounded font-mono">{auto.cron}</code></>
                          ) : (
                            <><Zap size={10} /> {auto.event}</>
                          )}
                        </span>
                        <span>Last: {auto.lastRun}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="border border-border rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">Default Runtime Settings</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Default Timeout (s)</label>
                      <input defaultValue="300" type="number" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Max Concurrent Runs</label>
                      <input defaultValue="5" type="number" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Default Retry Count</label>
                      <select className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                        <option>3 retries</option>
                        <option>1 retry</option>
                        <option>5 retries</option>
                        <option>No retry</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Rate Limit (req/min)</label>
                      <input defaultValue="60" type="number" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                    </div>
                  </div>
                </div>

                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-accent transition-colors">
                  <Plus size={14} /> New Automation
                </motion.button>
              </div>
            )}

            {/* Secrets & Keys */}
            {tab === "api" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Secrets & API Keys</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Manage API credentials for LLM providers and external services. Secrets are encrypted at rest.</p>
                </div>
                <div className="border border-status-process/20 rounded-lg p-3 bg-status-process-bg/30">
                  <div className="flex items-center gap-2">
                    <Lock size={13} className="text-status-process" />
                    <p className="text-xs text-foreground font-medium">Secrets are encrypted and only accessible to the agent runtime.</p>
                  </div>
                </div>
                {apiKeys.map((key, i) => (
                  <motion.div
                    key={key.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between border border-border rounded-lg p-3 hover:border-foreground/10 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{key.name}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                          key.status === "active" ? "bg-status-done-bg text-status-done" : "bg-status-queued-bg text-status-queued"
                        }`}>{key.status}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-muted-foreground font-mono truncate">
                          {showKey[key.id] ? key.value : key.value.replace(/./g, "•").slice(0, 20)}
                        </p>
                        <span className="text-[10px] text-muted-foreground">Last used: {key.lastUsed}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 ml-3">
                      <button onClick={() => setShowKey((p) => ({ ...p, [key.id]: !p[key.id] }))} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-accent">
                        {showKey[key.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                      <button onClick={() => handleCopy(key.id, key.value)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-accent">
                        {copied === key.id ? <Check size={13} className="text-status-done" /> : <Copy size={13} />}
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-accent">
                        <RefreshCw size={13} />
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded hover:bg-accent">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </motion.div>
                ))}
                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-accent transition-colors">
                    <Plus size={14} /> Add Secret
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-border rounded-lg text-muted-foreground hover:bg-accent transition-colors">
                    <Upload size={14} /> Import .env
                  </motion.button>
                </div>
              </div>
            )}

            {/* Security */}
            {tab === "security" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Security & Access Control</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Manage authentication, RBAC, and security policies.</p>
                </div>

                <div className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="text-foreground" />
                    <p className="text-sm font-medium text-foreground">Authentication</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-foreground">Two-Factor Authentication</p>
                      <p className="text-[10px] text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-3 py-1.5 text-xs font-medium bg-foreground text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                      Enable 2FA
                    </motion.button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-foreground">SSO / SAML</p>
                      <p className="text-[10px] text-muted-foreground">Enterprise single sign-on</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-status-queued-bg text-status-queued">Enterprise</span>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Layers size={14} className="text-foreground" />
                    <p className="text-sm font-medium text-foreground">Role-Based Access Control</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Define permissions for team members.</p>
                  {[
                    { role: "Admin", perms: "Full access", users: 1 },
                    { role: "Editor", perms: "Create & edit agents, view secrets", users: 3 },
                    { role: "Viewer", perms: "View agents & logs only", users: 5 },
                    { role: "Agent Runtime", perms: "Execute workflows, access secrets", users: 0 },
                  ].map((r) => (
                    <div key={r.role} className="flex items-center justify-between text-xs border border-border rounded-lg p-2.5">
                      <div className="flex items-center gap-3">
                        <span className="text-foreground font-medium w-24">{r.role}</span>
                        <span className="text-muted-foreground">{r.perms}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{r.users} {r.users === 1 ? "user" : "users"}</span>
                        <ChevronRight size={12} className="text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border border-border rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">Active Sessions</p>
                  {[
                    { device: "Chrome on macOS", location: "Almaty, KZ", current: true },
                    { device: "Safari on iPhone", location: "Almaty, KZ", current: false },
                  ].map((session) => (
                    <div key={session.device} className="flex items-center justify-between text-xs border border-border rounded-lg p-2.5">
                      <div>
                        <span className="text-foreground font-medium">{session.device}</span>
                        <span className="text-muted-foreground ml-2">{session.location}</span>
                      </div>
                      {session.current ? (
                        <span className="text-status-done text-[10px] font-medium">Current</span>
                      ) : (
                        <button className="text-[10px] text-muted-foreground hover:text-status-failed transition-colors">Revoke</button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Scan size={14} className="text-foreground" />
                    <p className="text-sm font-medium text-foreground">Security Scanning</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Run vulnerability scans on agent configurations and credentials.</p>
                  <div className="flex items-center justify-between border border-border rounded-lg p-2.5">
                    <div>
                      <p className="text-xs font-medium text-foreground">Last scan: Nov 28, 2024</p>
                      <p className="text-[10px] text-muted-foreground">0 critical · 2 warnings · 5 info</p>
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-border rounded-lg text-foreground hover:bg-accent transition-colors">
                      <Scan size={12} /> Run Scan
                    </motion.button>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">Change Password</p>
                  <div className="space-y-2">
                    <input type="password" placeholder="Current password" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                    <input type="password" placeholder="New password" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                    <input type="password" placeholder="Confirm new password" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg text-foreground hover:bg-accent transition-colors">
                    Update Password
                  </motion.button>
                </div>
              </div>
            )}

            {/* Observability */}
            {tab === "observability" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Observability & Monitoring</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Configure logging, metrics, alerts, and audit trails.</p>
                </div>

                <div className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-foreground" />
                    <p className="text-sm font-medium text-foreground">Execution Logging</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Default Log Level</label>
                    <div className="flex gap-1.5">
                      {["debug", "info", "warn", "error"].map((level) => (
                        <button key={level} className="px-2.5 py-1.5 text-[10px] font-medium rounded-md transition-colors capitalize text-muted-foreground hover:bg-accent border border-border">
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-foreground">Trace Spans</p>
                      <p className="text-[10px] text-muted-foreground">Record step-by-step execution traces</p>
                    </div>
                    <Toggle checked={true} onChange={() => {}} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-foreground">Log API Payloads</p>
                      <p className="text-[10px] text-muted-foreground">Capture request/response bodies (warning: may contain sensitive data)</p>
                    </div>
                    <Toggle checked={false} onChange={() => {}} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Log Retention</label>
                    <select className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                      <option>7 days</option>
                      <option>30 days</option>
                      <option>90 days</option>
                      <option>1 year</option>
                    </select>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={14} className="text-foreground" />
                    <p className="text-sm font-medium text-foreground">Metrics Dashboard</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Avg Latency", value: "2.3s", trend: "↓ 12%" },
                      { label: "Error Rate", value: "1.8%", trend: "↓ 5%" },
                      { label: "Success Rate", value: "98.2%", trend: "↑ 2%" },
                    ].map((m) => (
                      <div key={m.label} className="border border-border rounded-lg p-2.5 text-center">
                        <p className="text-[10px] text-muted-foreground">{m.label}</p>
                        <p className="text-sm font-semibold text-foreground">{m.value}</p>
                        <p className="text-[10px] text-status-done">{m.trend}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Bell size={14} className="text-foreground" />
                    <p className="text-sm font-medium text-foreground">Alert Thresholds</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Error rate exceeds", value: "5%", channel: "Email + Slack" },
                      { label: "Latency exceeds", value: "10s", channel: "Slack" },
                      { label: "Budget exceeds", value: "$50/day", channel: "Email" },
                    ].map((alert) => (
                      <div key={alert.label} className="flex items-center justify-between text-xs border border-border rounded-lg p-2.5">
                        <span className="text-foreground">{alert.label} <code className="bg-accent px-1 py-0.5 rounded font-mono text-[10px]">{alert.value}</code></span>
                        <span className="text-muted-foreground">{alert.channel}</span>
                      </div>
                    ))}
                  </div>
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Plus size={12} /> Add Alert Rule
                  </motion.button>
                </div>

                <div className="border border-border rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">Audit Trail</p>
                  <p className="text-xs text-muted-foreground">Recent configuration changes and credential access.</p>
                  {[
                    { action: "API key rotated", user: "Togzhan", time: "2 hours ago", type: "security" },
                    { action: "Agent 'Lead Bot' updated", user: "Jane", time: "5 hours ago", type: "config" },
                    { action: "New connector enabled: Stripe", user: "Togzhan", time: "1 day ago", type: "integration" },
                    { action: "Security scan completed", user: "System", time: "2 days ago", type: "security" },
                  ].map((entry, i) => (
                    <div key={i} className="flex items-center justify-between text-xs border border-border rounded-lg p-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          entry.type === "security" ? "bg-status-pending" : entry.type === "config" ? "bg-status-process" : "bg-status-done"
                        }`} />
                        <span className="text-foreground">{entry.action}</span>
                      </div>
                      <span className="text-muted-foreground">{entry.user} · {entry.time}</span>
                    </div>
                  ))}
                </div>

                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="px-4 py-2 text-sm font-medium bg-foreground text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                  Save Monitoring Settings
                </motion.button>
              </div>
            )}

            {/* Notifications */}
            {tab === "notifications" && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-foreground">Notification Preferences</h2>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Agent Alerts</p>
                  {[
                    { key: "agentFailures", label: "Agent failures", description: "Get notified when an agent run fails" },
                    { key: "runCompletions", label: "Run completions", description: "Notify on successful agent runs" },
                    { key: "securityAlerts", label: "Security alerts", description: "Critical security notifications" },
                    { key: "budgetAlerts", label: "Budget alerts", description: "Notify when spending exceeds threshold" },
                  ].map((notif, i) => (
                    <motion.div
                      key={notif.key}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center justify-between border border-border rounded-lg p-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{notif.label}</p>
                        <p className="text-xs text-muted-foreground">{notif.description}</p>
                      </div>
                      <Toggle checked={notifSettings[notif.key as keyof typeof notifSettings]} onChange={() => toggleNotif(notif.key)} />
                    </motion.div>
                  ))}
                </div>
                <div className="space-y-1 pt-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Digests</p>
                  {[
                    { key: "weeklyDigest", label: "Weekly digest", description: "Weekly summary of all agent activity" },
                  ].map((notif) => (
                    <div key={notif.key} className="flex items-center justify-between border border-border rounded-lg p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{notif.label}</p>
                        <p className="text-xs text-muted-foreground">{notif.description}</p>
                      </div>
                      <Toggle checked={notifSettings[notif.key as keyof typeof notifSettings]} onChange={() => toggleNotif(notif.key)} />
                    </div>
                  ))}
                </div>
                <div className="space-y-1 pt-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Channels</p>
                  {[
                    { key: "emailNotifs", label: "Email notifications", description: "Receive notifications via email" },
                    { key: "slackNotifs", label: "Slack notifications", description: "Push notifications to your Slack" },
                    { key: "webhookNotifs", label: "Webhook notifications", description: "Forward events to a custom webhook URL" },
                  ].map((notif) => (
                    <div key={notif.key} className="flex items-center justify-between border border-border rounded-lg p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{notif.label}</p>
                        <p className="text-xs text-muted-foreground">{notif.description}</p>
                      </div>
                      <Toggle checked={notifSettings[notif.key as keyof typeof notifSettings]} onChange={() => toggleNotif(notif.key)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Billing */}
            {tab === "billing" && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-foreground">Billing & Usage</h2>
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">Pro Plan</p>
                      <p className="text-xs text-muted-foreground">$49/month · Renews Mar 15, 2026</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-status-done-bg text-status-done">Active</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Agent Runs", used: "1,483", total: "5,000", pct: "30%", color: "bg-status-process" },
                      { label: "API Calls", used: "12,340", total: "50,000", pct: "25%", color: "bg-status-done" },
                      { label: "Storage", used: "2.1 GB", total: "10 GB", pct: "21%", color: "bg-status-pending" },
                      { label: "LLM Tokens", used: "890K", total: "5M", pct: "18%", color: "bg-agent-accent" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="text-foreground font-medium">{item.used} / {item.total}</span>
                        </div>
                        <div className="w-full h-1.5 bg-accent rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: item.pct }} transition={{ delay: 0.3, duration: 0.8 }} className={`h-full ${item.color} rounded-full`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="px-4 py-2 text-sm font-medium bg-foreground text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                    Upgrade Plan
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="px-4 py-2 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-accent transition-colors">
                    View Invoices
                  </motion.button>
                </div>
              </div>
            )}

            {/* Appearance */}
            {tab === "appearance" && (
              <div className="space-y-5">
                <h2 className="text-sm font-semibold text-foreground">Appearance</h2>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Light", "Dark", "System"].map((t) => (
                      <motion.button
                        key={t}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setTheme(t)}
                        className={`px-3 py-3 text-xs font-medium rounded-lg border transition-all relative ${
                          theme === t ? "border-foreground bg-accent text-foreground" : "border-border text-muted-foreground hover:bg-accent"
                        }`}
                      >
                        {theme === t && (
                          <motion.div layoutId="themeIndicator" className="absolute inset-0 border-2 border-foreground rounded-lg" transition={{ type: "spring", stiffness: 500, damping: 35 }} />
                        )}
                        <span className="relative z-10">{t}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Font Size</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Small", "Medium", "Large"].map((size) => (
                      <button key={size} className="px-3 py-2 text-xs font-medium rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Sidebar Position</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Left", "Right"].map((pos) => (
                      <button key={pos} className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                        pos === "Left" ? "border-foreground bg-accent text-foreground" : "border-border text-muted-foreground hover:bg-accent"
                      }`}>
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Data & Export */}
            {tab === "data" && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-foreground">Data & Export</h2>
                <div className="border border-border rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">Export Agent Data</p>
                  <p className="text-xs text-muted-foreground">Download all agent configurations, workflows, and run history.</p>
                  <div className="flex gap-2">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg text-foreground hover:bg-accent transition-colors">
                      <Download size={13} /> Export JSON
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg text-foreground hover:bg-accent transition-colors">
                      <Download size={13} /> Export CSV
                    </motion.button>
                  </div>
                </div>
                <div className="border border-border rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">Export Job Logs</p>
                  <p className="text-xs text-muted-foreground">Download complete job execution logs with trace data.</p>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg text-foreground hover:bg-accent transition-colors">
                    <Download size={13} /> Download Logs
                  </motion.button>
                </div>
                <div className="border border-border rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">Import Configuration</p>
                  <p className="text-xs text-muted-foreground">Import agent configurations from JSON backup.</p>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg text-foreground hover:bg-accent transition-colors">
                    <Upload size={13} /> Import Config
                  </motion.button>
                </div>
                <div className="border border-status-failed/20 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-status-failed" />
                    <p className="text-sm font-medium text-status-failed">Danger Zone</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-3 py-1.5 text-xs font-medium bg-status-failed text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                    Delete Account
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SettingsPage;
