import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export function GlassCard({ children, className, ...rest }: GlassCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn("glass-strong rounded-sm p-8 relative overflow-hidden", className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
