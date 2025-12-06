/**
 * WordPress REST API Service
 * Serwis do komunikacji z Headless WordPress backendem
 */

import { VolunteerOpportunity } from '@/types/volunteer.types';

// Konfiguracja WordPress API
const WP_API_URL = import.meta.env.VITE_WP_API_URL || 'https://your-wordpress-site.com/wp-json';
const WP_REST_NAMESPACE = 'wp/v2';
const WP_CUSTOM_NAMESPACE = 'bydgo/v1';

/**
 * Interfejs dla surowych danych z WordPress API
 */
interface WPChallenge {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  featured_media: number;
  featured_media_url?: string;
  acf: {
    location_name: string;
    location_coords: string;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    secret_code?: string;
    image_url?: string;
    category: 'education' | 'ecology' | 'sport' | 'culture' | 'social' | 'health';
    requirements?: string;
    benefits?: string;
    contact_email?: string;
    organization?: string;
    max_volunteers?: number;
    current_volunteers?: number;
    time_commitment?: string;
    date_start?: string;
    date_end?: string;
    is_urgent?: boolean;
  };
}

/**
 * Interfejs dla statystyk gry
 */
interface GameStats {
  total_challenges: number;
  total_participants: number;
  city: string;
  game_name: string;
}

/**
 * Parsowanie współrzędnych GPS ze stringa do tablicy
 * @param coords - String w formacie "lat,lng" np. "53.1235,18.0084"
 * @returns Tablica [lng, lat] dla zgodności z formatem GeoJSON
 */
function parseCoordinates(coords: string): [number, number] {
  const parts = coords.split(',').map(c => parseFloat(c.trim()));
  if (parts.length !== 2 || parts.some(isNaN)) {
    console.warn(`Invalid coordinates format: ${coords}, using default Bydgoszcz center`);
    return [18.0084, 53.1235]; // Domyślne: Wyspa Młyńska, Bydgoszcz
  }
  // WordPress format: lat,lng -> App format: [lng, lat]
  return [parts[1], parts[0]];
}

/**
 * Parsowanie listy z textarea (każda linia = element tablicy)
 */
function parseTextareaList(text?: string): string[] {
  if (!text) return [];
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

/**
 * Mapowanie danych z WordPress na format aplikacji
 * @param wpChallenge - Surowe dane z WP REST API
 * @returns Obiekt VolunteerOpportunity
 */
function mapWPChallengeToOpportunity(wpChallenge: WPChallenge): VolunteerOpportunity {
  const acf = wpChallenge.acf;

  // Wybór URL obrazu: ACF image_url > featured_media_url > placeholder
  const imageUrl = acf.image_url ||
                   wpChallenge.featured_media_url ||
                   `https://source.unsplash.com/800x600/?${acf.category},city`;

  // Parsowanie dat
  const dateStart = acf.date_start || new Date().toISOString().split('T')[0];
  const dateEnd = acf.date_end || '2025-12-31';

  return {
    id: `wp-${wpChallenge.id}`,
    title: wpChallenge.title.rendered,
    description: wpChallenge.content.rendered.replace(/<[^>]*>/g, ''), // Strip HTML tags
    organization: acf.organization || 'BydGO! - Ścieżki Pamięci',
    category: acf.category,
    location: {
      address: acf.location_name,
      coordinates: parseCoordinates(acf.location_coords),
    },
    date: {
      start: dateStart,
      end: dateEnd,
    },
    requirements: parseTextareaList(acf.requirements),
    benefits: parseTextareaList(acf.benefits),
    contactEmail: acf.contact_email || 'gra@bydgo.bydgoszcz.pl',
    maxVolunteers: acf.max_volunteers || 100,
    currentVolunteers: acf.current_volunteers || 0,
    imageUrl: imageUrl,
    isUrgent: acf.is_urgent || false,
    difficulty: acf.difficulty,
    timeCommitment: acf.time_commitment || '1-2 godziny',
  };
}

/**
 * Pobieranie wszystkich wyzwań z WordPress
 * @param category - Opcjonalny filtr po kategorii
 * @returns Promise z tablicą wyzwań
 */
export async function getChallenges(category?: string): Promise<VolunteerOpportunity[]> {
  try {
    // Budowanie URL z parametrami
    const params = new URLSearchParams({
      acf_format: 'standard',
      per_page: '100',
      _embed: 'true', // Włącz embedded resources (featured image)
    });

    if (category && category !== 'all') {
      params.append('acf[category]', category);
    }

    const url = `${WP_API_URL}/${WP_REST_NAMESPACE}/wyzwania?${params.toString()}`;

    console.log('Fetching challenges from WordPress:', url);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }

    const data: WPChallenge[] = await response.json();

    console.log(`Fetched ${data.length} challenges from WordPress`);

    // Mapowanie danych WordPress na format aplikacji
    const opportunities = data.map(mapWPChallengeToOpportunity);

    return opportunities;
  } catch (error) {
    console.error('Error fetching challenges from WordPress:', error);

    // Fallback: zwróć puste dane lub dane z localStorage
    const cachedData = localStorage.getItem('bydgo_challenges_cache');
    if (cachedData) {
      console.log('Using cached challenges data');
      return JSON.parse(cachedData);
    }

    throw error;
  }
}

