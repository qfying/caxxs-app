import { create } from 'zustand';

interface UserState {
  userId: string | null;
  token: string | null;
  setUser: (userId: string, token: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>(set => ({
  userId: null,
  token: null,
  setUser: (userId: string, token: string) => set({ userId, token }),
  clearUser: () => set({ userId: null, token: null }),
}));
