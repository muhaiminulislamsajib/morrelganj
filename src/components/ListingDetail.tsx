import { Link } from "react-router-dom";
import { 
  ArrowLeft, Share2, Heart, ShieldCheck, MapPin, 
  Phone, MessageSquare, Globe, Clock, Tag, 
  ChevronRight, Star, AlertCircle
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

export function ListingDetail({ listing }: { listing: any }) {
  return (
    <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-32">
      {/* Photo Gallery Grid */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-16">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-3 text-slate-500 hover:text-emerald-700 transition-all font-bold group">
             <div className="p-2 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-100 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <ArrowLeft className="w-5 h-5" />
             </div>
             Back to Morrelganj
          </Link>
          <div className="flex gap-3">
            <button className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-lg transition-all">
              <Share2 className="w-6 h-6 text-slate-600" />
            </button>
            <button className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:text-rose-500 transition-all">
              <Heart className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 aspect-[16/9] md:aspect-[21/9]">
          <div className="md:col-span-2 rounded-[3rem] overflow-hidden relative group shadow-2xl">
            <img 
              src={listing.imageUrls?.[0] || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200'} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          <div className="hidden md:grid gap-6">
             <div className="rounded-[2rem] overflow-hidden shadow-lg border border-white/20">
               <img src="https://images.unsplash.com/photo-1581056771107-24a5f9596a2a?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" />
             </div>
             <div className="rounded-[2rem] overflow-hidden shadow-lg border border-white/20">
               <img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" />
             </div>
          </div>
          <div className="hidden md:block rounded-[2rem] overflow-hidden relative shadow-lg group border border-white/20">
             <img src="https://images.unsplash.com/photo-1538108149393-fdfd81895907?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-black text-xl">+12 Photos</span>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Info */}
        <div className="lg:col-span-2">
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl">
                {listing.category || 'Hospital'}
              </span>
              <div className="flex items-center gap-2 text-slate-400 bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-black text-slate-900 dark:text-white">4.8</span>
                <span className="text-xs font-bold">(128 Reviews)</span>
              </div>
            </div>
            <h1 className="text-5xl font-black mb-6 text-slate-900 dark:text-white leading-tight">
              {listing.title?.en}
              {listing.isVerified && <ShieldCheck className="inline-block ml-4 w-10 h-10 text-blue-600" />}
            </h1>
            <p className="text-slate-500 dark:text-zinc-400 text-xl leading-relaxed font-medium">
              {listing.description?.en || "Providing essential medical services to the residents of Morrelganj. Modern diagnostic facilities and specialized care are available."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
             <div className="flex flex-col gap-4 p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm group hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-slate-50 dark:bg-zinc-800 rounded-2xl text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Location</div>
                  <div className="font-bold text-lg text-slate-800 dark:text-zinc-200">{listing.address}</div>
                </div>
             </div>
             <div className="flex flex-col gap-4 p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm group hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-slate-50 dark:bg-zinc-800 rounded-2xl text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Availability</div>
                  <div className="font-bold text-lg text-emerald-700">{listing.businessHours || "Open 24 Hours • Emergency"}</div>
                </div>
             </div>
          </div>

          <div className="mb-16">
            <h3 className="text-2xl font-black mb-8 text-slate-900 dark:text-white">Location Map</h3>
            <div className="aspect-video bg-slate-100 dark:bg-zinc-900 rounded-[3rem] overflow-hidden relative border border-slate-200 dark:border-zinc-800 shadow-inner group">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29498.438596229094!2d89.83426067542757!3d22.455176642804847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a001a9600f2e939%3A0x5b107c575a8fa7e2!2sMorrelganj%2C%20Bangladesh!5e0!3m2!1sen!2sus!4v1779182292077!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-90 group-hover:opacity-100 transition-opacity"
               />
            </div>
            <button className="w-full mt-6 py-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              Open in Google Maps
            </button>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[3.5rem] p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)]">
             <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 bg-emerald-700 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-emerald-700/30">
                   <Phone className="w-8 h-8" />
                </div>
                <div>
                   <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Direct Help</div>
                   <div className="text-2xl font-black tracking-tighter text-slate-950 dark:text-white">{listing.phone || "017XX-XXXXXX"}</div>
                </div>
             </div>

             <div className="space-y-4">
                <button className="w-full h-16 bg-emerald-700 hover:bg-emerald-800 text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-emerald-900/20 transition-all active:scale-95 flex items-center justify-center gap-3">
                   <Phone className="w-5 h-5 fill-current" />
                   Call for Information
                </button>
                <button className="w-full h-16 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3">
                   <MessageSquare className="w-6 h-6" />
                   Chat on WhatsApp
                </button>
                <button className="w-full h-16 bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 text-slate-600 font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3">
                   <Globe className="w-6 h-6" />
                   Visit Website
                </button>
             </div>

             <div className="mt-10 pt-10 border-t border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-3 text-red-600 font-black uppercase tracking-widest text-xs mb-4">
                   <AlertCircle className="w-5 h-5" />
                   Emergency Hotline
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed uppercase tracking-wider">
                   For immediate medical assistance, please contact the hotline. Operational 24 hours a day, 7 days a week.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
