import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import { useState } from "react";
import { Tip } from "../types";
import { CheckCircle2, ChevronRight, Share2 } from "lucide-react";
import { cn } from "../lib/utils";

interface TipCardProps {
  tip: Tip;
  onNext: () => void;
}

export function TipCard({ tip, onNext }: TipCardProps) {
  const [exitX, setExitX] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      setExitX(200);
      onNext();
    } else if (info.offset.x < -100) {
      setExitX(-200);
      onNext();
    }
  };

  return (
    <div className="relative w-full aspect-[4/5] max-w-sm mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={tip.id}
          style={{ x, rotate, opacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ x: exitX, opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className="absolute inset-0 bg-bg-card rounded-lg border border-border overflow-hidden cursor-grab active:cursor-grabbing group shadow-2xl shadow-black/50"
        >
          <div className="h-3/5 relative grayscale hover:grayscale-0 transition-all duration-700">
            <img
              src={tip.imageUrl}
              alt={tip.cropCategory}
              className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-opacity"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-0 left-0 p-4">
              <span className="text-[10px] px-2 py-1 bg-bg-main text-accent border border-accent/20 rounded-sm uppercase tracking-widest font-bold">
                {tip.cropCategory} • V2.4.8
              </span>
            </div>
            <div className="absolute bottom-4 right-4 group-hover:translate-x-1 transition-transform">
              <div className="bg-accent/10 border border-accent/30 p-2 rounded-sm text-accent backdrop-blur-sm">
                <ChevronRight size={20} strokeWidth={1} />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
          </div>
          
          <div className="p-8 flex flex-col justify-between h-2/5">
            <div>
              <p className="text-text-primary font-serif italic text-xl leading-snug mb-3">
                {tip.instruction}
              </p>
              <p className="text-accent/80 font-serif italic text-lg kannada-text opacity-70">
                {tip.instructionKn}
              </p>
            </div>
            
            <div className="flex items-center justify-between text-text-dim mt-4 border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[9px] uppercase tracking-widest-extra font-bold mt-0.5">Verified Data Stream</span>
              </div>
              <button className="p-2 hover:text-accent transition-colors">
                <Share2 size={14} strokeWidth={1} />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
