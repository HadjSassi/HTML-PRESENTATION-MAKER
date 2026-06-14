import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeMode = "dark" | "light";

interface SettingsState {
  theme: ThemeMode;
  showRulers: boolean;
  snapToGrid: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleRulers: () => void;
  toggleSnap: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "dark",
      showRulers: false,
      snapToGrid: false,
      setTheme: (theme) => set({ theme }),
      toggleRulers: () => set((s) => ({ showRulers: !s.showRulers })),
      toggleSnap: () => set((s) => ({ snapToGrid: !s.snapToGrid })),
    }),
    { name: "hpm-settings" },
  ),
);
