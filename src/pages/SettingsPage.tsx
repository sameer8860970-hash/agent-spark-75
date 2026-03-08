import { useState } from "react";
import { motion } from "framer-motion";
import { User, Key, Bell, Shield, Palette } from "lucide-react";

const tabs = [
  { key: "profile", icon: User, label: "Profile" },
  { key: "api", icon: Key, label: "API Keys" },
  { key: "notifications", icon: Bell, label: "Notifications" },
  { key: "security", icon: Shield, label: "Security" },
  { key: "appearance", icon: Palette, label: "Appearance" },
];

const SettingsPage = () => {
  const [tab, setTab] = useState("profile");

  return (
    <div className="flex-1 p-6 overflow-auto">
      <h1 className="text-xl font-semibold text-foreground mb-6">Settings</h1>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 space-y-0.5">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                tab === t.key
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 max-w-lg"
        >
          {tab === "profile" && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-foreground">Profile Settings</h2>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Display Name</label>
                <input
                  defaultValue="Togzhan Agarys"
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
                <input
                  defaultValue="togzhan@example.com"
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Role</label>
                <input
                  defaultValue="Admin"
                  disabled
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-accent text-muted-foreground"
                />
              </div>
              <button className="px-4 py-2 text-sm font-medium bg-foreground text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                Save Profile
              </button>
            </div>
          )}

          {tab === "api" && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-foreground">API Keys</h2>
              <p className="text-xs text-muted-foreground">Manage API keys for LLM providers and external services.</p>
              {[
                { name: "OpenAI API Key", value: "sk-...****1234", status: "active" },
                { name: "Anthropic API Key", value: "sk-ant-...****5678", status: "active" },
                { name: "Twilio Auth Token", value: "••••••••••••", status: "inactive" },
              ].map((key) => (
                <div key={key.name} className="flex items-center justify-between border border-border rounded-lg p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{key.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{key.value}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                      key.status === "active" ? "bg-status-done-bg text-status-done" : "bg-status-queued-bg text-status-queued"
                    }`}>
                      {key.status}
                    </span>
                    <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
              <button className="px-4 py-2 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-accent transition-colors">
                + Add API Key
              </button>
            </div>
          )}

          {tab === "notifications" && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-foreground">Notification Preferences</h2>
              {[
                { label: "Agent failures", description: "Get notified when an agent run fails", enabled: true },
                { label: "Run completions", description: "Notify on successful agent runs", enabled: false },
                { label: "Weekly digest", description: "Weekly summary of all agent activity", enabled: true },
                { label: "Security alerts", description: "Critical security notifications", enabled: true },
              ].map((notif) => (
                <div key={notif.label} className="flex items-center justify-between border border-border rounded-lg p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{notif.label}</p>
                    <p className="text-xs text-muted-foreground">{notif.description}</p>
                  </div>
                  <button
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      notif.enabled ? "bg-status-done" : "bg-border"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-background shadow absolute top-0.5 transition-transform ${
                        notif.enabled ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === "security" && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-foreground">Security Settings</h2>
              <div className="border border-border rounded-lg p-3 space-y-2">
                <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                <button className="px-3 py-1.5 text-xs font-medium bg-foreground text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                  Enable 2FA
                </button>
              </div>
              <div className="border border-border rounded-lg p-3 space-y-2">
                <p className="text-sm font-medium text-foreground">Active Sessions</p>
                <p className="text-xs text-muted-foreground">Manage your active sessions across devices</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground">Chrome on macOS · Current</span>
                  <span className="text-status-done">Active</span>
                </div>
              </div>
              <div className="border border-border rounded-lg p-3 space-y-2">
                <p className="text-sm font-medium text-foreground">Change Password</p>
                <button className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg text-foreground hover:bg-accent transition-colors">
                  Update Password
                </button>
              </div>
            </div>
          )}

          {tab === "appearance" && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-foreground">Appearance</h2>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Light", "Dark", "System"].map((theme) => (
                    <button
                      key={theme}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                        theme === "Light"
                          ? "border-foreground bg-accent text-foreground"
                          : "border-border text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
