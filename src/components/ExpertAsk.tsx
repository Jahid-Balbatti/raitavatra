import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Trash2, CheckCircle2, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "../lib/useAuth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { motion, AnimatePresence } from "motion/react";

export function ExpertAsk() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'done'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Str = (reader.result as string).split(",")[1];
        resolve(base64Str);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleSimulateAsk = async () => {
    if (!user) {
      login();
      return;
    }

    if (!selectedFile) {
      return;
    }

    setLoading(true);
    setStatus('analyzing');
    setError(null);

    try {
      const base64Data = await fileToBase64(selectedFile);
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mimeType: selectedFile.type,
          base64Data,
        }),
      });

      if (!res.ok) {
        const errObj = await res.json();
        throw new Error(errObj.error || "Failed to scan and analyze sample");
      }

      const data = await res.json();
      setResult(data);

      // Save a record of this expert diagnostic in Firebase for farmer reference
      try {
        await addDoc(collection(db, "expertAsks"), {
          userId: user.uid,
          cropName: data.cropName || "Unknown Crop",
          diagnosis: data.diagnosis || "Unknown Condition",
          severity: data.severity || "Medium",
          timestamp: serverTimestamp(),
          imageUrl: previewUrl || "",
        });
      } catch (dbErr) {
        console.warn("Could not write diagnostic log to Firestore history:", dbErr);
      }

      setStatus('done');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected issue occurred while analyzing crop pathology.");
      setStatus('idle');
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
        upload high resolution capture of damaged part of the crop from your gallery
      </p>

      {/* Error Output Panel */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-sm text-red-400 text-xs flex gap-3 items-start animate-fade-in">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold uppercase tracking-wider text-[9px] mb-1 text-red-300">Diagnostic Failure</p>
            <p className="leading-relaxed">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="text-[9px] uppercase tracking-wider text-text-muted hover:text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {status === 'idle' && (
        <div className="space-y-4">
          {!previewUrl ? (
            <div 
              onClick={handleSelectClick}
              className="border border-dashed border-border hover:border-accent/30 cursor-pointer rounded-lg p-8 bg-bg-main/50 flex flex-col items-center justify-center gap-3 group/upload transition-all duration-300"
            >
              <div className="p-3 bg-bg-card border border-border group-hover/upload:border-accent/20 rounded-md text-text-secondary group-hover/upload:text-accent transition-all duration-300">
                <Upload size={24} strokeWidth={1.5} />
              </div>
              <p className="text-[10px] uppercase tracking-widest-large text-text-muted font-bold group-hover/upload:text-text-secondary transition-colors">
                Select Leaf Photo from Gallery
              </p>
              <p className="text-[9px] text-text-dim uppercase tracking-widest mt-1">
                PNG, JPG upto 10MB • No camera required
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative border border-border rounded-lg overflow-hidden h-48 bg-black/40 flex items-center justify-center group/preview">
                <img 
                  src={previewUrl} 
                  alt="Leaf diagnostic preview" 
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={handleClear}
                  className="absolute top-3 right-3 p-2 bg-bg-card border border-border hover:border-red-500/20 text-text-secondary hover:text-red-400 rounded-sm transition-all duration-200 shadow-lg cursor-pointer"
                  title="Remove image"
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 text-accent text-[9px] uppercase tracking-widest-large rounded-sm border border-accent/10">
                  Ready for Engine Scan
                </div>
              </div>

              <button
                onClick={handleSimulateAsk}
                className="w-full flex items-center justify-center gap-4 border border-border bg-bg-hover text-accent py-5 rounded-sm font-bold uppercase tracking-widest-extra text-[10px] hover:border-accent/40 hover:text-white transition-all active:scale-95 cursor-pointer"
              >
                <ImageIcon size={20} strokeWidth={1.5} />
                Analyze selected sample
              </button>
            </div>
          )}
        </div>
      )}

      {status === 'analyzing' && (
        <div className="space-y-4">
          {previewUrl && (
            <div className="relative border border-border rounded-lg overflow-hidden h-40 bg-black/40 flex items-center justify-center opacity-40">
              <img 
                src={previewUrl} 
                alt="Leaf diagnostic preview" 
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 to-transparent" />
            </div>
          )}
          <div className="w-full flex items-center justify-center gap-4 bg-accent/5 border border-accent/20 text-accent py-5 rounded-sm font-bold uppercase tracking-widest-extra text-[10px]">
            <Loader2 size={20} className="animate-spin" />
            Mapping Leaf Geometry & Scanning Pathogens...
          </div>
        </div>
      )}

      {status === 'done' && result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="space-y-6 mt-4"
        >
          {/* Header Title with Identified Crop name */}
          <div className="flex border-b border-border pb-4 items-center justify-between gap-4">
            <div>
              <span className="text-[9px] uppercase tracking-widest-large text-accent/80 font-mono font-bold">
                AI Diagnostic Report
              </span>
              <h3 className="text-xl sm:text-2xl font-serif text-text-primary italic mt-0.5">
                {result.cropName} &mdash; <span className="text-accent">{result.diagnosis}</span>
              </h3>
            </div>
            
            <div className="flex flex-col items-end gap-1 font-mono shrink-0">
              <span className="text-[9px] uppercase tracking-widest text-text-muted">Accuracy Match</span>
              <span className="text-xs bg-accent/10 border border-accent/20 px-2 py-0.5 rounded text-accent font-bold">
                {result.confidence}%
              </span>
            </div>
          </div>

          {/* Kannada script summary block tailored for local farmers */}
          <div className="bg-accent/5 rounded-md border border-accent/20 p-5 space-y-2">
            <span className="text-[8px] bg-accent/10 text-accent font-mono border border-accent/20 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
              ಕನ್ನಡ ವಿವರಣೆ (Kannada Summary)
            </span>
            <p className="text-text-primary text-sm sm:text-base leading-relaxed font-sans font-normal antialiased">
              {result.kannadaSummary}
            </p>
          </div>

          {/* Visual Findings Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-border p-4 bg-bg-main/30 rounded">
              <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider block mb-1 font-mono">
                Visual Symptoms Explanation
              </span>
              <p className="text-xs text-text-secondary leading-relaxed">
                {result.shortExplanation}
              </p>
            </div>

            <div className="border border-border p-4 bg-bg-main/30 rounded flex flex-col justify-between">
              <div>
                <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider block mb-1 font-mono">
                  Threat Level
                </span>
                <span className={`inline-block text-[10px] uppercase tracking-widest-large font-mono font-bold px-2.5 py-0.5 rounded ${
                  result.severity?.toLowerCase() === 'high' 
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                    : result.severity?.toLowerCase() === 'medium'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {result.severity || 'Medium'} Alert
                </span>
              </div>
              <p className="text-[8px] text-text-dim uppercase tracking-wider mt-2">
                Action target: Immediate attention recommended
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {/* Split symptoms and cures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Symptoms List */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] uppercase tracking-widest-large font-bold text-text-secondary font-mono">
                  Identified Signs & Symptoms
                </h4>
                <ul className="space-y-2">
                  {result.symptoms?.map((sym: string, idx: number) => (
                    <li key={idx} className="text-xs text-text-muted flex gap-2 items-start">
                      <span className="text-accent/60 font-serif mt-0.5">•</span>
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Immediate Remedies list styled beautifully */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] uppercase tracking-widest-large font-bold text-accent font-mono">
                  Immediate Curative Remediation
                </h4>
                <ol className="space-y-2">
                  {result.immediateActions?.map((act: string, idx: number) => (
                    <li key={idx} className="text-xs text-text-secondary flex gap-2.5 items-start bg-accent/5 p-2.5 border border-accent/15 rounded">
                      <span className="font-mono text-xs text-accent font-bold mt-0.5">0{idx + 1}.</span>
                      <span className="leading-normal">{act}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Preventive measures for long-term health */}
            <div className="border-t border-border pt-4 mt-2">
              <h4 className="text-[10px] uppercase tracking-widest-large font-bold text-text-primary mb-2.5 font-mono">
                Long-Term Cultural & Preventive Strategies
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {result.preventiveMeasures?.map((prev: string, idx: number) => (
                  <li key={idx} className="text-text-muted flex gap-2 items-start">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{prev}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reset button to clear everything and scan again */}
          <button
            onClick={() => {
              setResult(null);
              setError(null);
              handleClear();
              setStatus('idle');
            }}
            className="w-full flex items-center justify-center gap-2 border border-border bg-bg-hover text-accent py-4 rounded-sm font-bold uppercase tracking-widest-extra text-[9px] hover:border-accent/40 hover:text-white transition-all cursor-pointer active:scale-95 mt-4"
          >
            <Sparkles size={14} />
            Diagnostic Reset • Scan Another Sample
          </button>
        </motion.div>
      )}

      <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
        <p className="text-[9px] text-text-dim font-bold uppercase tracking-[0.3em]">
          Nexus-Core Integrated
        </p>
        <div className="flex gap-1.5">
          <span className="w-1 h-1 rounded-full bg-accent/40 animate-ping"></span>
          <span className="w-1 h-1 rounded-full bg-accent/40"></span>
          <span className="w-1 h-1 rounded-full bg-accent/40"></span>
        </div>
      </div>
    </div>
  );
}
