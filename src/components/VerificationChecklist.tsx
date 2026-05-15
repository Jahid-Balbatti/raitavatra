import { CheckSquare, ShieldCheck, Zap, Droplets } from "lucide-react";
import { motion } from "motion/react";

export function VerificationChecklist() {
  const items = [
    { label: "Cleanliness Verified", icon: CheckSquare, status: "completed" },
    { label: "Soil Health Tested", icon: Droplets, status: "completed" },
    { label: "Organic Practice Certified", icon: ShieldCheck, status: "pending" },
    { label: "Tool Maintenance", icon: Zap, status: "completed" },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-primary-100 mb-10">
      <h2 className="font-display font-bold text-xl text-slate-900 mb-4 flex items-center gap-2">
        Home Verification
        <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">75% Score</span>
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`p-3 rounded-2xl border transition-all ${
              item.status === 'completed' 
                ? 'bg-primary-50 border-primary-100 text-primary-700' 
                : 'bg-slate-50 border-slate-100 text-slate-400'
            }`}
          >
            <item.icon size={20} className="mb-2" />
            <p className="text-[10px] font-black uppercase tracking-tight leading-none">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
