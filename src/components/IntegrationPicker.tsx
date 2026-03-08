import { forwardRef } from "react";
import { motion } from "framer-motion";
import type { Integration } from "@/context/PlatformContext";

interface IntegrationPickerProps {
  integrations: Integration[];
  searchQuery: string;
  onSelect: (integration: Integration) => void;
  onClose: () => void;
}

const IntegrationPicker = forwardRef<HTMLDivElement, IntegrationPickerProps>(({ integrations, searchQuery, onSelect, onClose }, ref) => {
  const filtered = integrations.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
      className="absolute bottom-full mb-2 left-0 right-0 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50"
    >
      <div className="p-2 border-b border-border">
        <span className="text-xs font-medium text-muted-foreground px-2">
          Connect an integration
        </span>
      </div>
      <div className="max-h-64 overflow-y-auto p-1.5">
        {filtered.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            No integrations found
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-0.5">
            {filtered.map((integration, index) => (
              <motion.button
                key={integration.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.03,
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
                onClick={() => onSelect(integration)}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left hover:bg-accent transition-colors group"
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="w-7 h-7 rounded-lg bg-agent-surface border border-border flex items-center justify-center overflow-hidden flex-shrink-0"
                >
                  <img
                    src={integration.logo}
                    alt={integration.name}
                    className="w-4 h-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-sm">${integration.icon}</span>`;
                    }}
                  />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {integration.name}
                    </span>
                    {integration.connected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-status-done flex-shrink-0" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{integration.category}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-md bg-accent text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {integration.connected ? "Add" : "Connect"}
                </span>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
});

IntegrationPicker.displayName = "IntegrationPicker";

export default IntegrationPicker;
