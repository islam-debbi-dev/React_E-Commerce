"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedCounter({ count }: { count: number }) {
  const prevCount = count - 1;
  console.log("prev: ", prevCount);

  return (
    <div className="grid">
      <AnimatePresence>
        {prevCount !== null && (
          <motion.span
            key={`old-${prevCount}`}
            initial={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            animate={{ opacity: 0, y: -20, filter: "blur(4px)" }}
            transition={{
              duration: 0.15,
              ease: "easeOut",
            }}
            className="flex items-center pointer-events-none"
            style={{ gridArea: "1/1", zIndex: 1 }}
          >
            {prevCount}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.span
        key={`new-${count}`}
        initial={
          prevCount !== null ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }
        }
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          duration: 0.15,
          ease: "easeInOut",
        }}
        className="flex items-center"
        style={{ gridArea: "1/1", zIndex: 2 }}
      >
        {count}
      </motion.span>
    </div>
  );
}
