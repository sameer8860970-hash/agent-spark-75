import { motion } from "framer-motion";
import { Check, ExternalLink, X } from "lucide-react";
import type { Integration } from "@/context/PlatformContext";

interface ConnectionCardProps {
  integration: Integration;
  onClose: () => void;
  onGoTo?: () => void;
}

const ConnectionCard = ({ integration, onClose, onGoTo }: ConnectionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="bg-background border border-border rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success header */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
              className="w-5 h-5 rounded-full bg-status-done flex items-center justify-center"
            >
              <Check size={12} className="text-primary-foreground" />
            </motion.div>
            <span className="text-sm text-foreground">
              Connected to {integration.name} successfully!
            </span>
          </div>

          {/* Integration card preview */}
          <div className="border border-border rounded-xl p-4 bg-agent-surface">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={integration.logo}
                alt={integration.name}
                className="w-6 h-6"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-sm font-semibold text-foreground">
                {integration.name}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                <span className="text-xs font-medium text-muted-foreground">TA</span>
              </div>
              <div>
                <span className="text-xs font-medium text-foreground">Your Workspace</span>
                <span className="text-xs text-muted-foreground ml-1">@workspace</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {integration.description}. Your agent can now access {integration.name} to perform automated tasks, send notifications, and process data seamlessly.
            </p>

            <p className="text-xs text-muted-foreground mt-2 opacity-60">
              {new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Bottom gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 px-5 py-3">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-accent transition-colors"
          >
            Close
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGoTo || onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-foreground text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Go to settings
            <ExternalLink size={11} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConnectionCard;
