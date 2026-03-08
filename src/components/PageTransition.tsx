import { motion } from "framer-motion";
import { ReactNode } from "react";

const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
    className="flex-1 flex flex-col overflow-hidden"
  >
    {children}
  </motion.div>
);

export default PageTransition;
