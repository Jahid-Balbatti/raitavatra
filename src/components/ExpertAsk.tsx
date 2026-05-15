import { useState } from "react";
import { Camera, Send, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "../lib/useAuth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion, AnimatePresence } from "motion/react";

export function ExpertAsk() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'done'>('idle');

  const handleSimulateAsk = async () => {
    if (!user) {
      login();
      return;
    }

    setLoading(true);
    setStatus('analyzing');
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      await addDoc(collection(db, "expertAsks"), {
        userId: user.uid,
        imageUrl: "https://images.unsplash.com/photo-1599380792590-482869fb8bc7?q=80&w=1000&auto=format&fit=crop",
        status: "pending",
        timestamp: serverTimestamp(),
      });
      
      setStatus('done');
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-card rounded-lg p-8 border border-border overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Sparkles size={160} className="text-accent" strokeWidth={1} />
      </div>
      
      <h2 className="font-serif italic text-2xl text-accent mb-2">Expert Diagnostic</h2>
      <p className="text-text-secondary text-xs uppercase tracking-widest-large mb-8 leading-relaxed max-w-[80%]">
        Upload high-resolution capture of necrotic tissue or pathology. Processing time: &lt; 24h.
      </p>

      {status === 'idle' && (
        <button
          onClick={handleSimulateAsk}
          className="w-full flex items-center justify-center gap-4 border border-border bg-bg-hover text-accent py-5 rounded-sm font-bold uppercase tracking-widest-extra text-[10px] hover:border-accent/40 hover:text-white transition-all active:scale-95"
        >
          <Camera size={20} strokeWidth={1.5} />
          Initialize Analysis
        </button>
      )}

      {status === 'analyzing' && (
        <div className="w-full flex items-center justify-center gap-4 bg-accent/5 border border-accent/20 text-accent py-5 rounded-sm font-bold uppercase tracking-widest-extra text-[10px]">
          <Loader2 size={20} className="animate-spin" />
          Mapping Leaf Geometry...
        </div>
      )}

      <AnimatePresence>
        {status === 'done' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4 text-accent bg-accent/5 p-5 rounded-sm border border-accent/20"
          >
            <CheckCircle2 size={24} strokeWidth={1.5} className="shrink-0" />
            <div>
              <p className="font-bold text-[10px] uppercase tracking-widest-large">Request Sequenced</p>
              <p className="text-[10px] opacity-60 uppercase tracking-widest mt-0.5">Encryption status: Verified</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
        <p className="text-[9px] text-text-dim font-bold uppercase tracking-[0.3em]">
          Nexus-Core Integrated
        </p>
        <div className="flex gap-1.5">
          <span className="w-1 h-1 rounded-full bg-accent/40"></span>
          <span className="w-1 h-1 rounded-full bg-accent/40"></span>
          <span className="w-1 h-1 rounded-full bg-accent/40"></span>
        </div>
      </div>
    </div>
  );
}
