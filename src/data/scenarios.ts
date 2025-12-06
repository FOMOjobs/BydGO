export type ScenarioType = 'field' | 'virtual';

export interface Scenario {
  id: string;
  title: string;
  location: string;
  coordinates: [number, number]; // [lat, lng]
  type: ScenarioType;
  story: string;
  task: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  completed?: boolean;
  verified: boolean;
  verifiedBy?: string;
}
const WP_API_URL = 'https://bydgo.liswoska26.com/wp-json/wp/v2/scenariusz';

export const fetchScenarios = async (): Promise<Scenario[]> => {
  const res = await fetch(WP_API_URL);
  if (!res.ok) {
    throw new Error('Błąd podczas pobierania scenariuszy');
  }
  const data = await res.json();

  // Mapowanie danych z WP na nasz typ Scenario
  return data.map((item: any) => ({
    id: item.id.toString(),
    title: item.title.rendered,
    location: item.acf?.location || '',
    coordinates: item.acf?.coordinates || [0, 0], // lat,lng w tablicy
    type: item.acf?.type || 'field',
    story: item.acf?.story || '',
    task: item.acf?.task || '',
    answer: item.acf?.answer || '',
    difficulty: item.acf?.difficulty || 'easy',
    imageUrl: item.acf?.image?.url,
    verified: item.acf?.verified || false,
    verifiedBy: item.acf?.verified_by || undefined,
  }));
};

export const getScenarioById = async (id: string): Promise<Scenario | undefined> => {
  const scenarios = await fetchScenarios();
  return scenarios.find(s => s.id === id);
};

export const getFieldScenarios = async (): Promise<Scenario[]> => {
  const scenarios = await fetchScenarios();
  return scenarios.filter(s => s.type === 'field');
};

export const getVirtualScenarios = async (): Promise<Scenario[]> => {
  const scenarios = await fetchScenarios();
  return scenarios.filter(s => s.type === 'virtual');
};