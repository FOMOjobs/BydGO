import { PathCategory } from '@/stores/appStore';

export interface Checkpoint {
  id: string;
  order: number;
  title: string;
  coordinates: [number, number];
  story: string;
  task: string;
  answer: string;
  hint?: string;
  imageUrl?: string;
  accessibleFromHome?: boolean;
  audio?: string;
}

export interface Path {
  id: string;
  title: string;
  description: string;
  type: 'field' | 'virtual';
  category: PathCategory;
  difficulty?: 'easy' | 'medium' | 'hard';
  estimatedTime?: string;
  checkpoints: Checkpoint[];
  imageUrl?: string;
  verified: boolean;
  verifiedBy?: string;
  accessibleFromHome?: boolean;
}

export const STATIC_CATEGORY_LABELS: Record<PathCategory, string> = {
  'legendy': 'Legendy',
  'pomniki': 'Pomniki',
  'ciekawostki': 'Ciekawostki',
  'historia-xx': 'Historia XX w.',
  'historia-wspolczesna': 'Historia Współczesna',
};

export const STATIC_CATEGORY_COLORS: Record<PathCategory, string> = {
  'legendy': 'bg-purple-500',
  'pomniki': 'bg-blue-500',
  'ciekawostki': 'bg-amber-500',
  'historia-xx': 'bg-red-500',
  'historia-wspolczesna': 'bg-emerald-500',
};


export const API_URL = 'https://bydgo.lisowska26.com/wp-json/wp/v2/scenariusz';

export interface WPScenariusz {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: {
    opis: string;
    lokalizacja: {
      lat: number;
      lng: number;
      address: string;
      zoom: number;
      place_id: string;
      city: string;
      state: string;
      post_code: string;
      country: string;
    };
    wirtualny: boolean;
    relacja: Array<{
      ID: number;
      post_title: string;
      acf?: any;
    }>;
  };
  punkty_details?: Array<{ // Made optional
    id: number;
    title: string;
    acf: {
      tytul: string;
      lokalizacja: {
        lat: number;
        lng: number;
        address: string;
      };
      foto?: string;
      opis?: string;
      audio?: string;
      zagadka?: string;
      odpowiedz?: string;
    };
  }>;
}

export const mapWPScenariuszToPath = (wp: WPScenariusz): Path => {
  const checkpoints: Checkpoint[] = (wp.punkty_details || []).map((p, index) => ({ // Added null check
    id: p.id.toString(),
    order: index + 1,
    title: p.acf.tytul || 'Atrakcja',
    coordinates: [p.acf.lokalizacja.lat || 52, p.acf.lokalizacja.lng || 18],
    story: p.acf.opis || '',
    task: p.acf.zagadka || '',
    answer: p.acf.odpowiedz || '',
    imageUrl: p.acf.foto || '',
    accessibleFromHome: wp.acf.wirtualny || true, // Added default
    audio: p.acf.audio || '', // Added default
  }));

  return {
    id: wp.id.toString(),
    title: wp.title.rendered,
    description: wp.acf.opis,
    type: wp.acf.wirtualny ? 'virtual' : 'field',
    category: 'ciekawostki', // Default category
    verified: true,
    checkpoints,
    imageUrl: checkpoints[0]?.imageUrl,
    accessibleFromHome: wp.acf.wirtualny,
  };
};
