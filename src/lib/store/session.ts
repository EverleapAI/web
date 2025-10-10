import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type User = {
  id: number;
  name: string;
  email: string;
} | null;

type SessionState = {
  token?: string;
  user: User;
  setToken: (token?: string) => void;
  setUser: (user: User) => void;
  clear: () => void;
  isAuthenticated: () => boolean;
};

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      token: undefined,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      clear: () => set({ token: undefined, user: null }),
      isAuthenticated: () => Boolean(get().token && get().user),
    }),
    {
      name: "everleap-session",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ token: s.token, user: s.user }), // only persist essentials
    }
  )
);
