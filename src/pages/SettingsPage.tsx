import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Key, Bell, Shield, Palette, Link2, CreditCard, Download,
  Eye, EyeOff, Plus, Trash2, Copy, Check, Brain, FileText, Clock,
  Activity, Search, Database, Filter, ChevronRight, ArrowLeft, Upload,
  Smartphone, BatteryMedium, Globe
} from "lucide-react";
import { usePlatform } from "@/context/PlatformContext";
import ChatMarkdown from "@/components/ChatMarkdown";
import { getIntegrationLogo } from "@/lib/integrationLogos";

const settingsMenu = [
  { key: "profile", icon: User, label: "Account", description: "Name, Email, Bio", color: "bg-[hsl(210,80%,55%)]" },
  { key: "brain", icon: Brain, label: "Agent Brain", description: "Persona, Memory, Guardrails", color: "bg-[hsl(280,70%,55%)]" },
  { key: "knowledge", icon: FileText, label: "Knowledge & Files", description: "Documents, Context", color: "bg-[hsl(35,90%,55%)]" },
  { key: "connectors", icon: Link2, label: "Connectors", description: "Integrations, APIs", color: "bg-[hsl(145,65%,45%)]" },
  { key: "tasks", icon: Clock, label: "Tasks & Automations", description: "Schedules, Triggers", color: "bg-[hsl(200,80%,50%)]" },
  { key: "api", icon: Key, label: "Secrets & Keys", description: "API Keys, Tokens", color: "bg-[hsl(340,70%,55%)]" },
  { key: "security", icon: Shield, label: "Privacy & Security", description: "2FA, Sessions, Audit", color: "bg-[hsl(145,65%,45%)]" },
  { key: "notifications", icon: Bell, label: "Notifications", description: "Sounds, Alerts, Badges", color: "bg-[hsl(0,75%,55%)]" },
  { key: "observability", icon: Activity, label: "Observability", description: "Logs, Metrics", color: "bg-[hsl(160,60%,45%)]" },
  { key: "billing", icon: CreditCard, label: "Billing", description: "Plan, Usage", color: "bg-[hsl(260,60%,55%)]" },
  { key: "devices", icon: Smartphone, label: "Devices", description: "Manage connected devices", color: "bg-[hsl(210,70%,50%)]" },
  { key: "appearance", icon: Palette, label: "Appearance", description: "Theme, Layout", color: "bg-[hsl(25,85%,55%)]" },
  { key: "data", icon: Download, label: "Data & Export", description: "Backup, Export", color: "bg-[hsl(190,70%,45%)]" },
  { key: "language", icon: Globe, label: "Language", description: "English", color: "bg-[hsl(280,55%,60%)]" },
];

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { integrations, toggleIntegration, knowledgeContext, setKnowledgeContext } = usePlatform();
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [notifSettings, setNotifSettings] = useState({
    agentFailures: true, runCompletions: false, weeklyDigest: true,
    securityAlerts: true, slackNotifs: false, emailNotifs: true,
    webhookNotifs: false, budgetAlerts: true,
  });
  const [theme, setTheme] = useState("Light");
  const [connectorSearch, setConnectorSearch] = useState("");
  const [mdPreview, setMdPreview] = useState(false);

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
  ];

  const knowledgeFiles = [
    { name: "product-docs.pdf", size: "2.4 MB", uploaded: "Nov 28, 2024", type: "PDF" },
    { name: "faq-database.json", size: "156 KB", uploaded: "Nov 25, 2024", type: "JSON" },
    { name: "support-playbook.md", size: "84 KB", uploaded: "Nov 20, 2024", type: "Markdown" },
  ];

  const automations = [
    { name: "Daily Data Sync", trigger: "schedule", cron: "0 9 * * *", status: "active", lastRun: "Today 9:00 AM" },
    { name: "New Lead Alert", trigger: "event", event: "hubspot.contact.created", status: "active", lastRun: "2 hours ago" },
    { name: "Weekly Report", trigger: "schedule", cron: "0 18 * * 5", status: "active", lastRun: "Last Friday" },
  ];

  const filteredIntegrations = integrations.filter((int) =>
    int.name.toLowerCase().includes(connectorSearch.toLowerCase()) ||
    int.category.toLowerCase().includes(connectorSearch.toLowerCase())
  );
  const categories = [...new Set(filteredIntegrations.map((i) => i.category))];

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`w-10 h-5 rounded-full transition-colors relative ${checked ? "bg-status-done" : "bg-border"}`}>
      <motion.div animate={{ x: checked ? 20 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="w-4 h-4 rounded-full bg-background shadow absolute top-0.5" />
    </button>
  );

  const activeItem = settingsMenu.find(m => m.key === activeSection);

  // Main menu list view (Telegram style)
  const MenuView = () => (
    <div className="flex-1 overflow-auto">
      {/* Profile Header */}
      <div className="relative bg-gradient-to-b from-muted/80 to-background pt-8 pb-5">
        <div className="flex flex-col items-center">
          <div className="w-[88px] h-[88px] rounded-full bg-foreground/10 border-[3px] border-background shadow-md flex items-center justify-center mb-3 relative">
            <span className="text-foreground text-3xl font-semibold">T</span>
            <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center border-[2.5px] border-background shadow-sm">
              <Palette size={13} className="text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-lg font-semibold text-foreground leading-tight">Togzhan</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">+1 234 567 8900</p>
        </div>
      </div>

      {/* Settings Menu Items */}
      <div className="mt-1">
        {settingsMenu.map((item, i) => (
          <motion.button
            key={item.key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30, delay: i * 0.02 }}
            onClick={() => setActiveSection(item.key)}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center gap-3.5 pl-4 pr-3 py-[11px] hover:bg-accent/60 transition-colors active:bg-accent border-b border-border/40 last:border-b-0"
          >
            <item.icon size={20} className="text-muted-foreground flex-shrink-0" strokeWidth={1.6} />
            <div className="flex-1 text-left min-w-0">
              <p className="text-[14px] font-normal text-foreground leading-tight">{item.label}</p>
              <p className="text-[11.5px] text-muted-foreground truncate leading-tight mt-0.5">{item.description}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground/50 flex-shrink-0" />
          </motion.button>
        ))}
      </div>

      {/* Bottom spacing for mobile nav */}
      <div className="h-20 md:h-8" />
    </div>
  );

  // Detail view with back header
  const DetailView = () => (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border flex items-center gap-2 px-2 py-2.5">
        <button onClick={() => setActiveSection(null)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-accent transition-colors">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h2 className="text-[15px] font-semibold text-foreground">{activeItem?.label}</h2>
      </div>

      <div className="p-4 space-y-5">
        {activeSection === "profile" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 rounded-full bg-foreground/10 border-2 border-border flex items-center justify-center">
                <span className="text-foreground text-lg font-semibold">TA</span>
              </div>
              <div>
                <button className="text-xs font-medium text-foreground hover:opacity-70 transition-opacity underline underline-offset-2">Change Avatar</button>
                <p className="text-[10px] text-muted-foreground mt-0.5">JPG, PNG. Max 2MB</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">First Name</label>
                <input defaultValue="Togzhan" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Last Name</label>
                <input defaultValue="Agarys" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
              <input defaultValue="togzhan@example.com" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Bio</label>
              <textarea defaultValue="AI platform administrator" rows={3} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Role</label>
                <input defaultValue="Admin" disabled className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-accent text-muted-foreground" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Timezone</label>
                <select className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                  <option>UTC+6 (Almaty)</option><option>UTC+0 (London)</option><option>UTC-5 (New York)</option>
                </select>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="px-4 py-2 text-sm font-medium bg-foreground text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">Save Profile</motion.button>
          </div>
        )}

        {activeSection === "brain" && (
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2"><Brain size={14} className="text-foreground" /><p className="text-sm font-medium text-foreground">Default Persona</p></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Display Name</label>
                  <input defaultValue="AI Assistant" className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tone</label>
                  <select className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                    <option>Professional</option><option>Friendly</option><option>Concise</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">System Prompt</label>
                <textarea defaultValue="You are a helpful AI assistant." rows={3} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none font-mono text-xs" />
              </div>
            </div>
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2"><Database size={14} className="text-foreground" /><p className="text-sm font-medium text-foreground">Long-Term Memory</p></div>
              <div className="flex items-center justify-between">
                <div><p className="text-xs font-medium text-foreground">Enable Memory</p><p className="text-[10px] text-muted-foreground">Remember context across sessions</p></div>
                <Toggle checked={true} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div><p className="text-xs font-medium text-foreground">Auto-save Decisions</p><p className="text-[10px] text-muted-foreground">Store preferences automatically</p></div>
                <Toggle checked={true} onChange={() => {}} />
              </div>
            </div>
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2"><Filter size={14} className="text-foreground" /><p className="text-sm font-medium text-foreground">Guardrails</p></div>
              <div className="flex items-center justify-between">
                <div><p className="text-xs font-medium text-foreground">Content Safety</p><p className="text-[10px] text-muted-foreground">Block harmful content</p></div>
                <Toggle checked={true} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div><p className="text-xs font-medium text-foreground">PII Redaction</p><p className="text-[10px] text-muted-foreground">Auto-redact personal info</p></div>
                <Toggle checked={false} onChange={() => {}} />
              </div>
            </div>
          </div>
        )}

        {activeSection === "knowledge" && (
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium text-foreground">Knowledge Context</p>
              <div className="flex gap-2">
                <button onClick={() => setMdPreview(false)} className={`text-xs px-2.5 py-1 rounded-md transition-colors ${!mdPreview ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}>Edit</button>
                <button onClick={() => setMdPreview(true)} className={`text-xs px-2.5 py-1 rounded-md transition-colors ${mdPreview ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}>Preview</button>
              </div>
              {mdPreview ? <div className="border border-border rounded-lg p-3 text-sm"><ChatMarkdown content={knowledgeContext} /></div> : (
                <textarea value={knowledgeContext} onChange={(e) => setKnowledgeContext(e.target.value)} rows={6} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none font-mono text-xs" />
              )}
            </div>
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Uploaded Files</p>
                <button className="flex items-center gap-1 text-xs font-medium text-foreground hover:opacity-70"><Upload size={12} />Upload</button>
              </div>
              {knowledgeFiles.map((f) => (
                <div key={f.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div><p className="text-xs font-medium text-foreground">{f.name}</p><p className="text-[10px] text-muted-foreground">{f.size} · {f.uploaded}</p></div>
                  <button className="text-muted-foreground hover:text-status-failed"><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "connectors" && (
          <div className="space-y-4">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={connectorSearch} onChange={(e) => setConnectorSearch(e.target.value)} placeholder="Search connectors..." className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            {categories.map((cat) => (
              <div key={cat}>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2 px-1">{cat}</p>
                <div className="space-y-1">
                  {filteredIntegrations.filter((i) => i.category === cat).map((int) => (
                    <div key={int.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/60 transition-colors">
                      <img src={getIntegrationLogo(int.id)} alt={int.name} className="w-7 h-7 rounded-md" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground">{int.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{int.description}</p>
                      </div>
                      <Toggle checked={int.connected} onChange={() => toggleIntegration(int.id)} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === "tasks" && (
          <div className="space-y-3">
            {automations.map((a) => (
              <div key={a.name} className="border border-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-foreground">{a.name}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${a.status === "active" ? "bg-status-done-bg text-status-done" : "bg-status-pending-bg text-status-pending"}`}>{a.status}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">{a.trigger === "schedule" ? `Cron: ${a.cron}` : `Event: ${a.event}`} · Last: {a.lastRun}</p>
              </div>
            ))}
            <button className="flex items-center gap-1.5 text-xs font-medium text-foreground hover:opacity-70 mt-2"><Plus size={13} />Add Automation</button>
          </div>
        )}

        {activeSection === "api" && (
          <div className="space-y-3">
            {apiKeys.map((k) => (
              <div key={k.id} className="border border-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-foreground">{k.name}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${k.status === "active" ? "bg-status-done-bg text-status-done" : "bg-status-pending-bg text-status-pending"}`}>{k.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-[11px] text-muted-foreground flex-1 truncate">{showKey[k.id] ? k.value : "••••••••••••••••"}</code>
                  <button onClick={() => setShowKey((p) => ({ ...p, [k.id]: !p[k.id] }))} className="text-muted-foreground hover:text-foreground">{showKey[k.id] ? <EyeOff size={13} /> : <Eye size={13} />}</button>
                  <button onClick={() => handleCopy(k.id, k.value)} className="text-muted-foreground hover:text-foreground">{copied === k.id ? <Check size={13} className="text-status-done" /> : <Copy size={13} />}</button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Last used: {k.lastUsed}</p>
              </div>
            ))}
            <button className="flex items-center gap-1.5 text-xs font-medium text-foreground hover:opacity-70"><Plus size={13} />Add Key</button>
          </div>
        )}

        {activeSection === "security" && (
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
              <div className="flex items-center justify-between">
                <div><p className="text-xs text-foreground">Status</p><p className="text-[10px] text-status-done">Enabled</p></div>
                <button className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2">Reconfigure</button>
              </div>
            </div>
            <div className="border border-border rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium text-foreground">Active Sessions</p>
              {["Chrome on macOS — Current", "Safari on iPhone — 2h ago"].map((s) => (
                <div key={s} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <p className="text-xs text-foreground">{s}</p>
                  {!s.includes("Current") && <button className="text-[10px] text-status-failed hover:underline">Revoke</button>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "notifications" && (
          <div className="space-y-3">
            {[
              { key: "agentFailures", label: "Agent Failures", desc: "Alert when agent runs fail" },
              { key: "runCompletions", label: "Run Completions", desc: "Notify on successful runs" },
              { key: "weeklyDigest", label: "Weekly Digest", desc: "Summary every week" },
              { key: "securityAlerts", label: "Security Alerts", desc: "Suspicious activity alerts" },
              { key: "emailNotifs", label: "Email Notifications", desc: "Receive via email" },
              { key: "budgetAlerts", label: "Budget Alerts", desc: "Usage threshold warnings" },
            ].map((n) => (
              <div key={n.key} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <div><p className="text-xs font-medium text-foreground">{n.label}</p><p className="text-[10px] text-muted-foreground">{n.desc}</p></div>
                <Toggle checked={notifSettings[n.key as keyof typeof notifSettings]} onChange={() => toggleNotif(n.key)} />
              </div>
            ))}
          </div>
        )}

        {activeSection === "observability" && (
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium text-foreground">Logging</p>
              <div className="flex items-center justify-between">
                <div><p className="text-xs text-foreground">Verbose Logging</p><p className="text-[10px] text-muted-foreground">Log all agent actions</p></div>
                <Toggle checked={true} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div><p className="text-xs text-foreground">Performance Metrics</p><p className="text-[10px] text-muted-foreground">Track latency & throughput</p></div>
                <Toggle checked={true} onChange={() => {}} />
              </div>
            </div>
          </div>
        )}

        {activeSection === "billing" && (
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div><p className="text-sm font-medium text-foreground">Pro Plan</p><p className="text-[10px] text-muted-foreground">$49/month</p></div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-status-done-bg text-status-done">Active</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">API Calls</span><span className="text-foreground">12,450 / 50,000</span></div>
                <div className="w-full h-1.5 bg-accent rounded-full overflow-hidden"><div className="h-full bg-status-process rounded-full" style={{ width: "25%" }} /></div>
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Storage</span><span className="text-foreground">2.1 GB / 10 GB</span></div>
                <div className="w-full h-1.5 bg-accent rounded-full overflow-hidden"><div className="h-full bg-status-pending rounded-full" style={{ width: "21%" }} /></div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "devices" && (
          <div className="space-y-3">
            {[
              { name: "Chrome on macOS", status: "Current session", active: true },
              { name: "Safari on iPhone 15", status: "Last active 2h ago", active: false },
              { name: "Firefox on Windows", status: "Last active 3 days ago", active: false },
            ].map((d) => (
              <div key={d.name} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                <Smartphone size={18} className="text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground">{d.name}</p>
                  <p className="text-[10px] text-muted-foreground">{d.status}</p>
                </div>
                {!d.active && <button className="text-[10px] text-status-failed hover:underline">Remove</button>}
              </div>
            ))}
          </div>
        )}

        {activeSection === "appearance" && (
          <div className="space-y-4">
            <p className="text-xs font-medium text-muted-foreground">Theme</p>
            <div className="flex gap-2">
              {["Light", "Dark", "System"].map((t) => (
                <button key={t} onClick={() => setTheme(t)} className={`flex-1 py-2.5 text-xs font-medium rounded-lg border transition-colors ${theme === t ? "border-foreground bg-foreground text-primary-foreground" : "border-border text-muted-foreground hover:bg-accent"}`}>{t}</button>
              ))}
            </div>
          </div>
        )}

        {activeSection === "data" && (
          <div className="space-y-3">
            {[
              { label: "Export All Data", desc: "Download as JSON", icon: Download },
              { label: "Export Logs", desc: "Last 30 days CSV", icon: FileText },
            ].map((d) => (
              <button key={d.label} className="w-full flex items-center gap-3 px-4 py-3 border border-border rounded-lg hover:bg-accent/60 transition-colors text-left">
                <d.icon size={16} className="text-muted-foreground" />
                <div><p className="text-xs font-medium text-foreground">{d.label}</p><p className="text-[10px] text-muted-foreground">{d.desc}</p></div>
              </button>
            ))}
          </div>
        )}

        {activeSection === "language" && (
          <div className="space-y-1">
            {["English", "Spanish", "French", "German", "Japanese", "Korean", "Chinese", "Russian", "Arabic", "Hindi"].map((lang) => (
              <button key={lang} className={`w-full text-left px-4 py-3 text-sm rounded-lg transition-colors ${lang === "English" ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent/60"}`}>
                {lang}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom spacing for mobile nav */}
      <div className="h-20 md:h-8" />
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {activeSection ? (
          <motion.div key="detail" initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 80, opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 28 }} className="flex-1 flex flex-col overflow-hidden">
            <DetailView />
          </motion.div>
        ) : (
          <motion.div key="menu" initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -80, opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 28 }} className="flex-1 flex flex-col overflow-hidden">
            <MenuView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage;
