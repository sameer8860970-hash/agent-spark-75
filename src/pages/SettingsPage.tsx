import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Key, Bell, Shield, Palette, Link2, CreditCard, Download, AlertTriangle, Eye, EyeOff, Plus, Trash2, Copy, Check } from "lucide-react";
import { usePlatform } from "@/context/PlatformContext";

const tabs = [
  { key: "profile", icon: User, label: "Profile" },
  { key: "api", icon: Key, label: "API Keys" },
  { key: "integrations", icon: Link2, label: "Integrations" },
  { key: "notifications", icon: Bell, label: "Notifications" },
  { key: "security", icon: Shield, label: "Security" },
  { key: "billing", icon: CreditCard, label: "Billing" },
  { key: "appearance", icon: Palette, label: "Appearance" },
  { key: "data", icon: Download, label: "Data & Export" },
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
  });
  const [theme, setTheme] = useState("Light");

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const toggleNotif = (key: string) => {
    setNotifSettings((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const apiKeys = [
    { name: "OpenAI API Key", value: "sk-proj-abc123def456ghi789", status: "active", id: "openai" },
    { name: "Anthropic API Key", value: "sk-ant-api03-xyz987wvu654", status: "active", id: "anthropic" },
    { name: "Twilio Auth Token", value: "a1b2c3d4e5f6g7h8i9j0", status: "inactive", id: "twilio" },
    { name: "Stripe Secret Key", value: "sk_live_51abc123XYZ", status: "active", id: "stripe" },
  ];

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
          className="w-48 space-y-0.5 flex-shrink-0"
        >
          {tabs.map((t, i) => (
            <motion.button
              key={t.key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.03 }}
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
                <t.icon size={15} />
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
            className="flex-1 max-w-xl"
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
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="px-4 py-2 text-sm font-medium bg-foreground text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                  Save Profile
                </motion.button>
              </div>
            )}

            {/* API Keys */}
            {tab === "api" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">API Keys</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Manage API keys for LLM providers and external services.</p>
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
                      <p className="text-sm font-medium text-foreground">{key.name}</p>
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        {showKey[key.id] ? key.value : key.value.replace(/./g, "•").slice(0, 20)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 ml-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                        key.status === "active" ? "bg-status-done-bg text-status-done" : "bg-status-queued-bg text-status-queued"
                      }`}>{key.status}</span>
                      <button onClick={() => setShowKey((p) => ({ ...p, [key.id]: !p[key.id] }))} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-accent">
                        {showKey[key.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                      <button onClick={() => handleCopy(key.id, key.value)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-accent">
                        {copied === key.id ? <Check size={13} className="text-status-done" /> : <Copy size={13} />}
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded hover:bg-accent">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </motion.div>
                ))}
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-accent transition-colors">
                  <Plus size={14} /> Add API Key
                </motion.button>
              </div>
            )}

            {/* Integrations */}
            {tab === "integrations" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Connected Integrations</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Manage your connected apps and services.</p>
                </div>
                <div className="space-y-2">
                  {integrations.map((int, i) => (
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
                          <p className="text-[10px] text-muted-foreground">{int.category} · {int.description}</p>
                        </div>
                      </div>
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
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Notifications */}
            {tab === "notifications" && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-foreground">Notification Preferences</h2>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Alerts</p>
                  {[
                    { key: "agentFailures", label: "Agent failures", description: "Get notified when an agent run fails" },
                    { key: "runCompletions", label: "Run completions", description: "Notify on successful agent runs" },
                    { key: "securityAlerts", label: "Security alerts", description: "Critical security notifications" },
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
                      <button
                        onClick={() => toggleNotif(notif.key)}
                        className={`w-10 h-5 rounded-full transition-colors relative ${
                          notifSettings[notif.key as keyof typeof notifSettings] ? "bg-status-done" : "bg-border"
                        }`}
                      >
                        <motion.div
                          animate={{ x: notifSettings[notif.key as keyof typeof notifSettings] ? 20 : 2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-4 h-4 rounded-full bg-background shadow absolute top-0.5"
                        />
                      </button>
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
                      <button
                        onClick={() => toggleNotif(notif.key)}
                        className={`w-10 h-5 rounded-full transition-colors relative ${
                          notifSettings[notif.key as keyof typeof notifSettings] ? "bg-status-done" : "bg-border"
                        }`}
                      >
                        <motion.div
                          animate={{ x: notifSettings[notif.key as keyof typeof notifSettings] ? 20 : 2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-4 h-4 rounded-full bg-background shadow absolute top-0.5"
                        />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="space-y-1 pt-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Channels</p>
                  {[
                    { key: "emailNotifs", label: "Email notifications", description: "Receive notifications via email" },
                    { key: "slackNotifs", label: "Slack notifications", description: "Push notifications to your Slack" },
                  ].map((notif) => (
                    <div key={notif.key} className="flex items-center justify-between border border-border rounded-lg p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{notif.label}</p>
                        <p className="text-xs text-muted-foreground">{notif.description}</p>
                      </div>
                      <button
                        onClick={() => toggleNotif(notif.key)}
                        className={`w-10 h-5 rounded-full transition-colors relative ${
                          notifSettings[notif.key as keyof typeof notifSettings] ? "bg-status-done" : "bg-border"
                        }`}
                      >
                        <motion.div
                          animate={{ x: notifSettings[notif.key as keyof typeof notifSettings] ? 20 : 2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-4 h-4 rounded-full bg-background shadow absolute top-0.5"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            {tab === "security" && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-foreground">Security Settings</h2>
                <div className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-3 py-1.5 text-xs font-medium bg-foreground text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                      Enable 2FA
                    </motion.button>
                  </div>
                </div>
                <div className="border border-border rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">Active Sessions</p>
                  <p className="text-xs text-muted-foreground">Manage your active sessions across devices</p>
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
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Agent Runs</span>
                        <span className="text-foreground font-medium">1,483 / 5,000</span>
                      </div>
                      <div className="w-full h-1.5 bg-accent rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "30%" }} transition={{ delay: 0.3, duration: 0.8 }} className="h-full bg-status-process rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">API Calls</span>
                        <span className="text-foreground font-medium">12,340 / 50,000</span>
                      </div>
                      <div className="w-full h-1.5 bg-accent rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "25%" }} transition={{ delay: 0.4, duration: 0.8 }} className="h-full bg-status-done rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Storage</span>
                        <span className="text-foreground font-medium">2.1 GB / 10 GB</span>
                      </div>
                      <div className="w-full h-1.5 bg-accent rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "21%" }} transition={{ delay: 0.5, duration: 0.8 }} className="h-full bg-status-pending rounded-full" />
                      </div>
                    </div>
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
                          theme === t
                            ? "border-foreground bg-accent text-foreground"
                            : "border-border text-muted-foreground hover:bg-accent"
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
                  <p className="text-xs text-muted-foreground">Download complete job execution logs.</p>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg text-foreground hover:bg-accent transition-colors">
                    <Download size={13} /> Download Logs
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
