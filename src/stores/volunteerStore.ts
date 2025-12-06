import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { VolunteerOpportunity, VolunteerApplication, FilterState, VolunteerCategory } from '@/types/volunteer.types';
import { volunteerOpportunities } from '@/data/volunteerData';

interface VolunteerStore {
  // State
  opportunities: VolunteerOpportunity[];
  applications: VolunteerApplication[];
  filters: FilterState;
  selectedOpportunity: VolunteerOpportunity | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setOpportunities: (opportunities: VolunteerOpportunity[]) => void;
  setSelectedOpportunity: (opportunity: VolunteerOpportunity | null) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  addApplication: (application: Omit<VolunteerApplication, 'id' | 'appliedAt'>) => void;
  updateApplicationStatus: (id: string, status: VolunteerApplication['status']) => void;
  getFilteredOpportunities: () => VolunteerOpportunity[];
  getOpportunitiesByCategory: (category: VolunteerCategory) => VolunteerOpportunity[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const initialFilters: FilterState = {
  categories: [],
  searchQuery: '',
  dateRange: {},
  difficulty: [],
  isUrgentOnly: false,
};

export const useVolunteerStore = create<VolunteerStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      opportunities: volunteerOpportunities,
      applications: [],
      filters: initialFilters,
      selectedOpportunity: null,
      isLoading: false,
      error: null,

      // Actions
      setOpportunities: (opportunities) => {
        set({ opportunities }, false, 'setOpportunities');
      },

      setSelectedOpportunity: (opportunity) => {
        set({ selectedOpportunity: opportunity }, false, 'setSelectedOpportunity');
      },

      updateFilters: (newFilters) => {
        set(
          (state) => ({
            filters: { ...state.filters, ...newFilters },
          }),
          false,
          'updateFilters'
        );
      },

      clearFilters: () => {
        set({ filters: initialFilters }, false, 'clearFilters');
      },

      addApplication: (applicationData) => {
        const newApplication: VolunteerApplication = {
          ...applicationData,
          id: crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9),
          status: 'pending',
          appliedAt: new Date().toISOString(),
        };

        set(
          (state) => ({
            applications: [...state.applications, newApplication],
          }),
          false,
          'addApplication'
        );
      },

      updateApplicationStatus: (id, status) => {
        set(
          (state) => ({
            applications: state.applications.map((app) =>
              app.id === id ? { ...app, status } : app
            ),
          }),
          false,
          'updateApplicationStatus'
        );
      },

      getFilteredOpportunities: () => {
        const { opportunities, filters } = get();
        
        return opportunities.filter((opportunity) => {
          // Category filter
          if (filters.categories.length > 0 && !filters.categories.includes(opportunity.category)) {
            return false;
          }

          // Search query filter
          if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            const searchableText = `${opportunity.title} ${opportunity.description} ${opportunity.organization}`.toLowerCase();
            if (!searchableText.includes(query)) {
              return false;
            }
          }

          // Date range filter
          if (filters.dateRange.start) {
            const startDate = new Date(filters.dateRange.start);
            const opportunityStart = new Date(opportunity.date.start);
            if (opportunityStart < startDate) {
              return false;
            }
          }

          if (filters.dateRange.end) {
            const endDate = new Date(filters.dateRange.end);
            const opportunityEnd = new Date(opportunity.date.end);
            if (opportunityEnd > endDate) {
              return false;
            }
          }

          // Difficulty filter
          if (filters.difficulty.length > 0 && !filters.difficulty.includes(opportunity.difficulty)) {
            return false;
          }

          // Urgent filter
          if (filters.isUrgentOnly && !opportunity.isUrgent) {
            return false;
          }

          return true;
        });
      },

      getOpportunitiesByCategory: (category) => {
        const { opportunities } = get();
        return opportunities.filter((opp) => opp.category === category);
      },

      setLoading: (loading) => {
        set({ isLoading: loading }, false, 'setLoading');
      },

      setError: (error) => {
        set({ error }, false, 'setError');
      },
    }),
    {
      name: 'volunteer-store',
    }
  )
);