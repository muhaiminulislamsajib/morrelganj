/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Menu, X, Home, Grid, Bell, User, 
  MapPin, Phone, MessageSquare, ShieldCheck, 
  ChevronRight, ArrowLeft, Globe, Moon, Sun,
  PlusCircle, LayoutDashboard, Heart, Settings,
  ShieldAlert, Flame, Truck, HeartPulse, List, LayoutGrid,
  Lock, Trash2, Edit, CheckCircle2, ShieldX, Clock,
  Hospital, GraduationCap, Bus, Utensils, ShoppingBag, Users, Banknote, Store, Wrench, Star
} from 'lucide-react';
import { cn } from './lib/utils';
import { 
  collection, addDoc, getDocs, serverTimestamp, 
  updateDoc, deleteDoc, doc, query, where, orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db, signInWithGoogle } from './lib/firebase';
import { FirebaseProvider, useFirebase } from './contexts/FirebaseContext';
import { CategoryGrid } from './components/CategoryGrid';
import { CategoryHeader } from './components/CategoryView';
import { ListingDetail } from './components/ListingDetail';
import { ListingSubmission } from './components/ListingSubmission';

const iconMap: Record<string, any> = {
  'hospital': Hospital,
  'graduation-cap': GraduationCap,
  'bus': Bus,
  'shield-alert': ShieldAlert,
  'utensils': Utensils,
  'shopping-bag': ShoppingBag,
  'users': Users,
  'bank': Banknote,
  'store': Store,
  'wrench': Wrench,
  'grid': Grid
};

// --- Context & State ---
type Language = 'en' | 'bn';
const LanguageContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}>({ lang: 'en', setLang: () => {}, t: (k) => k });

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.categories': 'Categories',
    'nav.emergency': 'Emergency',
    'nav.profile': 'Profile',
    'hero.title': 'Everything in Morrelganj',
    'hero.subtitle': 'Find services, doctors, shops, and more in your town.',
    'search.placeholder': 'Search local services...',
    'section.popular': 'Popular Categories',
    'section.featured': 'Featured Highlights',
    'section.emergency': 'Quick Emergency Access',
    'section.trending': 'Trending Businesses',
    'button.call': 'Call',
    'button.whatsapp': 'WhatsApp',
    'common.viewAll': 'View All',
    'common.verified': 'Verified',
    'common.featured': 'Featured'
  },
  bn: {
    'nav.home': 'হোম',
    'nav.categories': 'ক্যাটাগরি',
    'nav.emergency': 'জরুরি',
    'nav.profile': 'প্রোফাইল',
    'hero.title': 'মোড়েলগঞ্জের সবকিছু এখানে',
    'hero.subtitle': 'আপনার শহরের সেবা, ডাক্তার, দোকান এবং আরও অনেক কিছু খুঁজুন।',
    'search.placeholder': 'স্থানীয় সেবা খুঁজুন...',
    'section.popular': 'জনপ্রিয় ক্যাটাগরি',
    'section.featured': 'বিশেষ হাইলাইটস',
    'section.emergency': 'জরুরি যোগাযোগ',
    'section.trending': 'আলোচিত ব্যবসায়',
    'button.call': 'কল করুন',
    'button.whatsapp': 'হোয়াটসঅ্যাপ',
    'common.viewAll': 'সবগুলো দেখুন',
    'common.verified': 'ভেরিফায়েড',
    'common.featured': 'ফিচারড'
  }
};

// --- Components ---

