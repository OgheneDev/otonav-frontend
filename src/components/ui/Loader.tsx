"use client";

import { motion } from "framer-motion";
import { Bike } from "lucide-react";

interface LoaderProps {
  text?: string;
}

export default function Loader({ text = "Loading" }: LoaderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        {/* Animated Logo Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative"
        >
          {/* Main Logo Box */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0px rgba(255,107,107,0)",
                "0 0 40px rgba(255,107,107,0.4)",
                "0 0 0px rgba(255,107,107,0)",
              ],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-20 h-20 bg-linear-to-br from-[#FF6B6B] to-[#ff5252] rounded-2xl flex items-center justify-center z-10 relative"
          >
            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
                y: [0, -3, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
            >
              <Bike className="w-10 h-10 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Rotating Outer Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute -inset-3 border-2 border-[#FF6B6B]/20 border-t-[#FF6B6B] rounded-[22px]"
          />
        </motion.div>

        {/* Text Animation */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-2"
        >
          <h2 className="text-gray-900 font-bold tracking-[0.2em] text-sm uppercase">
            OtoNav
          </h2>

          <div className="flex items-center gap-3">
            <p className="text-gray-600 text-xs font-medium tracking-wide">
              {text}
            </p>
            {/* Animated Loading Dots */}
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    delay: i * 0.2,
                  }}
                  className="w-1 h-1 bg-[#FF6B6B] rounded-full"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
