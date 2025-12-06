// types.ts
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
    punkty_details: Array<{
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
  
  export interface Checkpoint {
    id: string;
    order: number;
    title: string;
    coordinates: [number, number];
    story: string;
    task?: string;
    answer?: string;
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
    category: string; // WP nie daje kategorii wprost, więc string
    difficulty?: 'easy' | 'medium' | 'hard';
    estimatedTime?: string;
    checkpoints: Checkpoint[];
    imageUrl?: string;
    verified?: boolean;
    accessibleFromHome?: boolean;
  }
  