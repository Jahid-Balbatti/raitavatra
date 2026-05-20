import { motion } from "motion/react";
import { Tip } from "../types";
import { ChevronRight, Share2, Sparkles } from "lucide-react";

interface TipCardProps {
  tip: Tip;
  onNext: () => void;
  isNextDisabled?: boolean;
  key?: string;
}

export function TipCard({ tip, onNext, isNextDisabled = false }: TipCardProps) {
  // Resolve high-resolution, fully loading images for crops to avoid stale database image links
  let displayImageUrl = tip.imageUrl;
  
  if (tip.cropCategory === "Paddy") {
    displayImageUrl = "https://www.farmatma.in/wp-content/uploads/2018/01/paddy-cultivation.jpg";
  } else if (tip.cropCategory === "Coconut") {
    displayImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMOGobi8rQR75NP2zyWKhI2mldBu34QxjKRkPOglRN6NTASlTez_yOlHOmPhhjj8AYKuufEPR5XKOTFNdXZnc96EozQb_4QiiEwRE8wA&s=10";
  } else if (tip.cropCategory === "Areca nut") {
    displayImageUrl = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80";
  } else if (tip.cropCategory === "Tomato") {
    displayImageUrl = "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=1000&q=80";
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-full bg-bg-card rounded-lg border border-border overflow-hidden group shadow-2xl shadow-black/50 flex flex-col"
    >
      {/* Image Banner */}
      <div className="relative h-44 sm:h-48 w-full grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden">
        <img
          src={displayImageUrl}
          alt={tip.cropCategory}
          className="w-full h-full object-cover opacity-40 group-hover:opacity-75 transition-all duration-500 scale-100 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-0 left-0 p-4">
          <span className="text-[9px] px-2.5 py-1 bg-bg-main text-accent border border-accent/20 rounded-sm uppercase tracking-widest font-bold font-mono">
            {tip.cropCategory} • DAILY DIRECTIVE
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/10 to-transparent" />
      </div>
      
      {/* Details Content Box */}
      <div className="p-6 sm:p-8 flex flex-col gap-6 flex-1 min-h-[220px]">
        {/* English instructions */}
        <div className="space-y-4">
          <p className="text-text-primary font-serif italic text-lg leading-relaxed">
            "{tip.instruction}"
          </p>
          
          {/* Visual Accent/Divider Separator */}
          <div className="flex items-center gap-2 py-1">
            <div className="h-[1px] bg-accent/20 flex-1" />
            <Sparkles size={10} className="text-accent/40 animate-pulse" />
            <div className="h-[1px] bg-accent/20 flex-1" />
          </div>
          
          {/* Kannada instructions - highly refined, optimized for screen reading, no italics, perfect line padding */}
          <p className="text-accent font-sans text-sm sm:text-base leading-relaxed font-normal antialiased tracking-normal">
            "{tip.instructionKn}"
          </p>
        </div>
        
        {/* Bottom footer bar with next button */}
        <div className="flex items-center justify-between text-text-dim mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <p className="text-[8px] sm:text-[9px] uppercase tracking-widest-extra font-bold mt-0.5 whitespace-nowrap">
              KVK Certified Stream
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-text-secondary hover:text-accent transition-colors cursor-pointer" title="Share Advisory">
              <Share2 size={13} strokeWidth={1.5} />
            </button>
            <button
              onClick={onNext}
              disabled={isNextDisabled}
              className={`px-4 py-2 text-[9px] uppercase tracking-widest-large font-bold rounded-sm transition-all flex items-center gap-1.5 active:scale-95 whitespace-nowrap ${
                isNextDisabled
                  ? "bg-border text-text-dim hover:bg-border border border-border cursor-not-allowed opacity-50"
                  : "bg-accent/10 border border-accent/25 hover:border-accent/50 hover:bg-accent/25 text-accent cursor-pointer"
              }`}
            >
              {isNextDisabled ? "Only Card" : "Next Card"}{" "}
              <ChevronRight size={11} strokeWidth={2.5} className="mt-0.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
