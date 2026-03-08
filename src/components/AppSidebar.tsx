import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageSquare, Bot, Layers, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { icon: MessageSquare, path: "/", label: "Chats" },
  { icon: Bot, path: "/agents", label: "Agents" },
  { icon: Settings, path: "/settings", label: "Settings" },
  { icon: Layers, path: "/jobs", label: "Jobs" },
];

const AppSidebar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <>
      <Link to="/" onClick={() => setMobileOpen(false)}>
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="mb-5 flex items-center justify-center w-8 h-8 rounded-lg bg-foreground"
        >
          <span className="text-primary-foreground font-bold text-xs">A</span>
        </motion.div>
      </Link>

      {navItems.map((item) => {
        const isActive = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
        return (
          <Tooltip key={item.path}>
            <TooltipTrigger asChild>
              <Link to={item.path} onClick={() => setMobileOpen(false)}>
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "w-9 h-9 flex items-center justify-center rounded-lg transition-all cursor-pointer relative",
                    isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
                  )}
                >
                  <item.icon size={18} strokeWidth={1.5} />
                  {isActive && (
                    <motion.div layoutId="activeIndicator" className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[7px] w-[3px] h-4 bg-foreground rounded-r-full" />
                  )}
                </motion.div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}><p className="text-xs">{item.label}</p></TooltipContent>
          </Tooltip>
        );
      })}

      <div className="mt-auto flex flex-col items-center gap-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/settings" onClick={() => setMobileOpen(false)}>
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "w-9 h-9 flex items-center justify-center rounded-lg transition-all cursor-pointer relative",
                  location.pathname === "/settings" ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
                )}
              >
                <Settings size={18} strokeWidth={1.5} />
                {location.pathname === "/settings" && (
                  <motion.div layoutId="activeIndicator" className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[7px] w-[3px] h-4 bg-foreground rounded-r-full" />
                )}
              </motion.div>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}><p className="text-xs">Settings</p></TooltipContent>
        </Tooltip>
        <motion.div whileHover={{ scale: 1.1 }} className="mt-1 w-7 h-7 rounded-full bg-foreground/10 border border-border flex items-center justify-center cursor-pointer">
          <span className="text-foreground text-[10px] font-semibold">T</span>
        </motion.div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col items-center w-[52px] border-r border-border bg-background py-3 gap-0.5">
        <NavContent />
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background flex items-center justify-around px-2 py-1.5 safe-area-bottom">
        {navItems.map((item) => {
          const isActive = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
          return (
            <Link key={item.path} to={item.path} className="flex-1 flex flex-col items-center gap-0.5 py-1">
              <item.icon
                size={20}
                strokeWidth={1.5}
                className={cn(
                  "transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              />
              <span className={cn("text-[10px]", isActive ? "text-foreground font-medium" : "text-muted-foreground")}>
                {item.label}
              </span>
            </Link>
          );
        })}
        <Link to="/settings" className="flex-1 flex flex-col items-center gap-0.5 py-1">
          <Settings
            size={20}
            strokeWidth={1.5}
            className={cn(
              "transition-colors",
              location.pathname === "/settings" ? "text-foreground" : "text-muted-foreground"
            )}
          />
          <span className={cn("text-[10px]", location.pathname === "/settings" ? "text-foreground font-medium" : "text-muted-foreground")}>
            Settings
          </span>
        </Link>
      </div>
    </>
  );
};

export default AppSidebar;