function Header() {
  const { lang, setLang, t } = useContext(LanguageContext);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-white dark:ring-zinc-900">
            M
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-emerald-950 dark:text-white leading-tight">Morrelganj</h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest leading-none">Digital OS</p>
          </div>
        </Link>

        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-emerald-600 transition-colors" />
            <input 
              type="text" 
              placeholder={t('search.placeholder')}
              className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <Globe className="w-4 h-4" />
            <span>{lang === 'en' ? 'BN' : 'EN'}</span>
          </button>
          
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <Link to="/admin" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </Link>

          <Link 
            to="/submit"
            className="hidden lg:flex px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-95 items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Submit Listing
          </Link>
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  const { t } = useContext(LanguageContext);
  const location = useLocation();

  const navItems = [
    { icon: Home, label: t('nav.home'), path: '/' },
    { icon: Grid, label: t('nav.categories'), path: '/categories' },
    { icon: Bell, label: t('nav.emergency'), path: '/emergency' },
    { icon: User, label: t('nav.profile'), path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 md:hidden pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <Link 
            key={item.label}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 flex-1 py-1 transition-colors",
              location.pathname === item.path ? "text-emerald-600 font-medium" : "text-zinc-500"
            )}
          >
            <item.icon className={cn("w-6 h-6", location.pathname === item.path && "animate-in zoom-in-75 duration-300")} />
            <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

function HomeHero() {
  const { t } = useContext(LanguageContext);
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-emerald-950 to-emerald-800 px-6 pt-20 pb-32 text-center rounded-b-[48px] md:rounded-b-[64px] shadow-2xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/5 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
          {t('hero.title')}
        </h1>
        <p className="text-lg md:text-xl text-emerald-100/80 mb-12 max-w-2xl mx-auto font-medium">
          {t('hero.subtitle')}
        </p>

        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
          <input 
            type="text" 
            placeholder={t('search.placeholder')}
            className="w-full h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl py-4 pl-14 pr-4 text-lg text-white placeholder-white/50 focus:ring-4 focus:ring-white/10 focus:bg-white/15 transition-all outline-none shadow-2xl"
          />
        </div>
      </motion.div>
    </section>
  );
}

function ListingCard({ listing }: { listing: any }) {
  const { lang, t } = useContext(LanguageContext);
  const displayImage = listing.imageUrls?.[0] || listing.image || 'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?auto=format&fit=crop&q=80&w=400';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 h-full flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={displayImage} 
          alt={listing.title[lang]}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {listing.isFeatured && (
            <div className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              {t('common.featured')}
            </div>
          )}
        </div>
        <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
            {listing.category || 'Local'}
          </span>
          {listing.isVerified && (
            <div className="flex items-center gap-1 text-blue-500 text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              Verified
            </div>
          )}
        </div>
        <h3 className="font-bold text-xl text-zinc-900 dark:text-white mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">
          {listing.title[lang]}
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 flex items-start gap-1.5 flex-1 line-clamp-2">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-zinc-400" />
          {listing.address}
        </p>
        <div className="flex gap-2 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button className="flex-1 bg-zinc-50 dark:bg-zinc-800 hover:bg-emerald-600 hover:text-white py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95">
            <Phone className="w-4 h-4" />
            {t('button.call')}
          </button>
          <button className="px-4 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 hover:bg-emerald-600 hover:text-white py-3 rounded-2xl transition-all flex items-center justify-center active:scale-95">
            <MessageSquare className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}


// --- Routing Components ---

