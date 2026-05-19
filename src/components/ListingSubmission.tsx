import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Upload, CheckCircle, 
  Building2, MessageSquare, Phone, MapPin, 
  Tags, Info, Clock, Check
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useFirebase } from '../contexts/FirebaseContext';
import { UNIONS } from '../constants';
import { cn } from '../lib/utils';

export function ListingSubmission() {
  const { categories } = useFirebase();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    categoryId: '',
    union: UNIONS[0],
    title_en: '',
    title_bn: '',
    address: '',
    phone: '',
    whatsapp: '',
    description_en: '',
    businessHours: '',
    tags: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert("Please select a category");
      return;
    }
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'listings'), {
        ...formData,
        status: 'pending', // Requires admin approval
        createdAt: serverTimestamp(),
        title: {
          en: formData.title_en,
          bn: formData.title_bn || formData.title_en
        },
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        isVerified: false,
        isFeatured: false
      });
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Error submitting listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 animate-bounce">
          <CheckCircle className="w-12 h-12 text-emerald-700" />
        </div>
        <h1 className="text-4xl font-black mb-4">Submission Received!</h1>
        <p className="text-slate-500 mb-12 text-lg font-medium">Thank you for contributing to Morrelganj. Your listing has been sent for review and will be published shortly after verification.</p>
        <Link 
          to="/"
          className="inline-block px-12 py-5 bg-emerald-700 text-white font-black uppercase tracking-widest rounded-3xl shadow-xl shadow-emerald-900/20 hover:scale-105 active:scale-95 transition-all"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-32">
      <div className="max-w-4xl mx-auto px-6 pt-16">
        <Link to="/" className="flex items-center gap-3 text-slate-500 hover:text-emerald-700 transition-all font-bold group mb-10">
          <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          Back to Directory
        </Link>
        
        <div className="mb-12">
          <h1 className="text-5xl font-black mb-4 text-slate-900">Add to Morrelganj</h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">Help us build the most comprehensive directory for our town. Fill out the details below to submit a new service or business.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Category */}
          <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-700">
                <Tags className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black">1. Choose Category</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({...formData, categoryId: cat.id})}
                  className={cn(
                    "flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all",
                    formData.categoryId === cat.id 
                      ? "bg-emerald-700 border-emerald-700 text-white shadow-xl shadow-emerald-900/20" 
                      : "bg-slate-50 border-slate-100 text-slate-600 hover:border-emerald-200"
                  )}
                >
                  <Tags className={cn("w-8 h-8", formData.categoryId === cat.id ? "text-white" : "text-slate-400")} />
                  <span className="font-bold text-xs uppercase tracking-widest">{cat.name.en}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Information */}
          <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-700">
                <Info className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black">2. Essential Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 px-2">Union / Area</label>
                <select 
                  value={formData.union}
                  onChange={(e) => setFormData({...formData, union: e.target.value})}
                  className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white outline-none transition-all appearance-none"
                >
                  {UNIONS.map(union => (
                    <option key={union} value={union}>{union}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 px-2">Specific Address</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Near Ferry Ghat, Sadar"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 px-2">Name (English)</label>
                <input 
                  type="text"
                  required
                  value={formData.title_en}
                  onChange={(e) => setFormData({...formData, title_en: e.target.value})}
                  className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 px-2">Name (Bengali - Optional)</label>
                <input 
                  type="text"
                  value={formData.title_bn}
                  onChange={(e) => setFormData({...formData, title_bn: e.target.value})}
                  className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 px-2">Phone Number</label>
                <input 
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 px-2">WhatsApp (Optional)</label>
                <input 
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 px-2">Short Description</label>
              <textarea 
                rows={4}
                value={formData.description_en}
                onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-6 font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white outline-none transition-all resize-none"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full h-20 bg-emerald-700 hover:bg-emerald-800 text-white font-black uppercase tracking-[0.2em] rounded-[2.5rem] shadow-2xl shadow-emerald-900/40 disabled:opacity-50 transition-all flex items-center justify-center gap-4 group"
          >
            {loading ? "Submitting..." : (
              <>
                Submit for Verification
                <Check className="w-6 h-6 transition-transform group-hover:scale-125" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
