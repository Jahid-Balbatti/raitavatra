import React from 'react';
import { SuccessStory as SuccessStoryType } from "../types";
import { User, MapPin, Quote } from "lucide-react";

interface SuccessStoryProps {
  story: SuccessStoryType;
}

export const SuccessStory: React.FC<SuccessStoryProps> = ({ story }) => {
  return (
    <div className="bg-bg-card rounded-lg overflow-hidden border border-border mb-8 group">
      <div className="relative h-48 grayscale group-hover:grayscale-0 transition-all duration-700">
        <img 
          src={story.imageUrl} 
          alt={story.farmerName} 
          className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-opacity"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
        <div className="absolute bottom-4 left-8 right-8 flex items-end justify-between">
          <div>
            <h3 className="text-text-primary font-serif italic text-2xl leading-tight">{story.farmerName}</h3>
            <div className="flex items-center gap-2 text-text-muted text-[10px] uppercase tracking-widest-large mt-1">
              <MapPin size={10} className="text-accent" />
              {story.location} Cluster
            </div>
          </div>
          <div className="w-10 h-10 rounded-sm bg-bg-hover border border-border flex items-center justify-center font-serif italic text-accent">
            S{Math.floor(Math.random() * 9) + 1}
          </div>
        </div>
      </div>
      
      <div className="p-8 relative">
        <div className="absolute top-4 right-8 text-text-dim/20">
          <Quote size={60} fill="currentColor" strokeWidth={0} />
        </div>
        <p className="text-text-secondary italic font-serif text-lg mb-4 relative z-10 leading-relaxed border-l border-accent/20 pl-6">
          "{story.story}"
        </p>
        <p className="text-accent/60 font-serif italic text-md kannada-text relative z-10 leading-relaxed pl-6 opacity-60">
          "{story.storyKn}"
        </p>
      </div>
    </div>
  );
}
