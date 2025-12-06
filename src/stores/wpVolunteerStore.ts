/**
 * WordPress Volunteer Store
 * Adapter store używający WordPress Headless CMS jako źródło danych
 */

import { create } from 'zustand';
import { VolunteerOpportunity } from '@/types/volunteer.types';
import { getChallenges, cacheChallenges, isCacheValid, isWPConfigured } from '@/lib/wp-api';

// Import fallback data (lokalne dane jako backup)
import { volunteerOpportunities as fallbackData } from '@/data/volunteerData';

interface VolunteerStore {
  opportunities: VolunteerOpportunity[];
  loading: boolean;
  error: string | null;
  usingWordPress: boolean;
  fetchOpportunities: (category?: string) => Promise<void>;
  refreshOpportunities: () => Promise<void>;
}

export const useWPVolunteerStore = create<VolunteerStore>((set, get) => ({
  opportunities: [],
  loading: false,
  error: null,
  usingWordPress: false,

  fetchOpportunities: async (category?: string) => {
    // Sprawdź czy WordPress jest skonfigurowany
    const wpConfigured = isWPConfigured();

    // Jeśli WP nie jest skonfigurowany, użyj lokalnych danych
    if (!wpConfigured) {
      console.log('WordPress not configured, using local data');
      set({
        opportunities: fallbackData,
        loading: false,
        error: null,
        usingWordPress: false,
      });
      return;
    }

    // Sprawdź czy mamy aktualny cache
    if (isCacheValid() && get().opportunities.length > 0) {
      console.log('Using cached WordPress data');
      return;
    }

    set({ loading: true, error: null });

    try {
      console.log('Fetching opportunities from WordPress...');
      const data = await getChallenges(category);

      // Cache'uj dane
      cacheChallenges(data);

      set({
        opportunities: data,
        loading: false,
        error: null,
        usingWordPress: true,
      });

      console.log(`Loaded ${data.length} opportunities from WordPress`);
    } catch (error) {
      console.error('Error fetching from WordPress, using fallback data:', error);

      // W przypadku błędu użyj lokalnych danych
      set({
        opportunities: fallbackData,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        usingWordPress: false,
      });
    }
  },

  refreshOpportunities: async () => {
    // Wyczyść cache i pobierz świeże dane
    localStorage.removeItem('bydgo_challenges_cache');
    localStorage.removeItem('bydgo_challenges_cache_timestamp');

    await get().fetchOpportunities();
  },
}));
