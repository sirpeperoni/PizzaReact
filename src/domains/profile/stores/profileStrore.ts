import { create } from 'zustand';
import type { HistoryOrder } from '../../../shared/types/historyOrder';
import { devtools, persist } from 'zustand/middleware';
import { profileService } from '../services/profileService';

interface ProfileStore {
  history: HistoryOrder[];
  isLoading: boolean;
  error: string | null;

  fetchHistory: () => Promise<void>;
}

export const useProfileStore = create<ProfileStore>()(
  devtools(
    persist(
      set => ({
        history: [],
        isLoading: false,
        error: null,

        fetchHistory: async () => {
          try {
            set({ isLoading: true, error: null });
            const profileHitory = await profileService.fetchHistory();
            set({ isLoading: false, history: profileHitory });
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch history';
            console.log(errorMessage);
            set({ isLoading: false, error: errorMessage });
          }
        },
      }),
      {
        name: 'profile-storage',
      },
    ),
    {
      name: 'ProfileStore',
    },
  ),
);
