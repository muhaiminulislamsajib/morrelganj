import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  ArrowLeft, Filter, LayoutGrid, List, 
  Search, SlidersHorizontal, ChevronDown 
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

export function CategoryHeader({ title }: { title: string }) {
  return (
    <div className="bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-6 mb-8">
          <Link to="/" className="p-3 bg-slate-50 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all shadow-sm">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">{title}</h1>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            {["All Listings", "Government", "Private", "Specialist", "Clinics"].map((sub) => (
              <button 
                key={sub}
                className={cn(
                  "px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all",
                  sub === "All Listings" 
                    ? "bg-emerald-700 text-white shadow-lg shadow-emerald-700/20" 
                    : "bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 font-bold border border-slate-100 dark:border-zinc-800"
                )}
              >
                {sub}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
             <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 font-bold" />
                <input 
                  type="text" 
                  placeholder="Filter by name, tag or area..."
                  className="w-full h-12 bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl py-2 pl-12 pr-4 text-sm font-medium outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all shadow-sm"
                />
             </div>
             <button className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:border-emerald-500 transition-all">
                <SlidersHorizontal className="w-5 h-5 text-slate-600" />
             </button>
             <div className="flex bg-slate-50 dark:bg-zinc-900 p-1 rounded-2xl border border-slate-200 dark:border-zinc-800">
                <button className="p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-slate-100 dark:border-zinc-700">
                  <LayoutGrid className="w-5 h-5 text-emerald-700" />
                </button>
                <button className="p-2 text-slate-400">
                  <List className="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
