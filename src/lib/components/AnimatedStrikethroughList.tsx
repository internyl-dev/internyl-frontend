import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export const AnimatedStrikethroughList = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const items = [
    "Google random keywords",
    "Open 10+ tabs",
    "Search each website for eligibility",
    "Manually copy deadlines",
    "Track due dates on a random Google Doc",
    "Forget which ones you applied to",
    "Miss the results email"
  ];

  return (
    <ul
      ref={ref}
      className="text-gray-800 space-y-3 list-disc list-inside text-base md:text-lg font-medium"
      style={{ textShadow: '0 1px 6px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.08)' }}
    >
      {items.map((item, index) => (
        <motion.li
          key={index}
          className="relative transform transition-all duration-300 hover:scale-[1.02]"
          initial={{ opacity: 0.4, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0.4, x: -20 }}
          transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
        >
          <span className="relative">
            {item}
            <motion.span
              className="absolute inset-0 border-t-2 border-gray-600"
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
                transformOrigin: 'left center'
              }}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{
                duration: 0.8,
                delay: index * 0.25,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            />
          </span>
        </motion.li>
      ))}
    </ul>
  );
};