/**
 * Pobieranie pojedynczego wyzwania po ID
 * @param id - ID wyzwania (może być z prefixem 'wp-')
 * @returns Promise z danymi wyzwania
 */
export async function getChallenge(id: string): Promise<VolunteerOpportunity | null> {
  try {
    // Usuń prefix 'wp-' jeśli istnieje
    const wpId = id.replace('wp-', '');

    const url = `${WP_API_URL}/${WP_REST_NAMESPACE}/wyzwania/${wpId}?acf_format=standard&_embed=true`;

    console.log('Fetching single challenge from WordPress:', url);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Challenge with ID ${wpId} not found`);
        return null;
      }
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }

    const data: WPChallenge = await response.json();

    return mapWPChallengeToOpportunity(data);
  } catch (error) {
    console.error('Error fetching challenge from WordPress:', error);
    return null;
  }
}

/**
 * Pobieranie statystyk gry
 * @returns Promise ze statystykami
 */
export async function getGameStats(): Promise<GameStats | null> {
  try {
    const url = `${WP_API_URL}/${WP_CUSTOM_NAMESPACE}/stats`;

    console.log('Fetching game stats from WordPress:', url);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }

    const data: GameStats = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching game stats from WordPress:', error);
    return null;
  }
}

/**
 * Cache'owanie danych wyzwań w localStorage
 * @param challenges - Tablica wyzwań do cache'owania
 */
export function cacheChallenges(challenges: VolunteerOpportunity[]): void {
  try {
    localStorage.setItem('bydgo_challenges_cache', JSON.stringify(challenges));
    localStorage.setItem('bydgo_challenges_cache_timestamp', Date.now().toString());
    console.log('Challenges cached successfully');
  } catch (error) {
    console.error('Error caching challenges:', error);
  }
}

/**
 * Sprawdzenie czy cache jest aktualny (ważny przez 1 godzinę)
 * @returns true jeśli cache jest aktualny
 */
export function isCacheValid(): boolean {
  const timestamp = localStorage.getItem('bydgo_challenges_cache_timestamp');
  if (!timestamp) return false;

  const cacheAge = Date.now() - parseInt(timestamp, 10);
  const oneHour = 60 * 60 * 1000;

  return cacheAge < oneHour;
}

/**
 * Walidacja konfiguracji WordPress API
 * @returns true jeśli API jest skonfigurowane
 */
export function isWPConfigured(): boolean {
  return WP_API_URL !== 'https://your-wordpress-site.com/wp-json' && WP_API_URL.length > 0;
}

/**
 * Test połączenia z WordPress API
 * @returns Promise z wynikiem testu
 */
export async function testWPConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const url = `${WP_API_URL}/${WP_REST_NAMESPACE}/wyzwania?per_page=1`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: `API Error: ${response.status} ${response.statusText}`,
      };
    }

    return {
      success: true,
      message: 'WordPress API connection successful!',
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
