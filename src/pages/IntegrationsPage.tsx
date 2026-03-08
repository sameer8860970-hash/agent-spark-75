import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Check, ExternalLink } from "lucide-react";
import { usePlatform } from "@/context/PlatformContext";
import { useNavigate } from "react-router-dom";
import ConnectionCard from "@/components/ConnectionCard";
import type { Integration } from "@/context/PlatformContext";

const IntegrationsPage = () => {
  const { integrations, toggleIntegration } = usePlatform();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [connectingIntegration, setConnectingIntegration] = useState<Integration | null>(null);

  const categories = ["All", ...Array.from(new Set(integrations.map((i) => i.category)))];
  const filtered = integrations.filter(
    (i) =>
      (selectedCategory === "All" || i.category === selectedCategory) &&
      i.name.toLowerCase().includes(search.toLowerCase())
  );

  const connectedCount = integrations.filter((i) => i.connected).length;

  const handleConnect = (integration: Integration) => {
    toggleIntegration(integration.id);
    if (!integration.connected) {
      setConnectingIntegration({ ...integration, connected: true });
    }
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Integrations</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {connectedCount} connected · {integrations.length} available
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search integrations..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-foreground text-primary-foreground"
                  : "bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence>
          {filtered.map((integration, index) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="border border-border rounded-xl p-4 bg-background hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    className="w-10 h-10 rounded-xl border border-border bg-agent-surface flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={integration.logo}
                      alt={integration.name}
                      className="w-5 h-5"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-xl">${integration.icon}</span>`;
                      }}
                    />
                  </motion.div>
                  <div>
                    <h3 className="font-medium text-foreground text-sm">{integration.name}</h3>
                    <p className="text-xs text-muted-foreground">{integration.category}</p>
                  </div>
                </div>
                {integration.connected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-full bg-status-done flex items-center justify-center"
                  >
                    <Check size={12} className="text-primary-foreground" />
                  </motion.div>
                )}
              </div>

              <p className="text-xs text-muted-foreground mb-3">{integration.description}</p>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleConnect(integration)}
                  className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    integration.connected
                      ? "bg-status-failed-bg text-status-failed hover:opacity-80"
                      : "bg-foreground text-primary-foreground hover:opacity-90"
                  }`}
                >
                  {integration.connected ? "Disconnect" : "Connect"}
                </motion.button>
                <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
                  <ExternalLink size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Connection success card */}
      <AnimatePresence>
        {connectingIntegration && (
          <ConnectionCard
            integration={connectingIntegration}
            onClose={() => setConnectingIntegration(null)}
            onGoTo={() => {
              setConnectingIntegration(null);
              navigate("/settings");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntegrationsPage;
