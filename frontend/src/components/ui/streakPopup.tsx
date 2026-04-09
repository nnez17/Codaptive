"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Flame, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StreakPopupProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
}

export function StreakPopup({ isOpen, onClose, streak }: StreakPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-card border-2 border-border rounded-[2.5rem] p-8 shadow-2xl text-center overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-orange-500/20 blur-[80px] -z-10" />

            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="flex flex-col items-center">
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1,
                }}
                className="relative mb-6"
              >
                <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                <Flame className="w-20 h-20 text-orange-500 fill-orange-500" />
                {streak === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-black px-2 py-1 rounded-lg border-2 border-card shadow-lg"
                  >
                    NEW!
                  </motion.div>
                )}
              </motion.div>

              <h2 className="text-3xl font-black text-foreground mb-2">
                {streak} Day Streak!
              </h2>
              <p className="text-muted-foreground font-medium mb-8 px-4">
                {streak === 1
                  ? "Great start! Complete a lesson tomorrow to keep your streak alive."
                  : "You're on fire! Consistent learning is the key to mastery."}
              </p>

              <div className="flex justify-center w-full mb-8">
                <div className="bg-muted/50 rounded-2xl p-6 border border-border min-w-[160px]">
                  <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-black text-foreground">
                    {streak}
                  </div>
                  <div className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                    Days
                  </div>
                </div>
              </div>

              <Button
                onClick={onClose}
                className="w-full h-14 rounded-full text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 border-b-4 border-orange-700 active:border-b-0 active:translate-y-1 transition-all"
              >
                AWESOME!
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
