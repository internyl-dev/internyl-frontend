import { motion } from "framer-motion";

export const FloatingCard = ({ children, delay = 0, className = "" }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  return (
    <motion.div
      className={className}
      initial={{ y: 0, rotate: 0 }}
      animate={{
        y: [-5, 5, -5],
        rotate: [-0.5, 0.5, -0.5]
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};