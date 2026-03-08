import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { usePlatform } from "@/context/PlatformContext";
import { useNavigate } from "react-router-dom";

const FavoritesPage = () => {
  const { agents } = usePlatform();
  const navigate = useNavigate();

  // Show active agents as "favorites" for now
  const favoriteAgents = agents.filter((a) => a.status === "active");

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex items-center gap-2 mb-6">
        <Star size={20} className="text-status-pending" />
        <h1 className="text-xl font-semibold text-foreground">Favorites</h1>
      </div>

      {favoriteAgents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Star size={40} strokeWidth={1} className="mb-3 opacity-30" />
          <p className="text-sm">No favorites yet</p>
          <p className="text-xs mt-1">Star your most-used agents to see them here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {favoriteAgents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/agents/${agent.id}`)}
              className="flex items-center gap-4 border border-border rounded-xl p-4 bg-background hover:shadow-sm transition-shadow cursor-pointer"
            >
              <Star size={16} className="text-status-pending fill-status-pending flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-foreground">{agent.name}</h3>
                <p className="text-xs text-muted-foreground">{agent.description}</p>
              </div>
              <div className="text-xs text-muted-foreground">
                {agent.runs} runs · {agent.successRate}% success
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
