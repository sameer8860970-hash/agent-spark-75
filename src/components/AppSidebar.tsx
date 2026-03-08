import { Link, useLocation } from "react-router-dom";
import { MessageSquare, Layers, Bot, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { icon: MessageSquare, path: "/", label: "Chat" },
  { icon: Bot, path: "/agents", label: "Agents" },
  { icon: Layers, path: "/jobs", label: "Jobs" },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col items-center w-[52px] border-r border-border bg-background py-3 gap-0.5">
      {/* Logo */}
      <Link to="/">
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="mb-5 flex items-center justify-center w-8 h-8 rounded-lg bg-foreground"
        >
          <span className="text-primary-foreground font-bold text-xs">A</span>
        </motion.div>
      </Link>

      {/* Nav items */}
      {navItems.map((item) => {
        const isActive =
          item.path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.path);
        return (
          <Tooltip key={item.path}>
            <TooltipTrigger asChild>
              <Link to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "w-9 h-9 flex items-center justify-center rounded-lg transition-all cursor-pointer relative",
                    isActive
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
                  )}
                >
                  <item.icon size={18} strokeWidth={1.5} />
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[7px] w-[3px] h-4 bg-foreground rounded-r-full"
                    />
                  )}
                </motion.div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              <p className="text-xs">{item.label}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}

      <div className="mt-auto flex flex-col items-center gap-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/settings">
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "w-9 h-9 flex items-center justify-center rounded-lg transition-all cursor-pointer relative",
                  location.pathname === "/settings"
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
                )}
              >
                <Settings size={18} strokeWidth={1.5} />
                {location.pathname === "/settings" && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[7px] w-[3px] h-4 bg-foreground rounded-r-full"
                  />
                )}
              </motion.div>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            <p className="text-xs">Settings</p>
          </TooltipContent>
        </Tooltip>

        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="mt-1 w-7 h-7 rounded-full bg-foreground/10 border border-border flex items-center justify-center cursor-pointer"
        >
          <span className="text-foreground text-[10px] font-semibold">T</span>
        </motion.div>
      </div>
    </div>
  );
};

export default AppSidebar;
