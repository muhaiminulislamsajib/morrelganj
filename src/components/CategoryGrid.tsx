import { useContext } from "react";
import { Link } from "react-router-dom";
import { Grid } from "lucide-react";
import { cn } from "@/src/lib/utils";

// Assuming context is passed or imported. For now using global mock
const MOCK_CATEGORIES = [
  { id: '1', name: { en: 'Hospitals', bn: 'হাসপাতাল' }, icon: 'hospital', slug: 'hospitals' },
  { id: '2', name: { en: 'Education', bn: 'শিক্ষা' }, icon: 'graduation-cap', slug: 'education' },
  { id: '3', name: { en: 'Transport', bn: 'পরিবহন' }, icon: 'bus', slug: 'transport' },
  { id: '4', name: { en: 'Emergency', bn: 'জরুরি' }, icon: 'shield-alert', slug: 'emergency' },
  { id: '5', name: { en: 'Dining', bn: 'খাবার' }, icon: 'utensils', slug: 'dining' },
  { id: '6', name: { en: 'Shopping', bn: 'কেনাকাটা' }, icon: 'shopping-bag', slug: 'shopping' },
];

export function CategoryGrid({ lang }: { lang: 'en' | 'bn' }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {MOCK_CATEGORIES.map((cat) => (
        <Link 
          key={cat.id}
          to={`/category/${cat.slug}`}
          className="flex flex-col items-center gap-4 p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="relative z-10 w-20 h-20 bg-slate-50 dark:bg-zinc-800 group-hover:bg-emerald-600 rounded-3xl flex items-center justify-center shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
             <Grid className="w-10 h-10 text-slate-400 group-hover:text-white transition-colors" />
          </div>
          <span className="relative z-10 text-sm font-bold text-center text-slate-600 dark:text-zinc-300 group-hover:text-emerald-700 transition-colors uppercase tracking-wider">
            {cat.name[lang]}
          </span>
        </Link>
      ))}
    </div>
  );
}
