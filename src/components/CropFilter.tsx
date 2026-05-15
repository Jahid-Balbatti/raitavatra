import { CropCategory } from "../types";
import { cn } from "../lib/utils";

interface CropFilterProps {
  selected: CropCategory | null;
  onSelect: (category: CropCategory | null) => void;
}

export function CropFilter({ selected, onSelect }: CropFilterProps) {
  const categories = Object.values(CropCategory);

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all border",
          !selected 
            ? "bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-600/20" 
            : "bg-white text-slate-500 border-slate-200 hover:border-primary-300"
        )}
      >
        All Crops
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={cn(
            "px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all border",
            selected === category 
              ? "bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-600/20" 
              : "bg-white text-slate-500 border-slate-200 hover:border-primary-300"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
