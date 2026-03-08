import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageSquare, Layers, Users, Star, LayoutGrid, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { icon: MessageSquare, path: "/", label: "Chat" },
  { icon: Layers, path: "/jobs", label: "Jobs" },
  { icon: Users, path: "/agents", label: "Agents" },
  { icon: LayoutGrid, path: "/integrations", label: "Integrations" },
  { icon: Star, path: "/favorites", label: "Favorites" },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col items-center w-14 border-r border-border bg-background py-4 gap-1">
      {/* Logo */}
      <div className="mb-4 flex items-center justify-center w-9 h-9 rounded-lg bg-foreground">
        <span className="text-primary-foreground font-bold text-sm">A</span>
      </div>

      {/* Nav items */}
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path} title={item.label}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer",
                isActive
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon size={20} strokeWidth={1.5} />
            </motion.div>
          </Link>
        );
      })}

      <div className="mt-auto">
        <Link to="/settings" title="Settings">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
          >
            <Settings size={20} strokeWidth={1.5} />
          </motion.div>
        </Link>
        {/* Avatar */}
        <div className="mt-2 w-8 h-8 mx-auto rounded-full bg-status-process flex items-center justify-center">
          <span className="text-primary-foreground text-xs font-medium">T</span>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
