import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Loader2 } from "lucide-react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  className?: string;
}

const THRESHOLD = 80;

const PullToRefresh = ({ onRefresh, children, className = "" }: PullToRefreshProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const pulling = useRef(false);
  const pullDistance = useMotionValue(0);

  const indicatorY = useTransform(pullDistance, [0, THRESHOLD], [0, THRESHOLD * 0.6]);
  const indicatorOpacity = useTransform(pullDistance, [0, THRESHOLD * 0.4, THRESHOLD], [0, 0.5, 1]);
  const indicatorRotate = useTransform(pullDistance, [0, THRESHOLD], [0, 360]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (refreshing) return;
    const el = containerRef.current;
    if (el && el.scrollTop <= 0) {
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    }
  }, [refreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pulling.current || refreshing) return;
    const delta = Math.max(0, e.touches[0].clientY - startY.current);
    // Rubber-band effect
    const dampened = delta * 0.45;
    pullDistance.set(dampened);
  }, [refreshing, pullDistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current || refreshing) return;
    pulling.current = false;

    if (pullDistance.get() >= THRESHOLD * 0.6) {
      setRefreshing(true);
      animate(pullDistance, THRESHOLD * 0.5, { type: "spring", stiffness: 300, damping: 25 });
      await onRefresh();
      setRefreshing(false);
    }
    animate(pullDistance, 0, { type: "spring", stiffness: 400, damping: 30 });
  }, [refreshing, pullDistance, onRefresh]);

  return (
    <div className="relative overflow-hidden flex-1 flex flex-col min-h-0">
      {/* Pull indicator */}
      <motion.div
        style={{ y: indicatorY, opacity: indicatorOpacity }}
        className="absolute top-0 left-0 right-0 flex items-center justify-center z-10 pointer-events-none h-10 md:hidden"
      >
        <motion.div style={{ rotate: refreshing ? undefined : indicatorRotate }}>
          <Loader2
            size={18}
            className={`text-muted-foreground ${refreshing ? "animate-spin" : ""}`}
          />
        </motion.div>
      </motion.div>

      <div
        ref={containerRef}
        className={`flex-1 overflow-y-auto ${className}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div style={{ y: indicatorY }} className="md:!transform-none">
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default PullToRefresh;
