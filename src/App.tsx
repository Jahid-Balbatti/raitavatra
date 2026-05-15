/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from './lib/firebase';
import { seedDatabase } from './lib/seed';
import { Tip, SuccessStory as SuccessStoryType, CropCategory } from './types';
import { Header } from './components/Header';
import { TipCard } from './components/TipCard';
import { SuccessStory } from './components/SuccessStory';
import { ExpertAsk } from './components/ExpertAsk';
import { CropFilter } from './components/CropFilter';
import { VerificationChecklist } from './components/VerificationChecklist';
import { LayoutGroup, motion } from 'motion/react';
import { Loader2, RefreshCw } from 'lucide-react';

export default function App() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [stories, setStories] = useState<SuccessStoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState<CropCategory | null>(null);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Seed database on mount
    seedDatabase().catch(console.error);

    // Fetch Tips
    const tipsQuery = query(collection(db, 'tips'), orderBy('createdAt', 'desc'), limit(20));
    const unsubscribeTips = onSnapshot(tipsQuery, (snapshot) => {
      const tipsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tip));
      setTips(tipsData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error (Tips):", error);
      setLoading(false);
    });

    // Fetch Success Stories
    const storiesQuery = query(collection(db, 'successStories'), orderBy('createdAt', 'desc'), limit(5));
    const unsubscribeStories = onSnapshot(storiesQuery, (snapshot) => {
      const storiesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SuccessStoryType));
      setStories(storiesData);
    });

    return () => {
      unsubscribeTips();
      unsubscribeStories();
    };
  }, []);

  const filteredTips = selectedCrop 
    ? tips.filter(t => t.cropCategory === selectedCrop)
    : tips;

  const currentTip = filteredTips[tipIndex % filteredTips.length];

  const handleNextTip = () => {
    setTipIndex(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="animate-spin text-accent" size={32} strokeWidth={1} />
          <p className="font-serif italic text-2xl text-accent animate-pulse">Raitha-Varta Synthesizing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 bg-bg-main selection:bg-accent selection:text-black">
      <Header />
      
      <main className="max-w-md mx-auto px-6 pt-10">
        {/* Daily Tip Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="font-serif italic text-3xl text-text-primary">Directives / <span className="text-accent">Daily</span></h2>
              <p className="text-text-muted text-[10px] uppercase tracking-widest-large">Streamed from Krishi Vigyana Kendra</p>
            </div>
            <button 
              onClick={() => setTipIndex(0)}
              className="p-3 bg-bg-card border border-border text-text-dim hover:text-accent hover:border-accent/40 transition-colors rounded-sm"
              title="Reset Cache"
            >
              <RefreshCw size={16} strokeWidth={1.5} />
            </button>
          </div>

          <div className="mb-10">
            <CropFilter selected={selectedCrop} onSelect={(c) => { setSelectedCrop(c); setTipIndex(0); }} />
          </div>

          <div className="relative">
            {currentTip ? (
              <TipCard tip={currentTip} onNext={handleNextTip} />
            ) : (
              <div className="aspect-[4/5] bg-bg-card rounded-lg border border-border flex flex-col items-center justify-center p-12 text-center">
                <RefreshCw className="text-text-dim mb-6 opacity-20" size={64} strokeWidth={1} />
                <p className="text-text-muted font-serif italic text-xl">End of Stream. Refreshing archives...</p>
              </div>
            )}
          </div>
        </section>

        {/* Feature Section with Layout Transitions */}
        <LayoutGroup>
          <motion.div layout className="space-y-16">
            {/* Verification Checklist */}
            <VerificationChecklist />

            {/* Expert Ask */}
            <ExpertAsk />

            {/* Success Stories */}
            <section>
              <div className="flex items-baseline gap-4 mb-8">
                <h2 className="font-serif italic text-3xl text-text-primary">Impact Logs</h2>
                <span className="text-[9px] uppercase tracking-widest-extra text-accent border border-accent/20 px-2 py-0.5 rounded-sm bg-accent/5">Verified</span>
              </div>
              <div className="space-y-8">
                {stories.map(story => (
                  <SuccessStory key={story.id} story={story} />
                ))}
              </div>
            </section>
          </motion.div>
        </LayoutGroup>

        <footer className="mt-24 text-center pb-12 border-t border-border pt-12">
          <p className="text-text-dim text-[10px] uppercase tracking-widest-extra font-bold mb-2">© 2026 MindMatrix Engine Tier</p>
          <p className="font-serif italic text-lg text-accent/40">Raitha-Varta Project Dashboard</p>
        </footer>
      </main>

      {/* Bottom Navigation for Mobile Feel */}
      <nav className="fixed bottom-0 left-0 right-0 h-24 bg-bg-card/80 backdrop-blur-2xl border-t border-border flex items-center justify-around px-10 z-50">
        <button className="flex flex-col items-center gap-2 text-accent relative">
          <div className="w-8 h-0.5 bg-accent rounded-full absolute -top-10" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Deploy</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-text-dim hover:text-text-secondary transition-colors">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Vault</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-text-dim hover:text-text-secondary transition-colors">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Audit</span>
        </button>
      </nav>
    </div>
  );
}

