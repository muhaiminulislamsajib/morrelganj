export type Language = 'en' | 'bn';

export interface Translation {
  en: string;
  bn: string;
}

export interface Category {
  id: string;
  name: Translation;
  icon: string;
  slug: string;
  order: number;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: Translation;
  slug: string;
}

export interface Listing {
  id: string;
  categoryId: string;
  subcategoryId?: string;
  title: Translation;
  description: Translation;
  phone?: string;
  whatsapp?: string;
  address?: string;
  mapUrl?: string;
  imageUrls: string[];
  businessHours?: string;
  tags: string[];
  isFeatured: boolean;
  isVerified: boolean;
  createdAt: any;
  status: 'published' | 'pending' | 'hidden';
}
