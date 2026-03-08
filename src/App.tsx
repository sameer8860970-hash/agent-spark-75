import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PlatformProvider } from "./context/PlatformContext";
import AppSidebar from "./components/AppSidebar";
import PageTransition from "./components/PageTransition";
import ChatPage from "./pages/ChatPage";
import JobsPage from "./pages/JobsPage";
import AgentDetailPage from "./pages/AgentDetailPage";
import SettingsPage from "./pages/SettingsPage";
import AgentsPage from "./pages/AgentsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><ChatPage /></PageTransition>} />
        <Route path="/agents" element={<PageTransition><AgentsPage /></PageTransition>} />
        <Route path="/agents/:id" element={<PageTransition><AgentDetailPage /></PageTransition>} />
        <Route path="/jobs" element={<PageTransition><JobsPage /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><SettingsPage /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PlatformProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex h-screen overflow-hidden bg-background">
            <AppSidebar />
            <main className="flex-1 overflow-hidden flex flex-col">
              <AnimatedRoutes />
            </main>
          </div>
        </BrowserRouter>
      </PlatformProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
