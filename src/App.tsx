/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Menu, X, Home, Grid, Bell, User, 
  MapPin, Phone, MessageSquare, ShieldCheck, 
  ChevronRight, ArrowLeft, Globe, Moon, Sun,
  PlusCircle, LayoutDashboard, Heart, Settings,
  ShieldAlert, Flame, Truck, HeartPulse, List, LayoutGrid,
  Lock
} from 'lucide-react';
import { cn } from './lib/utils';

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

// --- Mock Data ---
const MOCK_CATEGORIES = [
  { id: '1', name: { en: 'Hospitals', bn: 'হাসপাতাল' }, icon: 'hospital', slug: 'hospitals' },
  { id: '2', name: { en: 'Education', bn: 'শিক্ষা' }, icon: 'graduation-cap', slug: 'education' },
  { id: '3', name: { en: 'Transport', bn: 'পরিবহন' }, icon: 'bus', slug: 'transport' },
  { id: '4', name: { en: 'Emergency', bn: 'জরুরি' }, icon: 'shield-alert', slug: 'emergency' },
  { id: '5', name: { en: 'Dining', bn: 'খাবার' }, icon: 'utensils', slug: 'dining' },
  { id: '6', name: { en: 'Shopping', bn: 'কেনাকাটা' }, icon: 'shopping-bag', slug: 'shopping' },
];

const MOCK_LISTINGS = [
  {
    id: '1',
    title: { en: 'Morrelganj Upazila Health Complex', bn: 'মোড়েলগঞ্জ উপজেলা স্বাস্থ্য কমপ্লেক্স' },
    address: 'Morrelganj Main Road',
    phone: '01712345678',
    isVerified: true,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1586773860418-d319a241f211?auto=format&fit=crop&q=80&w=400',
    category: 'Hospitals'
  },
  {
    id: '2',
    title: { en: 'Sunrise Private Clinic', bn: 'সানরাইজ প্রাইভেট ক্লিনিক' },
    address: 'Hospital Quarter Area',
    phone: '01711112222',
    isVerified: true,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400',
    category: 'Hospitals'
  }
];

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

import { Star } from 'lucide-react';

import { FirebaseProvider, useFirebase } from './contexts/FirebaseContext';
import { CategoryGrid } from './components/CategoryGrid';
import { CategoryHeader } from './components/CategoryView';
import { ListingDetail } from './components/ListingDetail';
import { useParams } from 'react-router-dom';

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
            MOCK_LISTINGS.map(listing => (
              <Link key={listing.id} to={`/listing/${listing.id}`}>
                <ListingCard listing={listing} />
              </Link>
            ))
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

import { 
  collection, addDoc, getDocs, serverTimestamp 
} from 'firebase/firestore';
import { db, signInWithGoogle } from './lib/firebase';

function AdminPanel() {
  const { user } = useFirebase();
  const [isSeeding, setIsSeeding] = useState(false);

  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const resp = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, password })
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
        
        {!user ? (
          <button 
            onClick={signInWithGoogle}
            className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-900/20 transition-all flex items-center justify-center gap-3"
          >
            <User className="w-5 h-5" />
            Sign In with Google
          </button>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
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
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50"
            >
              {isVerifying ? 'Verifying...' : 'Unlock Dashboard'}
            </button>
          </form>
        )}
      </div>
    );
  }

  const seedData = async () => {
    setIsSeeding(true);
    try {
      // 1. Check if categories exist
      const catSnap = await getDocs(collection(db, 'categories'));
      if (catSnap.empty) {
        console.log("Seeding categories...");
        for (const cat of MOCK_CATEGORIES) {
          const docRef = await addDoc(collection(db, 'categories'), {
            name: cat.name,
            icon: cat.icon,
            slug: cat.slug,
            order: parseInt(cat.id)
          });
          
          // Seed some listings for this category
          const relevantMockListings = MOCK_LISTINGS.filter(l => l.category === cat.name.en);
          for (const listing of relevantMockListings) {
             await addDoc(collection(db, 'listings'), {
                categoryId: docRef.id,
                title: listing.title,
                address: listing.address,
                phone: listing.phone,
                isVerified: listing.isVerified,
                isFeatured: listing.isFeatured,
                imageUrls: [listing.image],
                status: 'published',
                createdAt: serverTimestamp()
             });
          }
        }
        alert("Success! Initial data seeded to Firestore.");
      } else {
        alert("Data already exists in Firestore.");
      }
    } catch (err) {
      console.error(err);
      alert("Error seeding data. Check console.");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <button 
          onClick={seedData}
          disabled={isSeeding}
          className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
        >
          {isSeeding ? 'Seeding...' : 'Seed Initial Data'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Listings', value: '1,240', icon: Grid, color: 'text-blue-500' },
          { label: 'Pending Approval', value: '12', icon: ShieldCheck, color: 'text-amber-500' },
          { label: 'Total Views', value: '45.2K', icon: LayoutDashboard, color: 'text-emerald-500' },
          { label: 'Featured Ads', value: '8', icon: Heart, color: 'text-rose-500' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={cn("w-6 h-6", stat.color)} />
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Growth</span>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-zinc-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            Add New Record
          </h3>
          <div className="space-y-4">
            <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-colors">
              New Business Listing
            </button>
            <button className="w-full py-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-bold rounded-2xl transition-colors">
              New Category / Subcategory
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                  <div>
                    <div className="font-bold text-sm">New Listing: Al-Madina Hotel</div>
                    <div className="text-xs text-zinc-500">2 minutes ago</div>
                  </div>
                </div>
                <button className="text-emerald-600 text-xs font-bold uppercase tracking-widest">Review</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { ListingSubmission } from './components/ListingSubmission';

// --- Root App ---

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

