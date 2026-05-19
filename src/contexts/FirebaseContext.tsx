import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, query, onSnapshot, orderBy, 
  where, addDoc, updateDoc, deleteDoc, doc,
  limit
} from 'firebase/firestore';
import { db, auth } from '@/src/lib/firebase';
import { Category, Listing, Subcategory } from '@/src/types';

interface FirebaseContextType {
  categories: Category[];
  listings: Listing[];
  featuredListings: Listing[];
  loading: boolean;
  user: any;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((u) => {
      setUser(u);
    });

    const categoriesQuery = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const unsubCategories = onSnapshot(categoriesQuery, (snapshot) => {
      setCategories(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Category)));
      setLoading(false);
    });

    const listingsQuery = query(
      collection(db, 'listings'), 
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const unsubListings = onSnapshot(listingsQuery, (snapshot) => {
      setListings(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Listing)));
    });

    const featuredQuery = query(
      collection(db, 'listings'), 
      where('isFeatured', '==', true),
      where('status', '==', 'published'),
      limit(6)
    );
    const unsubFeatured = onSnapshot(featuredQuery, (snapshot) => {
      setFeaturedListings(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Listing)));
    });

    return () => {
      unsubAuth();
      unsubCategories();
      unsubListings();
      unsubFeatured();
    };
  }, []);

  return (
    <FirebaseContext.Provider value={{ categories, listings, featuredListings, loading, user }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) throw new Error('useFirebase must be used within FirebaseProvider');
  return context;
}
