import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Stamp {
  pathId: string;
  checkpointId: string;
  collectedAt: Date;
  title: string;
  pathTitle: string;
}

export interface AccessibilitySettings {
  contrast: 'standard' | 'high' | 'dark';
  saturation: number;
  textScale: number;
  lineHeight: number;
  letterSpacing: number;
  contentScale: number;
  invertColors: boolean;
  monochrome: boolean;
  highlightLinks: boolean;
  highlightHeadings: boolean;
  seniorMode: boolean;
}

export interface UserScenario {
  id: string;
  title: string;
  description: string;
  location: string;
  coordinates: [number, number];
  type: 'field' | 'virtual';
  category: PathCategory;
  question: string;
  answer: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: Date;
  accessibleFromHome?: boolean;
}

export type PathCategory = string;

interface AppState {
  // Authentication State
  isLoggedIn: boolean;
  authToken: string | null;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;

  // GPS Simulation
  isGpsSimulated: boolean;
  toggleGpsSimulation: () => void;
  
  // Path Progress
  stamps: Stamp[];
  addStamp: (stamp: Stamp) => void;
  hasStamp: (pathId: string, checkpointId: string) => boolean;
  getPathProgress: (pathId: string) => number;
  getCompletedCheckpoints: (pathId: string) => string[];
  isCheckpointUnlocked: (pathId: string, checkpointOrder: number) => boolean;
  isPathCompleted: (pathId: string) => boolean;
  getTotalStamps: () => number;
  
  // Active path/checkpoint
  activePathId: string | null;
  activeCheckpointId: string | null;
  setActivePath: (pathId: string | null) => void;
  setActiveCheckpoint: (checkpointId: string | null) => void;
  
  // Accessibility
  accessibility: AccessibilitySettings;
  setContrast: (contrast: AccessibilitySettings['contrast']) => void;
  setSaturation: (saturation: number) => void;
  setTextScale: (scale: number) => void;
  setLineHeight: (height: number) => void;
  setLetterSpacing: (spacing: number) => void;
  setContentScale: (scale: number) => void;
  setInvertColors: (invert: boolean) => void;
  setMonochrome: (mono: boolean) => void;
  setHighlightLinks: (highlight: boolean) => void;
  setHighlightHeadings: (highlight: boolean) => void;
  setSeniorMode: (enabled: boolean) => void;
  
  // User-created scenarios
  userScenarios: UserScenario[];
  addUserScenario: (scenario: Omit<UserScenario, 'id' | 'status' | 'submittedAt'>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Authentication
      isLoggedIn: false,
      authToken: null,
      username: null,
      login: (token, username) => set({ isLoggedIn: true, authToken: token, username: username }),
      logout: () => set({ isLoggedIn: false, authToken: null, username: null }),

      // GPS Simulation
      isGpsSimulated: false,
      toggleGpsSimulation: () => set((state) => ({ isGpsSimulated: !state.isGpsSimulated })),
      
      // Stamps
      stamps: [],
      addStamp: (stamp) => set((state) => ({
        stamps: [...state.stamps, stamp]
      })),
      hasStamp: (pathId, checkpointId) => 
        get().stamps.some(s => s.pathId === pathId && s.checkpointId === checkpointId),
      
      getPathProgress: (pathId) => {
        const stamps = get().stamps.filter(s => s.pathId === pathId);
        return stamps.length;
      },
      
      getCompletedCheckpoints: (pathId) => {
        return get().stamps
          .filter(s => s.pathId === pathId)
          .map(s => s.checkpointId);
      },
      
      isCheckpointUnlocked: (pathId, checkpointOrder) => {
        if (checkpointOrder === 1) return true;
        const completedCount = get().getPathProgress(pathId);
        return completedCount >= checkpointOrder - 1;
      },
      
      isPathCompleted: (pathId) => {
        const stamps = get().stamps.filter(s => s.pathId === pathId);
        return stamps.length > 0;
      },
      
      getTotalStamps: () => get().stamps.length,
      
      // Active selections
      activePathId: null,
      activeCheckpointId: null,
      setActivePath: (pathId) => set({ activePathId: pathId, activeCheckpointId: null }),
      setActiveCheckpoint: (checkpointId) => set({ activeCheckpointId: checkpointId }),
      
      // Accessibility
      accessibility: {
        contrast: 'standard',
        saturation: 1,
        textScale: 1,
        lineHeight: 1.5,
        letterSpacing: 0,
        contentScale: 1,
        invertColors: false,
        monochrome: false,
        highlightLinks: false,
        highlightHeadings: false,
        seniorMode: false,
      },
      setContrast: (contrast) => set((state) => ({
        accessibility: { ...state.accessibility, contrast }
      })),
      setSaturation: (saturation) => set((state) => ({
        accessibility: { ...state.accessibility, saturation }
      })),
      setTextScale: (scale) => set((state) => ({
        accessibility: { ...state.accessibility, textScale: scale }
      })),
      setLineHeight: (height) => set((state) => ({
        accessibility: { ...state.accessibility, lineHeight: height }
      })),
      setLetterSpacing: (spacing) => set((state) => ({
        accessibility: { ...state.accessibility, letterSpacing: spacing }
      })),
      setContentScale: (scale) => set((state) => ({
        accessibility: { ...state.accessibility, contentScale: scale }
      })),
      setInvertColors: (invert) => set((state) => ({
        accessibility: { ...state.accessibility, invertColors: invert }
      })),
      setMonochrome: (mono) => set((state) => ({
        accessibility: { ...state.accessibility, monochrome: mono }
      })),
      setHighlightLinks: (highlight) => set((state) => ({
        accessibility: { ...state.accessibility, highlightLinks: highlight }
      })),
      setHighlightHeadings: (highlight) => set((state) => ({
        accessibility: { ...state.accessibility, highlightHeadings: highlight }
      })),
      setSeniorMode: (enabled) => set((state) => ({
        accessibility: {
          ...state.accessibility,
          seniorMode: enabled,
          textScale: enabled ? 1.4 : 1,
          contrast: enabled ? 'high' : 'standard',
          lineHeight: enabled ? 1.8 : 1.5,
        }
      })),
      
      // User scenarios
      userScenarios: [],
      addUserScenario: (scenario) => set((state) => ({
        userScenarios: [
          ...state.userScenarios,
          {
            ...scenario,
            id: `user-${Date.now()}`,
            status: 'pending',
            submittedAt: new Date(),
          }
        ]
      })),
    }),
    {
      name: 'bydgo-app-storage',
      partialize: (state) => ({ 
        isLoggedIn: state.isLoggedIn, 
        authToken: state.authToken, 
        username: state.username,
        stamps: state.stamps, // Also persist stamps
      }),
    }
  )
);