function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useContext(LanguageContext);
  const { categories, listings } = useFirebase();
  
  const category = categories.find(c => c.slug === slug);
  const categoryName = category?.name[lang] || slug;
  
  const categoryListings = listings.filter(l => l.categoryId === category?.id);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
      <CategoryHeader title={categoryName || "Category"} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {categoryListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryListings.map(listing => (
              <Link key={listing.id} to={`/listing/${listing.id}`}>
                <ListingCard listing={listing} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
             <Grid className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
             <p className="text-zinc-500">No listings found in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ListingPage() {
  const { id } = useParams<{ id: string }>();
  const { listings } = useFirebase();
  const listing = listings.find(l => l.id === id);
  
  if (!listing) return <div className="p-20 text-center">Listing not found</div>;
  
  return <ListingDetail listing={listing} />;
}

function CategoriesPage() {
  const { lang, t } = useContext(LanguageContext);
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12">{t('nav.categories')}</h1>
        <CategoryGrid lang={lang} />
      </div>
    </div>
  );
}

function HomePage() {
  const { lang, t } = useContext(LanguageContext);
  const { featuredListings } = useFirebase();

  return (
    <div className="pb-32 bg-slate-50 dark:bg-zinc-950 min-h-screen">
      <HomeHero />
      
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(4,120,87,0.1)] border border-slate-100 dark:border-zinc-800 p-8">
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-emerald-600 rounded-full" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t('section.popular')}
              </h2>
            </div>
            <Link to="/categories" className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group">
              {t('common.viewAll')}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <CategoryGrid lang={lang} />
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 mt-24">
        <div className="flex items-center justify-between mb-10 px-2">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t('section.featured')}</h2>
          <div className="flex gap-2">
            <button className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors">
              <List className="w-5 h-5 text-slate-400" />
            </button>
            <button className="p-3 bg-emerald-700 text-white rounded-2xl shadow-lg shadow-emerald-900/20">
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredListings.length > 0 ? (
            featuredListings.map(listing => (
              <Link key={listing.id} to={`/listing/${listing.id}`}>
                <ListingCard listing={listing} />
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white dark:bg-zinc-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-zinc-800">
               <Grid className="w-12 h-12 text-slate-200 mx-auto mb-4" />
               <p className="text-slate-400 font-medium font-sans">No featured listings found.</p>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-24">
        <div className="bg-white dark:bg-zinc-950 rounded-[3rem] p-10 md:p-14 border border-slate-200 dark:border-zinc-900 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-xl shadow-red-600/20">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t('section.emergency')}</h2>
                <p className="text-slate-500 font-medium">Immediate help when you need it most</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Police', color: 'bg-red-50 text-red-600 border-red-100', icon: ShieldAlert },
                { name: 'Fire Service', color: 'bg-orange-50 text-orange-600 border-orange-100', icon: Flame },
                { name: 'Ambulance', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: Truck },
                { name: 'Blood Donor', color: 'bg-rose-50 text-rose-600 border-rose-100', icon: HeartPulse },
              ].map(item => (
                <button key={item.name} className={cn(
                  "group flex flex-col items-center justify-center gap-4 p-8 rounded-[2rem] border transition-all hover:scale-105 hover:shadow-xl",
                  item.color
                )}>
                  <item.icon className="w-10 h-10 transition-transform group-hover:rotate-12" />
                  <span className="text-base font-bold uppercase tracking-wider">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


function AdminPanel() {
  const { user, categories, featuredListings, listings: publishedListings } = useFirebase();
  const [isSeeding, setIsSeeding] = useState(false);
  const [pendingListings, setPendingListings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'stats' | 'pending' | 'all-listings' | 'categories'>('stats');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name_en: '', name_bn: '', icon: 'grid', slug: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'categories'), {
        name: { en: categoryForm.name_en, bn: categoryForm.name_bn },
        icon: categoryForm.icon,
        slug: categoryForm.slug || categoryForm.name_en.toLowerCase().replace(/\s+/g, '-'),
        createdAt: serverTimestamp(),
      });
      setShowAddCategory(false);
      setCategoryForm({ name_en: '', name_bn: '', icon: 'grid', slug: '' });
      alert("Category added!");
    } catch (err) {
      alert("Error adding category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Fetch pending listings when admin is authenticated
  useEffect(() => {
    if (!isAdminAuthenticated) return;

    const q = query(
      collection(db, 'listings'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    
    const unsub = onSnapshot(q, (snap) => {
      setPendingListings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [isAdminAuthenticated]);

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, 'listings', id), {
        status: 'published',
        isVerified: true
      });
      alert("Listing approved and published!");
    } catch (err) {
      alert("Error approving listing.");
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;
    try {
      await deleteDoc(doc(db, 'listings', id));
      alert("Submission rejected and deleted.");
    } catch (err) {
      alert("Error rejecting listing.");
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'listings', id), {
        isFeatured: !current
      });
    } catch (err) {
      alert("Error updating featured status.");
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const resp = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await resp.json();
      if (data.success) {
        setIsAdminAuthenticated(true);
      } else {
        alert("Invalid admin credentials.");
      }
    } catch (err) {
      alert("Verification failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-emerald-700" />
        </div>
        <h1 className="text-3xl font-black mb-4">Admin Portal</h1>
        <p className="text-slate-500 mb-8 font-medium">Restricted to Morrelganj administrators. Please authenticate to continue.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left mb-4">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Admin Email</label>
            <input 
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none mt-2"
              placeholder="admin@morrelganj.com"
            />
          </div>
          <div className="text-left mb-6">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Admin Password</label>
            <input 
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none mt-2"
              placeholder="••••••••••••"
            />
          </div>
          <button 
            type="submit"
            disabled={isVerifying}
            className="w-full h-16 bg-emerald-700 hover:bg-emerald-800 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-900/20 transition-all disabled:opacity-50"
          >
            {isVerifying ? 'Verifying...' : 'Unlock Dashboard'}
          </button>
        </form>
      </div>
    );
  }

  const handleRejectCategory = async (id: string) => {
    if (!confirm("Delete this category? This will not delete listings but they will lose their category link.")) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
      alert("Category deleted.");
    } catch (err) {
      alert("Error deleting category.");
    }
  };

  const seedData = async () => {
    setIsSeeding(true);
    try {
      const SYSTEM_CATEGORIES = [
        { id: '1', name: { en: 'Hospitals', bn: 'হাসপাতাল' }, icon: 'hospital', slug: 'hospitals' },
        { id: '2', name: { en: 'Education', bn: 'শিক্ষা' }, icon: 'graduation-cap', slug: 'education' },
        { id: '3', name: { en: 'Transport', bn: 'পরিবহন' }, icon: 'bus', slug: 'transport' },
        { id: '4', name: { en: 'Emergency', bn: 'জরুরি' }, icon: 'shield-alert', slug: 'emergency' },
        { id: '5', name: { en: 'Dining', bn: 'খাবার' }, icon: 'utensils', slug: 'dining' },
        { id: '6', name: { en: 'Shopping', bn: 'কেনাকাটা' }, icon: 'store', slug: 'shopping' },
        { id: '7', name: { en: 'Public Support', bn: 'জনসেবা' }, icon: 'users', slug: 'public-support' },
        { id: '8', name: { en: 'Banks & ATM', bn: 'ব্যাংক ও এটিএম' }, icon: 'bank', slug: 'banks' },
        { id: '9', name: { en: 'Daily Needs', bn: 'নিত্যপ্রয়োজনীয়' }, icon: 'shopping-bag', slug: 'daily-needs' },
        { id: '10', name: { en: 'Technical Support', bn: 'টেকনিক্যাল সাপোর্ট' }, icon: 'wrench', slug: 'tech-support' },
      ];

      const catSnap = await getDocs(collection(db, 'categories'));
      
      // If user wants to seed, we let them even if not empty, by skipping already existing slugs
      const existingSlugs = catSnap.docs.map(d => d.data().slug);
      
      let count = 0;
      for (const cat of SYSTEM_CATEGORIES) {
        if (!existingSlugs.includes(cat.slug)) {
          await addDoc(collection(db, 'categories'), {
            name: cat.name,
            icon: cat.icon,
            slug: cat.slug,
            order: parseInt(cat.id),
            createdAt: serverTimestamp()
          });
          count++;
        }
      }
      
      if (count > 0) {
        alert(`${count} system categories seeded.`);
      } else {
        alert("All system categories already exist.");
      }
    } catch (err) {
      console.error(err);
      alert("Error seeding: " + (err as Error).message);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <Link to="/" className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:bg-emerald-600 hover:text-white transition-all">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Morrelganj CMS</h1>
            <p className="text-slate-500 font-medium tracking-wide uppercase text-xs mt-1">Management Dashboard</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={seedData}
            disabled={isSeeding}
            className="px-6 py-3 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
          >
            {isSeeding ? 'Seeding...' : 'Seed System Categories'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'stats', label: 'Overview', icon: LayoutDashboard },
          { id: 'pending', label: `Pending (${pendingListings.length})`, icon: Clock },
          { id: 'all-listings', label: 'Manage Data', icon: List },
          { id: 'categories', label: 'Categories', icon: Grid }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap",
              activeTab === tab.id 
                ? "bg-emerald-700 text-white shadow-xl shadow-emerald-900/20" 
                : "bg-white dark:bg-zinc-900 text-slate-400 hover:text-emerald-700 border border-slate-100 dark:border-zinc-800"
            )}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'all-listings' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search listings to manage..." 
                className="w-full h-16 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl pl-12 pr-6 font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none"
              />
            </div>
            <Link to="/submit" className="h-16 px-8 bg-emerald-700 text-white flex items-center justify-center gap-2 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all">
              <PlusCircle className="w-5 h-5" /> Add New
            </Link>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-800/50">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Listing Info</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                {publishedListings.map(listing => (
                  <tr key={listing.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                          <img src={listing.imageUrls?.[0] || 'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?auto=format&fit=crop&q=80&w=400'} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-black text-slate-900 dark:text-white leading-tight">{listing.title?.en}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{listing.union}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-slate-500">{categories.find(c => c.id === listing.categoryId)?.name.en || 'General'}</span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex gap-2">
                         {listing.isVerified && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                         {listing.isFeatured && <Star className="w-4 h-4 text-amber-500 fill-current" />}
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-3">
                         <button onClick={() => toggleFeatured(listing.id, listing.isFeatured)} className={cn("p-2 rounded-lg transition-colors", listing.isFeatured ? "bg-amber-100 text-amber-600" : "bg-slate-100 dark:bg-zinc-800 text-slate-400")}>
                           <Heart className={cn("w-4 h-4", listing.isFeatured && "fill-current")} />
                         </button>
                         <button className="p-2 bg-slate-100 dark:bg-zinc-800 text-slate-400 hover:text-emerald-700 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                         <button onClick={() => handleReject(listing.id)} className="p-2 bg-slate-100 dark:bg-zinc-800 text-slate-400 hover:text-red-600 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {[
              { label: 'Live Listings', value: publishedListings.length, icon: Grid, color: 'text-blue-500' },
              { label: 'Verification Queue', value: pendingListings.length, icon: ShieldAlert, color: 'text-amber-500' },
              { label: 'Total Categories', value: categories.length, icon: ShieldCheck, color: 'text-emerald-500' },
              { label: 'Featured Items', value: featuredListings.length, icon: Heart, color: 'text-rose-500' },
            ].map(stat => (
              <div key={stat.label} className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className={cn("p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800", stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Real-time</span>
                </div>
                <div className="text-4xl font-black mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-slate-100 dark:border-zinc-800 shadow-sm">
              <h3 className="text-2xl font-black mb-8">System Overview</h3>
              <div className="aspect-[21/9] bg-slate-50 dark:bg-zinc-800/50 rounded-3xl flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-sm">
                Operational Status: Healthy
              </div>
            </div>
            <div className="bg-emerald-950 p-10 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl">
              <div>
                <h3 className="text-2xl font-black mb-4">Quick Actions</h3>
                <p className="text-emerald-400 text-sm font-medium leading-relaxed">Regularly monitor the queue to maintain platform quality.</p>
              </div>
              <div className="space-y-3 mt-10">
                <button onClick={() => setActiveTab('pending')} className="w-full py-4 bg-white text-emerald-950 font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all">Review Submissions</button>
                <button className="w-full py-4 bg-emerald-800/50 text-emerald-400 font-black uppercase tracking-widest rounded-2xl border border-emerald-700/50">Export Data</button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'pending' && (
        <div className="space-y-6">
          {pendingListings.length > 0 ? pendingListings.map(listing => (
            <div key={listing.id} className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 p-8 shadow-sm group hover:shadow-xl transition-all">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-48 aspect-square rounded-3xl bg-slate-100 dark:bg-zinc-800 overflow-hidden shrink-0">
                  <img src={listing.imageUrls?.[0] || 'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?auto=format&fit=crop&q=80&w=400'} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-lg">New Submission</span>
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{listing.union}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{listing.title?.en}</h3>
                  <p className="text-slate-500 font-medium mb-6 line-clamp-2">{listing.description_en || listing.address}</p>
                  
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => handleApprove(listing.id)} className="px-6 py-3 bg-emerald-700 text-white font-black uppercase tracking-widest rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-95 transition-all">
                      <CheckCircle2 className="w-4 h-4" /> Approve & Verify
                    </button>
                    <button onClick={() => handleReject(listing.id)} className="px-6 py-3 bg-white dark:bg-zinc-800 text-red-600 border border-red-100 dark:border-red-900/30 font-black uppercase tracking-widest rounded-xl text-xs flex items-center gap-2 active:scale-95 transition-all">
                      <Trash2 className="w-4 h-4" /> Reject
                    </button>
                    <button className="px-6 py-3 bg-slate-50 dark:bg-zinc-800 text-slate-600 font-black uppercase tracking-widest rounded-xl text-xs flex items-center gap-2 active:scale-95 transition-all">
                      <Edit className="w-4 h-4" /> Edit Details
                    </button>
                  </div>
                </div>
                <div className="w-full md:w-64 p-6 bg-slate-50 dark:bg-zinc-800 rounded-3xl">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Contact Info</div>
                   <div className="flex items-center gap-3 mb-3">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-bold">{listing.phone}</span>
                   </div>
                   {listing.whatsapp && (
                     <div className="flex items-center gap-3">
                        <MessageSquare className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-bold">{listing.whatsapp}</span>
                     </div>
                   )}
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-32 bg-white dark:bg-zinc-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-zinc-800">
               <ShieldCheck className="w-16 h-16 text-slate-200 mx-auto mb-6" />
               <h3 className="text-xl font-black uppercase tracking-[0.2em] text-slate-300">Verification Queue Clear</h3>
               <p className="text-slate-400 font-medium mt-2">No pending listings to review at the moment.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-8">
          {showAddCategory && (
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-xl animate-in slide-in-from-top duration-300">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black">Add New Category</h3>
                <button onClick={() => setShowAddCategory(false)} className="p-2 bg-slate-100 dark:bg-zinc-800 rounded-full hover:bg-red-50 transition-colors">
                  <X className="w-5 h-5 text-slate-400 hover:text-red-600" />
                </button>
              </div>
              <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Name (English)</label>
                    <input 
                      type="text" 
                      required
                      value={categoryForm.name_en}
                      onChange={(e) => setCategoryForm({...categoryForm, name_en: e.target.value})}
                      className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Name (Bengali)</label>
                    <input 
                      type="text" 
                      required
                      value={categoryForm.name_bn}
                      onChange={(e) => setCategoryForm({...categoryForm, name_bn: e.target.value})}
                      className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Icon Identifier</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. hospital, store, bus"
                      value={categoryForm.icon}
                      onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
                      className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">URL Slug (Optional)</label>
                    <input 
                      type="text" 
                      value={categoryForm.slug}
                      onChange={(e) => setCategoryForm({...categoryForm, slug: e.target.value})}
                      className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold"
                    />
                 </div>
                 <div className="md:col-span-2">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-16 bg-emerald-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-900/20 disabled:opacity-50 transition-all"
                    >
                      {isSubmitting ? "Saving..." : "Create Category"}
                    </button>
                 </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button 
              onClick={() => setShowAddCategory(true)}
              className="aspect-[3/2] flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-zinc-900 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-[2.5rem] hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group"
            >
              <PlusCircle className="w-10 h-10 text-slate-300 group-hover:text-emerald-600 transition-colors" />
              <span className="text-sm font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-700">Add New Category</span>
            </button>
            {categories.map(cat => {
              const Icon = iconMap[cat.icon] || Grid;
              return (
                <div key={cat.id} className="aspect-[3/2] group bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] p-8 relative overflow-hidden shadow-sm hover:shadow-xl transition-all">
                  <div className="absolute top-0 right-0 p-4 flex gap-2">
                    <button className="p-2 text-slate-300 hover:text-emerald-600"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleRejectCategory(cat.id)} className="p-2 text-slate-300 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-emerald-700 mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tight">{cat.name.en}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">{cat.name.bn}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


export default function App() {
  const [lang, setLang] = useState<Language>('bn');

  const t = (key: string) => {
    return translations[lang][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <FirebaseProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-emerald-100 dark:selection:bg-emerald-900/30">
            <Header />
            <AnimatePresence mode="wait">
              <main className="min-h-screen">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/submit" element={<ListingSubmission />} />
                  <Route path="/category/:slug" element={<CategoryPage />} />
                  <Route path="/listing/:id" element={<ListingPage />} />
                  <Route path="/emergency" element={<div className="p-20 text-center text-2xl font-bold">Emergency Portal Coming Soon</div>} />
                  <Route path="/categories" element={<CategoriesPage />} />
                </Routes>
              </main>
            </AnimatePresence>
            <MobileNav />

          
          <footer className="bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-20 px-4 hidden md:block">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">M</span>
                  </div>
                  <span className="font-bold text-2xl tracking-tight text-zinc-900 dark:text-white">
                    Morrelganj
                  </span>
                </div>
                <p className="text-zinc-500 max-w-sm mb-8">
                  The complete digital operating system for Morrelganj. Empowering citizens through information and technology.
                </p>
                <div className="flex gap-4">
                  {['Facebook', 'Twitter', 'YouTube'].map(social => (
                    <div key={social} className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:border-emerald-500 transition-colors cursor-pointer">
                      <span className="text-[10px] font-bold">{social[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-zinc-400">Services</h4>
                <ul className="space-y-4 text-zinc-600 dark:text-zinc-400">
                  {['Business Directory', 'Emergency Contacts', 'Blood Bank', 'Local News', 'Live Transport'].map(item => (
                     <li key={item} className="hover:text-emerald-600 transition-colors cursor-pointer">{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-zinc-400">About</h4>
                <ul className="space-y-4 text-zinc-600 dark:text-zinc-400">
                  {['Project Goal', 'Privacy Policy', 'Terms of Service', 'Contact Admin', 'Submit Listing'].map(item => (
                     <li key={item} className="hover:text-emerald-600 transition-colors cursor-pointer">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500">
              © 2026 Morrelganj. All rights reserved. Designed with ❤️ for the people of Morrelganj.
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </FirebaseProvider>
  </LanguageContext.Provider>
);
}

